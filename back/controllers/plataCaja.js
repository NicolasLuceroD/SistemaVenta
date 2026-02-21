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
            -- TOTAL VENTAS
            COALESCE((
                SELECT SUM(v.precioTotal_venta)
                FROM venta v
                WHERE v.Id_caja = pcl.Id_caja
                AND v.Id_usuario = pcl.Id_usuario
                AND v.fecha_registro >= pcl.FechaRegistro
                AND v.Id_metodoPago != 5
            ), 0) AS total_ventas,

            -- TOTAL INGRESOS
            COALESCE((
                SELECT SUM(i.montoTotalIngreso)
                FROM ingreso i
                WHERE i.Id_caja = pcl.Id_caja
                AND i.Id_usuario = pcl.Id_usuario
                AND i.FechaRegistro >= pcl.FechaRegistro
            ), 0) AS total_ingresos,

            -- TOTAL EGRESOS
            COALESCE((
                SELECT SUM(e.montoTotalEgreso)
                FROM egreso e
                WHERE e.Id_caja = pcl.Id_caja
                AND e.Id_usuario = pcl.Id_usuario
                AND e.FechaRegistro >= pcl.FechaRegistro
            ), 0) AS total_egresos,

            -- TOTAL PAGOS (ENGANCHADO POR VENTA)
            COALESCE((
                SELECT SUM(p.monto)
                FROM pagos p
                INNER JOIN venta v2 ON v2.Id_venta = p.Id_venta
                WHERE v2.Id_caja = pcl.Id_caja
                AND v2.Id_usuario = pcl.Id_usuario
                AND p.fechaRegsitro >= pcl.FechaRegistro
                AND p.Id_metodoPago != 5
            ), 0) AS total_pagos,

            -- TOTAL CIERRE (USANDO LAS MISMAS SUBCONSULTAS)
            ROUND(
                pcl.cantidadPlataLogin
                + COALESCE((
                    SELECT SUM(v.precioTotal_venta)
                    FROM venta v
                    WHERE v.Id_caja = pcl.Id_caja
                    AND v.Id_usuario = pcl.Id_usuario
                    AND v.fecha_registro >= pcl.FechaRegistro
                    AND v.Id_metodoPago != 5
                ), 0)
                + COALESCE((
                    SELECT SUM(i.montoTotalIngreso)
                    FROM ingreso i
                    WHERE i.Id_caja = pcl.Id_caja
                    AND i.Id_usuario = pcl.Id_usuario
                    AND i.FechaRegistro >= pcl.FechaRegistro
                ), 0)
                + COALESCE((
                    SELECT SUM(p.monto)
                    FROM pagos p
                    INNER JOIN venta v2 ON v2.Id_venta = p.Id_venta
                    WHERE v2.Id_caja = pcl.Id_caja
                    AND v2.Id_usuario = pcl.Id_usuario
                    AND p.fechaRegsitro >= pcl.FechaRegistro
                    AND p.Id_metodoPago != 5
                ), 0)
                - COALESCE((
                    SELECT SUM(e.montoTotalEgreso)
                    FROM egreso e
                    WHERE e.Id_caja = pcl.Id_caja
                    AND e.Id_usuario = pcl.Id_usuario
                    AND e.FechaRegistro >= pcl.FechaRegistro
                ), 0)
            , 2) AS total_cierre
        FROM plataencajalogin pcl
        WHERE pcl.Id_caja = ?
        AND pcl.Id_usuario = ?
        AND pcl.estado = 1;
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
  const { Id_usuario, Id_caja } = req.body;

  try {
    const [result] = await connection.promise().query(
      `UPDATE plataencajalogin
       SET estado = 0
       WHERE Id_usuario = ?
       AND Id_caja = ?
       AND estado = 1`,
      [Id_usuario, Id_caja]
    );

    res.json({
      mensaje: "Caja cerrada correctamente",
      filasAfectadas: result.affectedRows
    });

  } catch (error) {
    console.error("Error al cerrar la caja:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


const verMetodosPagos = (req, res) => {
  const { Id_caja, Id_usuario } = req.params;

  connection.query(`
    SELECT
      r.Id_item,
      r.tipo_item,
      r.total
    FROM (
      /* ===============================
         1) MÉTODOS DE PAGO (SIN CIGARRILLOS)
         =============================== */
      SELECT
        m.Id_metodoPago AS Id_item,
        m.tipo_metodoPago AS tipo_item,
        ROUND(
          COALESCE(vm.total_metodo, 0) - COALESCE(cm.total_cigarrillos, 0),
          2
        ) AS total
      FROM metopago m
      LEFT JOIN (
        SELECT
          v.Id_metodoPago,
          SUM(v.precioTotal_venta) AS total_metodo
        FROM venta v
        WHERE v.Id_caja = ?
          AND v.Id_usuario = ?
          AND v.fecha_registro >= (
            SELECT MAX(FechaRegistro)
            FROM plataencajalogin
            WHERE Id_caja = ? AND Id_usuario = ? AND estado = 1
          )
        GROUP BY v.Id_metodoPago
      ) vm ON vm.Id_metodoPago = m.Id_metodoPago

      LEFT JOIN (
        /* TOTAL CIGARRILLOS POR MÉTODO (BIEN CALCULADO) */
        SELECT
          v.Id_metodoPago,
          SUM(
            dv.CantidadVendida *
            CASE
              WHEN v.Id_sucursal = 1 THEN p.precioVentaSucGuillermina
              WHEN v.Id_sucursal = 2 THEN p.precioVentaSucSanMartin
              ELSE p.precioVentaSucGuillermina
            END
          ) AS total_cigarrillos
        FROM venta v
        INNER JOIN detalleventa dv ON dv.Id_venta = v.Id_venta
        INNER JOIN producto p ON p.Id_producto = dv.Id_producto
        WHERE v.Id_caja = ?
          AND v.Id_usuario = ?
          AND v.fecha_registro >= (
            SELECT MAX(FechaRegistro)
            FROM plataencajalogin
            WHERE Id_caja = ? AND Id_usuario = ? AND estado = 1
          )
          AND p.Id_categoria = 10
        GROUP BY v.Id_metodoPago
      ) cm ON cm.Id_metodoPago = m.Id_metodoPago

      WHERE COALESCE(vm.total_metodo, 0) > 0

      UNION ALL

      /* ===============================
         2) TOTAL GENERAL DE CIGARRILLOS
         =============================== */
      SELECT
        999999 AS Id_item,
        'Cigarrillos' AS tipo_item,
        ROUND(
          SUM(
            dv.CantidadVendida *
            CASE
              WHEN v.Id_sucursal = 1 THEN p.precioVentaSucGuillermina
              WHEN v.Id_sucursal = 2 THEN p.precioVentaSucSanMartin
              ELSE p.precioVentaSucGuillermina
            END
          ),
          2
        ) AS total
      FROM venta v
      INNER JOIN detalleventa dv ON dv.Id_venta = v.Id_venta
      INNER JOIN producto p ON p.Id_producto = dv.Id_producto
      WHERE v.Id_caja = ?
        AND v.Id_usuario = ?
        AND v.fecha_registro >= (
          SELECT MAX(FechaRegistro)
          FROM plataencajalogin
          WHERE Id_caja = ? AND Id_usuario = ? AND estado = 1
        )
        AND p.Id_categoria = 10
    ) r
    ORDER BY
      CASE WHEN r.Id_item = 999999 THEN 2 ELSE 1 END,
      r.total DESC;
  `,
  [
    Id_caja, Id_usuario, Id_caja, Id_usuario,
    Id_caja, Id_usuario, Id_caja, Id_usuario,
    Id_caja, Id_usuario, Id_caja, Id_usuario
  ],
  (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};


module.exports = {verPlataCaja, IngresarPlata,verUltimoIngreso,
    verCantidadTotal,verificarCajaAbierta,cerrarCaja,verMetodosPagos}