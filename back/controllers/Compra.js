const {connection} = require('../database/config')


const verCompraConFecha = (req, res) => {
    const fechaSeleccionada = req.params.fechaSeleccionada;
    const sucursalId = req.params.sucursalId;

    const query = `
        SELECT 
            c.Id_compra,
            c.descripcion_compra, 
            c.totalCompra, 
            c.estado_compra, 
            c.personaPideCompra, 
            c.personaRecibeCompra, 
            c.FechaRegistro, 
            c.FechaLlegada,
            p.Id_proveedor, 
            p.nombre_proveedor,
            s.Id_sucursal
        FROM 
            compra c
        INNER JOIN 
            proveedores p ON p.Id_proveedor = c.Id_proveedor
        INNER JOIN 
            sucursales s ON s.Id_sucursal = c.Id_sucursal
        WHERE 
            DATE(c.FechaRegistro) = ?
            AND c.Id_sucursal = ?
        ORDER BY 
            c.FechaLlegada ASC
    `;
    connection.query(query, [fechaSeleccionada, sucursalId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};

const verCompra = (req,res) =>{
    connection.query("SELECT * FROM compra",(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}



const verTotalSaldo = (req, res) => {
    const fechaSeleccionada = req.params.fechaSeleccionada;
    const sucursalId = req.params.sucursalId
    connection.query(
        `SELECT SUM(c.totalCompra) AS total_pendiente
         FROM compra c
         WHERE c.estado_compra = 'pendiente'
         AND DATE(c.FechaRegistro) = ?
         AND c.Id_sucursal = ?`,
        [fechaSeleccionada,sucursalId], 
        (error, results) => {
            if (error) throw error;
            res.json(results);
        }
    );
};



const crearCompra = (req, res) => {
    const Id_sucursal = req.body.Id_sucursal;
    connection.query("INSERT INTO compra SET ?", {
        descripcion_compra: req.body.descripcion_compra,
        totalCompra: req.body.totalCompra,
        estado_compra: req.body.estado_compra,
        personaPideCompra: req.body.personaPideCompra,
        personaRecibeCompra: req.body.personaRecibeCompra,
        Id_sucursal: Id_sucursal,
        Id_proveedor: req.body.Id_proveedor,
        FechaLlegada: req.body.FechaLlegada,
        Id_metodoPago: 5,
        faltaPagar: req.body.totalCompra,
        Id_usuario: req.body.Id_usuario
    }, (error, results) => {
        if (error) {
            console.error("Error al insertar la compra:", error);
            throw error;
        }
        res.json(results);
    });
}



 const editarCompra = (req,res) => {
    const Id_compra = req.params.Id_compra
    const {descripcion_compra,totalCompra,estado_compra,personaPideCompra,personaRecibeCompra,Id_sucursal,Id_proveedor} = req.body
    connection.query(`UPDATE compra SET 
                    descripcion_compra = '${descripcion_compra}',
                    totalCompra = '${totalCompra}',
                    estado_compra = '${estado_compra}',
                    personaPideCompra = '${personaPideCompra}',
                    personaRecibeCompra = '${personaRecibeCompra}',
                    Id_sucursal = '${Id_sucursal}',
                    Id_proveedor = '${Id_proveedor}'

                    WHERE Id_compra = ${Id_compra}
    `,(error,results)=>{
        if(error) throw error
        res.json(results)
    })
 }

 /*ELIMINAR COMPRA*/
 const eliminarCompra = (req, res) => {
  const Id_compra = req.params.Id_compra;
  connection.query(
    `UPDATE compra SET estado_compra = 'cancelada', faltaPagar = 0.00 WHERE Id_compra = ?`,
    [Id_compra], 
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};



 const verCompraCorte = (req, res) => {
  const fecha = req.params.fecha;
  const sucursalId = req.params.sucursalId;

  let query = `
    SELECT 
      c.Id_compra,
      c.descripcion_compra, 
      c.totalCompra, 
      c.estado_compra, 
      c.personaPideCompra, 
      c.personaRecibeCompra, 
      c.FechaRegistro, 
      c.FechaLlegada,
      p.Id_proveedor, 
      p.nombre_proveedor
    FROM 
      compra c
    INNER JOIN 
      proveedores p ON p.Id_proveedor = c.Id_proveedor
    WHERE c.Id_sucursal = ?
  `;

  const values = [sucursalId];

  if (fecha !== "all") {
    query += ` AND DATE(c.FechaLlegada) = ?`;
    values.push(fecha);
  }

  query += ` ORDER BY c.FechaLlegada ASC`;

  connection.query(query, values, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};


  const verComprasAnuladas = (req,res) => {
    const {idCompra} = req.params
    connection.query(`SELECT c.*, u.nombre_usuario 
                      FROM cancelaciones c
                      INNER JOIN usuarios u ON c.Id_usuario = u.Id_usuario
                      WHERE c.Id_compra = ?`, [idCompra],(error,results) => {
      if (error) throw error
      res.json(results)
    })
  }

  const verPagosProveedores = (req,res) => {
    const {idCompra} = req.params
    connection.query(`SELECT pp.*, u.nombre_usuario
                      FROM pagosproveedores pp
                      INNER JOIN usuarios u ON pp.Id_usuario = u.Id_usuario
                      WHERE pp.Id_compra = ?`, [idCompra] , (error,results) => {
      if (error) throw error
      res.json(results)
    })
  }
  

 /*CONSULTAS PARA LOS H6*/


 /* COMPRAS TOTALES */
const verComprasTotales = (req, res) => {
  const { sucursalId } = req.params;
  connection.query(
    'SELECT COUNT(*) AS total_compras FROM compra WHERE Id_sucursal = ?',
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

/* COMPRAS PENDIENTES */
const verComprasPendientes = (req, res) => {
  const { sucursalId } = req.params;
  connection.query(
    `SELECT COUNT(*) AS compras_pendientes FROM compra WHERE estado_compra = 'pendiente' AND Id_sucursal = ?`,
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

/* COMPRAS CANCELADAS */
const verComprasCanceladas = (req, res) => {
  const { sucursalId } = req.params;
  connection.query(
    `SELECT COUNT(*) AS compras_canceladas FROM compra WHERE estado_compra = 'cancelada' AND Id_sucursal = ?`,
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

/* COMPRAS PAGADAS */
const verComprasPagadas = (req, res) => {
  const { sucursalId } = req.params;
  connection.query(
    `SELECT COUNT(*) AS compras_pagadas FROM compra WHERE estado_compra = 'pagada' AND Id_sucursal = ?`,
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

/* COMPRAS NO PAGADAS */
const verComprasNoPagadas = (req, res) => {
  const { sucursalId } = req.params;
  connection.query(
    `SELECT COUNT(*) AS compras_no_pagadas FROM compra WHERE estado_compra != 'pagada' AND Id_sucursal = ?`,
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

/* MONTO DE COMPRAS PAGADAS */
const verMontoComprasPagadas = (req, res) => {
  const { sucursalId } = req.params;
  connection.query(
    `SELECT SUM(totalCompra) AS monto_compras_pagadas FROM compra WHERE estado_compra = 'pagada' AND Id_sucursal = ?`,
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

/* MONTO DE COMPRAS NO PAGADAS */
const verMontoComprasNoPagadas = (req, res) => {
  const { sucursalId } = req.params;
  connection.query(
    `SELECT SUM(totalCompra) AS monto_compras_no_pagadas FROM compra WHERE estado_compra NOT IN ('pagada', 'cancelada') AND Id_sucursal = ?`,
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};


  
 




module.exports = {verCompraConFecha,crearCompra,editarCompra,verCompra,verTotalSaldo,verCompraCorte,verComprasTotales,verComprasPendientes,verComprasPagadas,verComprasNoPagadas,verMontoComprasPagadas,verMontoComprasNoPagadas,eliminarCompra,verComprasCanceladas,verComprasAnuladas,verPagosProveedores}