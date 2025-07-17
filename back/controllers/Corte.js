const {connection} = require("../database/config")

const ventaTotal = (req, res) => {
  const fechaSeleccionada = req.query.formattedDate;
  const Id_sucursal = req.query.id_sucursal;
  connection.query(
    `SELECT 
      metopago.tipo_metodoPago AS tipo_metodo_pago, 
      SUM(v.precioTotal_venta) AS monto_total 
    FROM 
      venta v
    INNER JOIN 
      metopago ON v.Id_metodoPago = metopago.Id_metodoPago 
    WHERE 
      DATE(v.fecha_registro) = ?
    AND 
    v.Id_sucursal = ?
    GROUP BY 
      metopago.tipo_metodoPago;
      `, [fechaSeleccionada,Id_sucursal], (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
} 


const ventaTotalconUsuario = (req, res) => {
   const fechaSeleccionada = req.params.fechaSeleccionada;
  const Id_usuario = req.params.Id_usuario
  const Id_caja = req.params.Id_caja
  const Id_sucursal = req.params.Id_sucursal
  connection.query(
    `
    SELECT 
      metopago.tipo_metodoPago AS tipo_metodo_pago, 
      SUM(v.precioTotal_venta) AS monto_total 
    FROM 
      venta v
    INNER JOIN 
      metopago ON v.Id_metodoPago = metopago.Id_metodoPago 
	INNER JOIN 
      caja cj ON cj.Id_caja = v.Id_caja  
    WHERE 
      DATE(v.fecha_registro) = ?
    AND 
    v.Id_sucursal = ?
     AND 
    v.Id_usuario = ?
     AND 
    cj.Id_caja = ?
    GROUP BY 
      metopago.tipo_metodoPago;`, [fechaSeleccionada,Id_sucursal,Id_usuario,Id_caja], (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
}





const ventaTotalxMES = (req, res) => {
  const { formattedFirstDayOfMonth, formattedLastDayOfMonth} = req.query;
    connection.query(
      `SELECT 
      metopago.tipo_metodoPago AS tipo_metodo_pago, 
      SUM(venta.precioTotal_venta) AS monto_total 
      FROM 
      venta 
      INNER JOIN 
      metopago ON venta.Id_metodoPago = metopago.Id_metodoPago 
      WHERE 
      venta.fecha_registro BETWEEN ? AND ?
      GROUP BY 
      metopago.tipo_metodoPago;`, [formattedFirstDayOfMonth, formattedLastDayOfMonth],
       (error, results) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } 
  
  const verVentaXMes = (req, response) => {
    connection.query("SELECT * FROM venta WHERE MONTH(fecha_registro) = 4",
    (error, results) =>{                                                                                                                                                                                                               
      if(error) throw error;
      response.json(results);
    }
  )
}
  
  const ventaxCategoria = (req,res) =>{
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(`SELECT 
    c.descripcion_categoria, 
    COUNT(*) AS total_ventas_categoria 
    FROM 
    venta v 
    JOIN detalleventa dv ON v.Id_venta = dv.Id_venta 
    JOIN producto p ON dv.Id_producto = p.Id_producto 
    JOIN categoria c ON p.Id_categoria = c.Id_categoria 
    WHERE 
    DATE(v.fecha_registro) = ?
    AND 
    v.Id_sucursal = ?
    GROUP BY 
    c.descripcion_categoria;`,[fechaSeleccionada, Id_sucursal],
    (error,results) =>{                                                                                                                                                                                                               
        if(error)throw error
        res.json(results)
    }
    )
  }

  const ventaxCategoriaxMES = (req, resp) => {
    const { formattedFirstDayOfMonth, formattedLastDayOfMonth } = req.query;
    connection.query(
      `SELECT 
        c.descripcion_categoria, 
        COUNT(*) AS total_ventas_categoria 
      FROM 
        venta v 
        JOIN detalleventa dv ON v.Id_venta = dv.Id_venta 
        JOIN producto p ON dv.Id_producto = p.Id_producto 
        JOIN categoria c ON p.Id_categoria = c.Id_categoria 
      WHERE 
        v.fecha_registro BETWEEN ? AND ?
      GROUP BY 
        c.descripcion_categoria`,
      [formattedFirstDayOfMonth, formattedLastDayOfMonth],
      (error, results) => {
        if (error) throw error;
        resp.json(results);
      }
    );
  };

  
  const ventatotalxCategoria = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(
        `SELECT 
        c.descripcion_categoria, 
        SUM(dv.CantidadVendida * p.precioVenta) AS monto_total_ventas_categoria 
        FROM 
        venta v 
        JOIN 
        detalleventa dv ON v.Id_venta = dv.Id_venta 
        JOIN 
        producto p ON dv.Id_producto = p.Id_producto 
        JOIN 
        categoria c ON p.Id_categoria = c.Id_categoria 
        WHERE 
        DATE(v.fecha_registro) = ? 
        AND
        v.Id_sucursal = ?
        GROUP BY 
        c.descripcion_categoria;`,
      [fechaSeleccionada,Id_sucursal], 
      (error, results) => {                                                                                                                                                                                                               
        if (error) throw error; 
        res.json(results);
      }
    );
  };

  const ventatotalxPaquetes = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(
        `
SELECT 
      SUM(dv.CantidadVendida * p.precio_paquete) AS monto_total_ventas_paquetes
      FROM 
      venta v 
      JOIN 
      detalleventa dv ON v.Id_venta = dv.Id_venta 
      JOIN 
      paquete p ON dv.Id_paquete = p.Id_paquete 
      WHERE 
      DATE(v.fecha_registro) = ?
      AND
      v.Id_sucursal = ? ;`,
      [fechaSeleccionada,Id_sucursal], 
      (error, results) => {                                                                                                                                                                                                               
        if (error) throw error; 
        res.json(results);
      }
    );
  };

  const ventatotalxPaquetesXUsuarios = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    const Id_usuario = req.query.Id_usuario;
    connection.query(
        ` SELECT 
        SUM(dv.CantidadVendida * p.precio_paquete) AS monto_total_ventas_paquetes
        FROM 
        venta v 
        JOIN 
        detalleventa dv ON v.Id_venta = dv.Id_venta 
        JOIN 
        usuarios u ON v.Id_usuario  = u.Id_usuario 
        JOIN 
        paquete p ON dv.Id_paquete = p.Id_paquete 
        WHERE 
        DATE(v.fecha_registro) = ?
        AND
         v.Id_sucursal = ?  
        AND
        u.Id_usuario = ? ;
  `,
      [fechaSeleccionada,Id_sucursal,Id_usuario], 
      (error, results) => {                                                                                                                                                                                                               
        if (error) throw error; 
        res.json(results);
      }
    );
  };



  const ventatotalxCategoriaxMES = (req, resp) => {
    const { formattedFirstDayOfMonth, formattedLastDayOfMonth } = req.query;
    connection.query(
      `SELECT 
        c.descripcion_categoria, 
        SUM(dv.CantidadVendida * p.precioVenta) AS monto_total_ventas_categoria 
      FROM 
        venta v 
        JOIN 
        detalleventa dv ON v.Id_venta = dv.Id_venta 
        JOIN 
        producto p ON dv.Id_producto = p.Id_producto 
        JOIN 
        categoria c ON p.Id_categoria = c.Id_categoria 
      WHERE 
        v.fecha_registro BETWEEN ? AND ?
      GROUP BY 
        c.descripcion_categoria`,
      [formattedFirstDayOfMonth, formattedLastDayOfMonth],
      (error, results) => {
        if (error) throw error;
        resp.json(results);
      }
    );
  };
  
  
  const verGanancia = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(
      `SELECT 
          SUM((p.precioVenta - p.precioCompra) * dv.CantidadVendida) AS ganancia_total
       FROM 
          venta v
       INNER JOIN 
          detalleventa dv ON v.Id_venta = dv.Id_venta
       INNER JOIN 
          producto p ON dv.Id_producto = p.Id_producto
       WHERE 
          DATE(v.fecha_registro) = ?
      AND  
         v.Id_sucursal = ?  
        
          ;`,
      [fechaSeleccionada, Id_sucursal], 
      (error, results) => {                                                                                                                                                                                                               
        if (error) throw error;
        res.json(results);
      }
    );
  };

  
  const verGananciaPaquetes = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(
      `SELECT 
          SUM(( p.precio_paquete - p.precioCosto ) * dv.CantidadVendida) AS ganancia_total_paquetes
       FROM 
          venta v
       INNER JOIN 
          detalleventa dv ON v.Id_venta = dv.Id_venta
       INNER JOIN 
          paquete p ON dv.Id_paquete = p.Id_paquete
       WHERE 
          DATE(v.fecha_registro) = ?
      AND  
         v.Id_sucursal = ? 
 
        
          ;`,
      [fechaSeleccionada, Id_sucursal], 
      (error, results) => {                                                                                                                                                                                                               
        if (error) throw error;
        res.json(results);
      }
    );
  };

  const verGananciaPaquetesXUsuario = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    const Id_usuario = req.query.Id_usuario
    connection.query(
      `    SELECT 
          SUM(( p.precio_paquete - p.precioCosto ) * dv.CantidadVendida) AS ganancia_total_paquetes
       FROM 
          venta v
       INNER JOIN 
          detalleventa dv ON v.Id_venta = dv.Id_venta
       INNER JOIN 
          paquete p ON dv.Id_paquete = p.Id_paquete
	     INNER JOIN 
          usuarios u ON v.Id_usuario = u.Id_usuario
       WHERE 
          DATE(v.fecha_registro) = ?
      AND  
         v.Id_sucursal = ?
	    AND 
         u.Id_usuario = ?
 
        
          ;`,
      [fechaSeleccionada, Id_sucursal,Id_usuario], 
      (error, results) => {                                                                                                                                                                                                               
        if (error) throw error;
        res.json(results);
      }
    );
  };
  
  const verGananciaXUsuario = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_usuario = req.query.Id_usuario;
    connection.query(
      `SELECT 
          SUM((p.precioVenta - p.precioCompra) * dv.CantidadVendida) AS ganancia_total
       FROM 
          venta v
       INNER JOIN 
          detalleventa dv ON v.Id_venta = dv.Id_venta
       INNER JOIN 
          producto p ON dv.Id_producto = p.Id_producto
       WHERE 
          DATE(v.fecha_registro) = ?
	   AND 
		 v.Id_usuario = ?`,
      [fechaSeleccionada, Id_usuario], 
      (error, results) => {                                                                                                                                                                                                               
        if (error) throw error;
        res.json(results);
      }
    );
  };
  
  
  
  
  const ventaxCliente = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(
      `SELECT 
        c.nombre_cliente, 
        SUM(v.precioTotal_venta) AS monto_total_venta
      FROM 
        venta v 
      JOIN 
        cliente c ON v.Id_cliente = c.Id_cliente 
      WHERE 
        DATE(v.fecha_registro) = ? 
      AND
        v.Id_sucursal = ?
      GROUP BY 
        c.nombre_cliente;`,
        [fechaSeleccionada,Id_sucursal],
      (error, results) => {
        if (error) throw error;
        res.json(results);
      }
    );
  }

  
  const ventatotalxClientexMES = (req, resp) => {
    const { formattedFirstDayOfMonth, formattedLastDayOfMonth } = req.query;
    connection.query(
      `SELECT 
      c.nombre_cliente, 
      SUM(v.precioTotal_venta) AS monto_total_venta 
      FROM 
      venta v 
      JOIN 
      cliente c ON v.Id_cliente = c.Id_cliente 
      WHERE 
      DATE(v.fecha_registro) BETWEEN ? AND ? 
      GROUP BY 
      c.nombre_cliente;`,
      [formattedFirstDayOfMonth, formattedLastDayOfMonth],
      (error, results) => {
        if (error) throw error;
        resp.json(results);
      }
    );
  };

  

  const verEmpleadoConVenta = (req, response) => {
    const fechaSeleccionada = req.params.fechaSeleccionada;
    const Id_sucursal = req.params.Id_sucursal
    connection.query(
      `SELECT
            u.nombre_usuario AS nombre_usuario, u.Id_usuario,
            COUNT(v.Id_venta) AS total_ventas,
            SUM(v.precioTotal_venta) AS precioTotal_venta
            FROM
            usuarios u
            LEFT JOIN
            venta v ON v.Id_usuario = u.Id_usuario
            WHERE
            u.rol_usuario = 'empleado'
            AND (u.Id_sucursal = ? OR v.Id_venta IS NULL)
            AND DATE(v.fecha_registro) =  ?
            GROUP BY
            u.nombre_usuario, u.Id_usuario
            ;`,[Id_sucursal,fechaSeleccionada],
      (error, results) => {                                                                                                                                                                                                               
        if(error) throw error;
        response.json(results);
      }
    );
  };
  
  const importeVentaTotal = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal
    connection.query(
      `SELECT 
      SUM(precioTotal_venta) AS importe_total_venta 
      FROM 
      venta 
      WHERE 
      DATE(fecha_registro) = ?
      AND
      Id_sucursal = ?
      `, 
      [fechaSeleccionada,Id_sucursal], 
      (error, results) => {                                                                                                                                                                                                              
        if (error) throw error;
        res.json(results);
      }
    );
  };
  const importeVentaTotalXUsuario = (req, res) => {
    const fechaSeleccionada = req.params.fechaSeleccionada;
    const Id_usuario = req.params.Id_usuario
    connection.query(
      `SELECT 
        u.nombre_usuario,
        SUM(v.precioTotal_venta) AS importe_total_venta 
        FROM 
        venta v
        INNER JOIN
        usuarios u ON v.Id_usuario = u.Id_usuario
        WHERE 
        DATE(v.fecha_registro) = ?
        AND u.Id_usuario = ?
        ;
      `, 
      [fechaSeleccionada,Id_usuario], 
      (error, results) => {                                                                                                                                                                                                              
        if (error) throw error;
        res.json(results);
      }
    );
  };
  
  const GananciaXdepartamento = (req, res) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(`
        SELECT 
            c.nombre_categoria,
            SUM((p.precioVenta - p.precioCompra) * dv.CantidadVendida) AS ganancia_por_categoria
        FROM 
            venta v
        INNER JOIN 
            detalleventa dv ON v.Id_venta = dv.Id_venta
        INNER JOIN 
            producto p ON dv.Id_producto = p.Id_producto
        INNER JOIN 
            categoria c ON p.id_categoria = c.Id_categoria
        WHERE 
            DATE(v.fecha_registro) = ?
        AND 
          v.Id_sucursal = ?
        GROUP BY 
            c.nombre_categoria;
        `,
        [fechaSeleccionada,Id_sucursal], 
        (error, results) => {
          if (error) throw error;
          res.json(results);
        }
    );
  }

  const verEntradaEfectivo = (req, response) => {
    const fechaSeleccionada = req.query.formattedDate;
    const Id_sucursal = req.query.id_sucursal;
    connection.query(
        'SELECT montoTotalIngreso, DescripcionIngreso  FROM ingreso WHERE DATE(FechaRegistro) = ? AND Id_sucursal = ?;',
        [fechaSeleccionada, Id_sucursal],
        (error, results) => {
            if (error) {
                return response.status(500).json({ error: 'Error al obtener la entrada de efectivo.' });
            }
            response.json(results);
        }
    );
};

  const verEntradaEfectivoConUsuario = (req, response) => {
    const fechaSeleccionada = req.params.fechaSeleccionada;
    const Id_usuario = req.params.Id_usuario
    const Id_caja = req.params.Id_caja
    connection.query(
        'SELECT montoTotalIngreso, DescripcionIngreso  FROM ingreso WHERE DATE(FechaRegistro) = ? and Id_usuario = ? and Id_caja = ?;',
        [fechaSeleccionada, Id_usuario, Id_caja],
        (error, results) => {
            if (error) {
                return response.status(500).json({ error: 'Error al obtener la entrada de efectivo.' });
            }
            response.json(results);
        }
    );
};

const verEgresoEfectivo = (req,response) =>{
  const fechaSeleccionada = req.query.formattedDate;
  const Id_sucursal = req.query.id_sucursal;
  connection.query(
      `SELECT * from egreso
        WHERE DATE(fechaRegistro) = ?  AND Id_sucursal = ?`,
      [fechaSeleccionada, Id_sucursal],
      (error, results) => {
          if (error) {
              return response.status(500).json({ error: 'Error al obtener la salida de efectivo.' });
          }
          response.json(results);
      }
  );
};

const verEgresoEfectivoConUsuario = (req,response) =>{
  const Id_usuario = req.params.Id_usuario
  const fechaSeleccionada = req.params.fechaSeleccionada;
  const Id_caja = req.params.Id_caja
  console.log('Id_usuario', Id_usuario)
  console.log('fechaSeleccionada', fechaSeleccionada)
  console.log('Id_caja', Id_caja)
  connection.query(
    `SELECT * FROM egreso e WHERE DATE(e.FechaRegistro) = ? AND e.Id_usuario = ?  AND e.Id_caja = ?`
    ,
      [fechaSeleccionada,Id_usuario,Id_caja],
      (error, results) => {
          if (error) {
              return response.status(500).json({ error: 'Error al obtener la salida de efectivo.' });
          }
          response.json(results);
      }
  );
};


const verPlataLoginConUsuario = (req, res) => {
  const fechaSeleccionada = req.params.fechaSeleccionada;
  const Id_usuario = req.params.Id_usuario;
  connection.query(
    `SELECT u.nombre_usuario, p.cantidadPlataLogin, p.FechaRegistro
    FROM usuarios u
    JOIN plataencajalogin p ON u.id_usuario = p.id_usuario
    WHERE u.id_usuario = ?
    AND DATE(p.FechaRegistro) = ?
    ORDER BY p.FechaRegistro DESC
    LIMIT 1`,
    [Id_usuario, fechaSeleccionada],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error al obtener plataloginconusuario" });
      }
      res.json(results);
    }
  );
};


const verEmpleadoConVentaXMES = (req, response) => {
  const { formattedFirstDayOfMonth, formattedLastDayOfMonth } = req.query;
  const Id_sucursal = req.params.Id_sucursal
  connection.query(
    `SELECT
          u.nombre_usuario AS nombre_usuario, 
          u.Id_usuario,
          COUNT(v.Id_venta) AS total_ventas,
          SUM(v.precioTotal_venta) AS precioTotal_venta
    FROM
          usuarios u
    LEFT JOIN
          venta v ON v.Id_usuario = u.Id_usuario
    WHERE
          u.rol_usuario = 'empleado'
          AND (u.Id_sucursal = ? OR v.Id_venta IS NULL)
          AND DATE(v.fecha_registro) BETWEEN ? AND ?
    GROUP BY
          u.nombre_usuario, u.Id_usuario;`,[Id_sucursal,formattedFirstDayOfMonth, formattedLastDayOfMonth],
    (error, results) => {                                                                                                                                                                                                               
      if(error) throw error;
      response.json(results);
    }
  );
};



const ventaxCategoriaUsuarios = (req,res) =>{
  const {formattedDate,Id_sucursal,Id_usuario,Id_caja} = req.query
  console.log('FECHA', formattedDate)
  console.log('Id_sucursal', Id_sucursal)
  console.log('Id_usuario', Id_usuario)
  console.log('Id_Caja', Id_caja)
  connection.query(`
SELECT 
      c.descripcion_categoria, 
      SUM(dv.CantidadVendida * p.precioVenta) AS monto_total_ventas_categoria 
      FROM 
      venta v 
      JOIN 
      detalleventa dv ON v.Id_venta = dv.Id_venta 
      JOIN 
      producto p ON dv.Id_producto = p.Id_producto 
      JOIN 
      categoria c ON p.Id_categoria = c.Id_categoria 
	  JOIN 
      caja cj ON cj.Id_caja = v.Id_caja 
      WHERE 
      DATE(v.fecha_registro) = ? 
      AND
      v.Id_sucursal = ?
      AND
      v.Id_usuario = ?
      AND
      cj.Id_caja = ?
      GROUP BY 
      c.descripcion_categoria;`,[formattedDate, Id_sucursal,Id_usuario,Id_caja],
  (error,results) =>{                                                                                                                                                                                                               
      if(error)throw error
      res.json(results)
  }
  )
}


const verPagosCreditos = (req,res)=>{
  const formattedDate = req.params.fechaSeleccionada
  connection.query(`
    select c.nombre_cliente, 
    mt.tipo_metodoPago,
       p.monto, p.fechaRegsitro
  from pagos p
  INNER JOIN  cliente c
  ON p.Id_cliente = c.Id_cliente
  INNER JOIN metopago mt
  ON p.Id_metodoPago = mt.Id_metodoPago
  WHERE date(p.fechaRegsitro) = ? ;`,
  [formattedDate],(error,results)=>{
    if(error) throw error
    res.json(results)
  }
)
}


const verProductosEliminados =(req,res)=>{
  const formattedDate = req.params.fechaSeleccionada
  connection.query(
    `select p.nombre_producto ,
	  pe.precioVentaProducto, pe.Motivo, pe.fechaRegistro,
       pe.Id_venta,
       u.nombre_usuario
from productosEliminados pe
INNER JOIN producto p
ON pe.Id_producto = p.Id_producto
INNER JOIN usuarios u
ON pe.Id_usuario = u.Id_usuario
WHERE date(pe.fechaRegistro) = ? `,[formattedDate],
(error,results)=>{
  if(error) throw error
  res.json(results)
}
)
}

module.exports = {verEmpleadoConVentaXMES, verGananciaXUsuario, verPlataLoginConUsuario,
  importeVentaTotalXUsuario, verEntradaEfectivoConUsuario,ventaTotalconUsuario,ventaTotal,
  verVentaXMes,ventaxCategoria,ventatotalxCategoria,verGanancia,ventaxCliente,verEmpleadoConVenta,
  importeVentaTotal,GananciaXdepartamento,verEntradaEfectivo,verEgresoEfectivo,ventaTotalxMES,
  ventaxCategoriaxMES,ventatotalxCategoriaxMES,ventatotalxClientexMES,verEgresoEfectivoConUsuario,
  ventaxCategoriaUsuarios,ventatotalxPaquetes, verGananciaPaquetes,ventatotalxPaquetesXUsuarios,
  verGananciaPaquetesXUsuario,verPagosCreditos,verProductosEliminados


}