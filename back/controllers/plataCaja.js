const {connection} = require('../database/config')


const verPlataCaja = (req, res) => {
    const Id_sucursal = req.params.Id_sucursal;
    const FechaRegistro = req.params.fechaSeleccionada; 
    connection.query(`    
    SELECT u.nombre_usuario, s.nombre_sucursal, p.CantidadPlata, p.FechaRegistro, p.faltante, c.Id_caja
        FROM plataencaja p
        INNER JOIN usuarios u ON u.Id_usuario = p.Id_usuario
        INNER JOIN sucursales s ON s.Id_sucursal = p.Id_sucursal
        INNER JOIN caja c ON c.Id_caja = p.Id_caja
        WHERE s.Id_sucursal = ?
        AND Date(p.FechaRegistro) = ?`, [Id_sucursal, FechaRegistro], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};


const IngresarPlata = (req,res)=>{
    connection.query("INSERT INTO plataencaja SET ?",{
        Id_sucursal: req.body.Id_sucursal,
        cantidadPlata: req.body.cantidadPlata,
        Id_usuario: req.body.Id_usuario,
        faltante: req.body.faltante,
        Id_caja: req.body.IdCaja 
    },(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}





const verUltimoIngreso = (req,res) =>{
    connection.query("SELECT * FROM plataencajalogin ORDER BY FechaRegistro DESC LIMIT 1"
    ,(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}

   
const verCantidadTotal = (req, res) => {
    const Id_usuario = req.params.Id_usuario;
    const Id_caja = req.params.Id_caja;

    connection.query(`
        SELECT 
            pcl.cantidadPlataLogin AS montoInicial,
            COALESCE(SUM(v.precioTotal_venta), 0) AS total_ventas,
            COALESCE(SUM(i.montoTotalIngreso), 0) AS total_ingresos,
            COALESCE(SUM(e.montoTotalEgreso), 0) AS total_egresos,
            COALESCE(SUM(p.monto), 0) AS total_pagos,
            ROUND(
                pcl.cantidadPlataLogin 
                + COALESCE(SUM(v.precioTotal_venta), 0)
                + COALESCE(SUM(i.montoTotalIngreso), 0)
                + COALESCE(SUM(p.monto), 0)
                - COALESCE(SUM(e.montoTotalEgreso), 0),
            2) AS total_cierre
        FROM plataencajalogin pcl
        LEFT JOIN venta v 
            ON v.Id_caja = pcl.Id_caja 
            AND v.Id_usuario = pcl.Id_usuario 
            AND v.fecha_registro >= pcl.FechaRegistro
            AND v.Id_metodoPago != 5
        LEFT JOIN ingreso i 
            ON i.Id_caja = pcl.Id_caja 
            AND i.Id_usuario = pcl.Id_usuario 
            AND i.FechaRegistro >= pcl.FechaRegistro
        LEFT JOIN egreso e 
            ON e.Id_caja = pcl.Id_caja 
            AND e.Id_usuario = pcl.Id_usuario 
            AND e.FechaRegistro >= pcl.FechaRegistro
        LEFT JOIN pagos p 
            ON p.Id_metodoPago != 5
            AND p.fechaRegsitro >= pcl.FechaRegistro
        WHERE pcl.Id_caja = ? 
          AND pcl.Id_usuario = ?
          AND pcl.estado = 1
        GROUP BY pcl.cantidadPlataLogin;
    `, [Id_caja, Id_usuario], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};

const verificarCajaAbierta = async (req, res) => {
    const Id_usuario = req.body.Id_usuario
    const Id_caja = req.body.Id_caja

    console.log("REQ body Id_usuario recibido:", Id_usuario); 
    console.log("REQ body Id_caja recibido:", Id_caja); 

    if (!Id_usuario || !Id_caja) {
        return res.status(400).json({ error: "idUsuario e idCaja son requeridos" });
    }


    try {
        const [result] = await connection.promise().query(
            `SELECT cantidadPlataLogin FROM plataencajalogin 
             WHERE Id_usuario = ? AND Id_caja = ? AND estado = 1
             ORDER BY FechaRegistro DESC LIMIT 1`,
            [Id_usuario, Id_caja]
        );

        console.log("Resultado de la consulta:", result); 

        if (result.length > 0) {
            return res.json({
                cajaAbierta: true,
                montoInicial: result[0].cantidadPlataLogin
            });
        } else {
            return res.json({
                cajaAbierta: false,
                montoInicial: 0
            });
        }
    } catch (error) {
        console.error("Error al verificar la caja:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};



const cerrarCaja = async (req, res) => {
    const Id_usuario = req.body.Id_usuario
    const Id_caja = req.body.Id_caja

    console.log('Id_usuario EN CERRAR CAJA', Id_usuario)
    console.log('Id_caja EN CERRAR CAJA', Id_caja)
    try {
         connection.query(
            `UPDATE plataencajalogin 
             SET estado = 0 
             WHERE Id_usuario = ? 
             AND Id_caja = ? 
             AND estado = 1`,
            [Id_usuario, Id_caja]
        );

        return res.json({ mensaje: "Caja cerrada correctamente" });
    } catch (error) {
        console.error("Error al cerrar la caja:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};


module.exports = {verPlataCaja, IngresarPlata,verUltimoIngreso,
    verCantidadTotal,verificarCajaAbierta,cerrarCaja}