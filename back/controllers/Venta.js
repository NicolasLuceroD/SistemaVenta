/* eslint-disable no-undef */

const {connection} = require("../database/config")


const verVenta = (req,res) =>{
    connection.query('SELECT * FROM venta',
    (error,results) =>{                                                                                                                                                                                                               
        if(error)throw error
        res.json(results)
    }
    )
}

const crearVenta = (req,res) => {  
    const Id_sucursal = req.body.Id_sucursal
    connection.query('INSERT INTO venta SET ? ',
    {
        Id_venta : req.body.Id_venta,
        descripcion_venta : req.body.descripcion_venta,
        precioTotal_venta: req.body.precioTotal_venta,
        Id_metodoPago: req.body.Id_metodoPago,
        Id_cliente: req.body.Id_cliente,
        Id_sucursal: Id_sucursal,
        Id_usuario: req.body.Id_usuario,
        Id_caja: req.body.Id_caja,
        faltaPagar: req.body.faltaPagar,
        Estado: 1
    },(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}


const correlativa = (req, res) => {
  connection.query("SELECT MAX(Id_venta) + 1 AS ultimoIdVenta FROM venta;", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error en la consulta');
    } else {
      res.json({ ultimoIdVenta: result[0]?.ultimoIdVenta || 1 }); 
    }
  });
};




const verLaVentaCompleta = (req, res) => {
  const Id_sucursal = req.params.Id_sucursal;
  connection.query(`
    SELECT 
      v.Id_venta, 
      v.precioTotal_venta, 
      v.fecha_registro,
      c.Id_cliente, 
      c.nombre_cliente, 
      mt.Id_metodoPago, 
      mt.tipo_metodoPago,
      p.Id_producto, 
      p.nombre_producto, 
      p.precioVenta, 
      p.PrecioMayoreo,
      p.precioCompra,
      dv.Id_detalleVenta, 
      dv.CantidadVendida, 
      u.nombre_usuario,
      pa.nombre_promocion,
      pa.precio_paquete,
      pa.Id_paquete
    FROM 
      detalleventa dv
    LEFT JOIN 
      venta v ON dv.Id_venta = v.Id_venta
    LEFT JOIN 
      producto p ON dv.Id_producto = p.Id_producto
    LEFT JOIN 
      cliente c ON v.Id_cliente = c.Id_cliente
    LEFT JOIN 
      metopago mt ON v.Id_metodoPago = mt.Id_metodoPago
    LEFT JOIN 
      usuarios u ON v.Id_usuario = u.Id_usuario
    LEFT JOIN
      paquete pa ON dv.Id_paquete = pa.Id_paquete
    WHERE 
      v.Id_sucursal = ?
    ORDER BY
      v.fecha_registro DESC;
  `, [Id_sucursal], (error, results) => {
    if (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).send("Error interno del servidor al obtener las ventas");
      return;
    }

    // Agrupar productos y paquetes por Id_venta
    const ventasAgrupadas = results.reduce((acc, item) => {
      // Si no existe la venta en el acumulador, agregarla
      if (!acc[item.Id_venta]) {
        acc[item.Id_venta] = {
          Id_venta: item.Id_venta,
          descripcion_venta: item.descripcion_venta,
          precioTotal_venta: item.precioTotal_venta,
          fecha_registro: item.fecha_registro,
          cliente: {
            Id_cliente: item.Id_cliente,
            nombre_cliente: item.nombre_cliente,
            domicilio_cliente: item.domicilio_cliente,
          },
          metodoPago: {
            Id_metodoPago: item.Id_metodoPago,
            tipo_metodoPago: item.tipo_metodoPago,
          },
          usuarios: {
            nombre_usuario: item.nombre_usuario
          },
          paquetes: [],
          productos: []
        };
      }

      // Agregar producto si no está ya en la lista
      const venta = acc[item.Id_venta];
      const productoExistente = venta.productos.find(p => p.Id_producto === item.Id_producto);
      if (!productoExistente && item.Id_producto) {
        venta.productos.push({
          Id_producto: item.Id_producto,
          nombre_producto: item.nombre_producto,
          descripcion_producto: item.descripcion_producto,
          precioVenta: item.precioVenta, 
          precioCompra: item.precioCompra,
          PrecioMayoreo: item.PrecioMayoreo,
          cantidadVendida: parseFloat(item.CantidadVendida) || 0,
          Id_detalleVenta: item.Id_detalleVenta,
          descripcion_detalleVenta: item.descripcion_detalleVenta,
        });
      }

      // Agregar paquete si no está ya en la lista
      const paqueteExistente = venta.paquetes.find(p => p.Id_paquete === item.Id_paquete);
      if (!paqueteExistente && item.Id_paquete) {
        venta.paquetes.push({
            Id_paquete: item.Id_paquete,
            nombre_promocion: item.nombre_promocion,
            precio_paquete: item.precio_paquete,
            cantidadVendida: parseFloat(item.CantidadVendida) || 0
        });
      }

      return acc;
    }, {});

    // Convertir el objeto agrupado en un array
    const ventas = Object.values(ventasAgrupadas);
    res.json(ventas);
  });
};




  

const eliminarVenta = (req,res) => {
  const Id_venta= req.params.Id_venta
  connection.query ('DELETE FROM venta WHERE Id_venta=' + Id_venta, 
  (error,results)=>{
      if(error) throw error
      res.json(results)
  })
}





const descCantidad = (req, res) => {
  const Id_producto = req.body.Id_producto;
  const Id_sucursal = req.body.Id_sucursal;
  const cantidad = req.body.cantidad;

    console.log('Id_producto',Id_producto)
    console.log('Id_sucursal',Id_sucursal)
    console.log('cantidad',cantidad)

  connection.query('UPDATE stock SET cantidad = cantidad - ? WHERE Id_producto = ? AND Id_sucursal = ?', [cantidad, Id_producto, Id_sucursal], (error, results) => {
    if (error) {
      console.log('Error al actualizar el stock:', error);
    }
    res.json(results);
  });
};

const aumentarCantidad = (req, res) => {
  const Id_producto = req.body.Id_producto;
  const Id_sucursal = req.body.Id_sucursal;
  const cantidad = req.body.cantidad;

  connection.query('UPDATE stock SET cantidad = cantidad + ? WHERE Id_producto = ? AND Id_sucursal = ?', [cantidad,Id_producto, Id_sucursal, ], (error, results) => {
    if (error) {
      console.log('Error al actualizar el stock:', error);
    }
    res.json(results);
  });
};



const estadoVenta = (req,res) =>{
  const Id_venta = req.params.Id_venta
  connection.query(" UPDATE detalleventa SET IdEstadoVenta = 2 WHERE Id_venta = ? ",[Id_venta] , 
(error,results)=>{
  if(error) throw error
  res.json(results)
})

}


const AumentarCredito = (req, res) => {
    const Id_cliente = req.body.Id_cliente;
    const montoCredito = req.body.montoCredito;
    
    connection.query("UPDATE cliente SET montoCredito = montoCredito + ? WHERE Id_cliente = ?", [montoCredito, Id_cliente],
        (error) => {
            if (error) {
                console.error("Error al aumentar el crédito:", error);
                res.status(500).json({ error: "Error al aumentar el crédito del cliente" });
            } else {
                res.json('Crédito aumentado correctamente');
            }
        }
    );
};


const verificadorPrecio = (req,res) =>{
  const codProducto = req.params.codProducto
  const nombre_producto = req.params.nombre_producto
  connection.query("SELECT * FROM producto WHERE codProducto = ? or nombre_producto = ?",[codProducto,nombre_producto],
  (error,results) => {
    if (error) {
        console.error("Error al buscar el producto:", error);
        res.status(500).json({ error: "Error Error al buscar el producto" });
    } else {
        res.json(results);
    }
}
  )
}



const ventasEliminadas = (req, res) => {
  connection.query('INSERT INTO ventaseliminadas SET ? ',
    {
      NumeroVenta : req.body.NumeroVenta,
      MontoTotal: req.body.MontoTotal,
      FechaVenta: req.body.FechaVenta,
      Id_producto: req.body.Id_producto,
      cantidad: req.body.cantidad,
      Producto: req.body.Producto,
      Empleado: req.body.Empleado
    },
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};





const verVentasEliminadas = (req,res) => {
  const fechaSeleccionada = req.query.formattedDate;
  connection.query('SELECT * FROM VentasEliminadas WHERE FechaVenta = ? ', [fechaSeleccionada], (error, results) => {
    if (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).send("Error interno del servidor al obtener las ventas");
      return;
    }

    // Agrupar productos y paquetes por NumeroVenta
    const ventasAgrupadas = results.reduce((acc, item) => {
      // Si no existe la venta en el acumulador, agregarla
      if (!acc[item.NumeroVenta]) {
        acc[item.NumeroVenta] = {
          IdVentaEliminada: item.IdVentaEliminada,
          MontoTotal: item.MontoTotal,
          NumeroVenta: item.NumeroVenta,
          FechaVenta: item.FechaVenta,
          productos: [], // Crear un array para los productos
          Empleado: item.Empleado
        };
      }

      // Agregar el producto al array de productos
      acc[item.NumeroVenta].productos.push({
        Producto: item.Producto,
        cantidad: item.cantidad
      });

      return acc;
    }, {});

    const ventas = Object.values(ventasAgrupadas);
    res.json(ventas);
  });
};

const EliminarProductoVenta = (req,res) =>{
  const Id_detalleVenta = req.params.Id_detalleventa
  connection.query('DELETE FROM detalleventa WHERE Id_detalleVenta = ?',[Id_detalleVenta],
    (error,results)=>{
      if(error)throw error
      res.json(results)
    }
  )
}

const verVentaSeleccionada = (req,res) =>{
 const Id_venta = req.params.Id_venta

 connection.query(`select p.nombre_producto, p.Id_producto, p.precioVenta,
	   pa.nombre_promocion,pa.precio_paquete,
	   v.Id_venta, v.precioTotal_venta,
       dv.Id_detalleVenta, dv.CantidadVendida
FROM detalleventa dv
LEFT JOIN producto p
ON dv.Id_producto = p.Id_producto
LEFT JOIN venta v
ON dv.Id_venta = v.Id_venta
LEFT JOIN paquete pa
ON dv.Id_paquete = pa.Id_paquete
WHERE v.Id_venta = ?;
`,[Id_venta],(error,results)=>{
  if(error) throw error
  res.json(results)
 })
}


const actualizarPrecioVenta = (req,res) =>{
  const {precioVenta,Id_venta} = req.body
  connection.query("UPDATE venta SET precioTotal_venta = precioTotal_venta - ? WHERE Id_venta = ?", 
    [precioVenta, Id_venta], (error,results)=>{
      if(error) throw error
      res.json(results)
    }
  )
}


const guardarProductoEliminado =(req,res)=>{
  connection.query("INSERT INTO productosEliminados SET ?",{
    Id_venta: req.body.Id_venta,
    Id_producto: req.body.Id_producto,
    Id_usuario: req.body.Id_usuario,
    precioVentaProducto: req.body.precioVentaProducto,
    Motivo: req.body.Motivo
  },(error,results)=>{
    if(error)throw error
    res.json(results)
  })
}


module.exports = {
  guardarProductoEliminado,
  actualizarPrecioVenta,
  verVentaSeleccionada,
  EliminarProductoVenta,
  verVentasEliminadas, ventasEliminadas, 
  verificadorPrecio,estadoVenta, 
  verVenta,crearVenta,eliminarVenta,correlativa, 
  verLaVentaCompleta,
  descCantidad,AumentarCredito, 
  aumentarCantidad}