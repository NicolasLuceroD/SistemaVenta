const {connection} = require("../database/config")

const verDetalleVenta = (req,res) =>{
    connection.query(`SELECT 
                    dv.Id_detalleVenta, dv.descripcion_detalleVenta, dv.ventasTotales_detalleVenta, dv.ganacia_detalleVenta,
                    p.nombre_producto, p.descripcion_producto, p.precioVena, p.cantidad_producto,
                    v.Id_venta
                    FROM detalleventa dv
                    INNER JOIN venta v ON dv.Id_venta = v.Id_venta
                    INNER JOIN producto p ON dv.Id_producto = p.Id_producto;`,
    (error,results)=>{
        if(error) throw error
        res.json(results)
    })
}


const crearDetalleVenta = (req, res) => {  

  const detalleVentaData = {
    descripcion_detalleVenta: req.body.descripcion_detalleVenta,
    ventasTotales_detalleVenta: req.body.ventasTotales_detalleVenta,
    CantidadVendida: req.body.CantidadVendida,
    ganacia_detalleVenta: req.body.ganacia_detalleVenta,
    Id_venta: req.body.Id_venta,
    Id_producto: req.body.Id_producto,    
    IdEstadoCredito: req.body.IdEstadoCredito,  
    IdEstadoVenta: req.body.IdEstadoVenta,
    Id_paquete: req.body.Id_paquete,
    productocomun: req.body.productocomun,
    precioproductocomun: req.body.precioproductocomun
};
  detalleVentaData.Id_venta === req.body.Id_venta === null ? 1 : req.body.Id_venta;
  
  connection.query("INSERT INTO detalleventa SET ?", detalleVentaData, (error, results) => {
      if (error) {
          console.log('Error al crear detalle de venta:', error);
          return res.status(500).json({ success: false, error: 'Error al crear detalle de venta' });
      }
      console.log('Detalle de venta creado correctamente');
      res.status(200).json({ success: true, message: 'Detalle de venta creado correctamente', data: results });
  });
};








const eliminarDetalleVenta = (req, res) => { 
  const Id_venta = req.params.Id_venta;
  connection.query('DELETE FROM detalleventa WHERE Id_venta = ?', [Id_venta], (error, results) => {
      if (error) throw error;
      res.json(results);
  });
};


const ultimoDetalle = (req, res) => {
  const fechaSeleccionada = req.params.fechaSeleccionada;
  const Id_sucursal = req.params.Id_sucursal;
  connection.query(
    ` 
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
      pa.Id_paquete,
      dv.productocomun,
      dv.precioproductocomun
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
    AND Date(v.fecha_registro) = ?
    order by
    v.fecha_registro DESC ;`,
    [Id_sucursal, fechaSeleccionada, Id_sucursal],
    (error, results) => {
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
  
          // ✅ Productos comunes
        if (!item.Id_producto && item.productocomun) {
        venta.productos.push({
          Id_producto: `comun-${item.Id_detalleVenta}`,
          nombre_producto: item.productocomun,
          descripcion_producto: 'Producto común',
          precioVenta: parseFloat(item.precioproductocomun) || 0,
          precioCompra: 0,
          PrecioMayoreo: 0,
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

  


module.exports = {verDetalleVenta,crearDetalleVenta,eliminarDetalleVenta,ultimoDetalle}