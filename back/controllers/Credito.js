const {connection} = require('../database/config')




const verElCreditoCompleto = (req, res) => {
    const Id_cliente = req.params.Id_cliente
    connection.query(`
    SELECT v.Id_venta, v.precioTotal_venta, v.fecha_registro, v.faltaPagar, 
    c.Id_cliente, c.nombre_cliente, c.montoCredito, mp.tipo_metodoPago, c.telefono_cliente,c.domicilio_cliente,
    p.Id_producto, p.nombre_producto,  p.precioVenta, dv.CantidadVendida, dv.Id_detalleVenta,
    u.nombre_usuario,
    e.tipoEstado
    FROM venta v
    JOIN cliente c ON v.Id_cliente = c.Id_cliente
    JOIN detalleventa dv ON v.Id_venta = dv.Id_venta
    JOIN producto p ON dv.Id_producto = p.Id_producto
    JOIN metopago mp ON v.Id_metodoPago = mp.Id_metodoPago
    JOIN usuarios u ON v.Id_usuario = u.Id_usuario
    JOIN estadocredito e ON dv.IdEstadoCredito = e.IdEstadoCredito
    WHERE mp.tipo_metodoPago = 'a credito'
    AND c.Id_cliente = ?
    AND v.Estado = 1;
         
    `, [Id_cliente], (error, results) => {
      if (error) {
        console.error("Error al obtener las ventas del cliente:", error);
        res.status(500).send("Error interno del servidor al obtener las ventas");
        return;
      }
      
      // Agrupar productos por Id_venta
      const ventasAgrupadas = results.reduce((acc, item) => {
        // Si no existe la venta en el acumulador, agregarla
        if (!acc[item.Id_venta]) {
          acc[item.Id_venta] = {
            Id_venta: item.Id_venta,    
            precioTotal_venta: item.precioTotal_venta,
            fecha_registro: item.fecha_registro,
            tipoEstado: item.tipoEstado,
            faltaPagar: item.faltaPagar,
            cliente: {
              Id_cliente: item.Id_cliente,
              nombre_cliente: item.nombre_cliente,
              montoCredito: item.montoCredito,
              domicilio_cliente: item.domicilio_cliente,
              telefono_cliente: item.telefono_cliente,
            },
            metodoPago: {
              tipo_metodoPago: item.tipo_metodoPago,
            },
            usuarios:{
              nombre_usuario: item.nombre_usuario
            },
            productos: []
          };
        }
        
        // Verificar si el producto ya se agregó a la venta
        const productoExistente = acc[item.Id_venta].productos.find(producto => producto.Id_producto === item.Id_producto);
        if (productoExistente) {
          // Si el producto ya está en la venta, actualizar su cantidad
          productoExistente.CantidadVendida += item.CantidadVendida;
        } else {
          // Si el producto no está en la venta, agregarlo
          acc[item.Id_venta].productos.push({
            Id_producto: item.Id_producto,
            nombre_producto: item.nombre_producto,
            descripcion_producto: item.descripcion_producto,
            precioVenta: item.precioVenta, // Asegúrate de usar el nombre correcto de la columna aquí
            CantidadVendida: item.CantidadVendida, 
            Id_detalleVenta: item.Id_detalleVenta,
            descripcion_detalleVenta: item.descripcion_detalleVenta,
          });
        }
        return acc;
      }, {});
  
      // Convertir el objeto agrupado en un array
      const ventas = Object.values(ventasAgrupadas);
      res.json(ventas);
    });
  };





const estadoCreditoVenta = (req,res) =>{
  const Id_venta = req.params.Id_venta
  connection.query("UPDATE detalleventa SET IdEstadoCredito = 2 WHERE Id_venta = ?" , 
[Id_venta],(error,results)=>{
  if(error) throw error
  res.json(results)
})

}


const RestarCredito = (req, res) => {
  const Id_cliente = req.body.Id_cliente;
  const montoCredito = req.body.montoCredito;
  
  connection.query("UPDATE cliente SET montoCredito = montoCredito - ? WHERE Id_cliente = ?", [montoCredito, Id_cliente],
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


const restarTotalApagar = (req, res) => {
  const { Id_venta, faltaPagar } = req.body;

  connection.query(
      "UPDATE venta SET faltaPagar = GREATEST(faltaPagar - ?, 0) WHERE Id_venta = ?",
      [faltaPagar, Id_venta],
      (error, results) => {
          if (error) {
              console.error("Error al actualizar faltaPagar:", error);
              return res.status(500).json({ error: "Error en la actualización del pago" });
          }

          connection.query(
              "SELECT faltaPagar FROM venta WHERE Id_venta = ?",
              [Id_venta],
              (error, result) => {
                  if (error) {
                      console.error("Error al consultar faltaPagar:", error);
                      return res.status(500).json({ error: "Error al consultar faltaPagar" });
                  }

                  if (result.length === 0) {
                      console.error("No se encontró la venta con el ID proporcionado.");
                      return res.status(404).json({ error: "Venta no encontrada" });
                  }

                  const faltaPagarActual = Number(result[0].faltaPagar); 
                  console.log('faltaPagarActual:', faltaPagarActual);

                  if (faltaPagarActual === 0) {
                      connection.query(
                          "UPDATE venta SET Estado = 0 WHERE Id_venta = ?",
                          [Id_venta],
                          (error, updateResult) => {
                              if (error) {
                                  console.error("Error al actualizar Estado de la venta:", error);
                                  return res.status(500).json({ error: "Error al actualizar Estado" });
                              }

                              console.log(`Estado de la venta ${Id_venta} actualizado a 0`);
                              return res.json({ message: "Pago actualizado y venta cerrada correctamente" });
                          }
                      );
                  } else {
                      console.log(`El pago se actualizó, pero falta pagar: ${faltaPagarActual}`);
                      return res.json({ message: "Pago actualizado, pero la venta sigue pendiente" });
                  }
              }
          );
      }
  );
};




const CreditoACuenta = (req, res) => {
  const Id_cliente = req.body.Id_cliente;
  const montoCredito = req.body.montoCredito;
  
  connection.query("UPDATE cliente SET montoCredito = montoCredito - ? WHERE Id_cliente = ?", [montoCredito, Id_cliente],
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



const pagosClientes = (req,res) =>{
  connection.query("INSERT INTO pagos SET ?",{
    Id_cliente: req.body.Id_cliente,
    Id_venta: req.body.Id_venta,
    Id_metodoPago: req.body.Id_metodoPago,
    monto: req.body.monto,
    montoCreditoActual: req.body.montoCreditoActual
  },(error,results)=>{
    if(error) throw error
    res.json(results)
  })
}

const movimientoClientes = (req,res) =>{
  connection.query("INSERT INTO movimientosClientes SET ?",{
    Id_cliente: req.body.Id_cliente,
    montoCredito: req.body.montoCredito,
    montoDebito: req.body.montoDebito,
    Saldo: req.body.Saldo,
    Id_venta: req.body.Id_venta
  },(error,results)=>{
    if(error) throw error
    res.json(results)
  })
}

const pagocorrelativaCliente = (req,res)=>{            
  connection.query("SELECT MAX(IdPago) + 1 AS ultimoPago FROM pagos;", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error en la consulta');
    } else {
      res.json({ ultimoPago: result[0]?.ultimoPago || 1 }); 
    }
  });
}




const verMovimientosCliente = (req,res) =>{
  const Id_cliente = req.params.Id_cliente
  connection.query(`
    SELECT 
    mc.IdMovimientoCliente AS NroMovimiento,
    mc.fechaRegsitro AS FechaMovimiento,
    mc.montoCredito AS Credito,
    mc.montoDebito AS Debito,
    mc.Saldo AS Saldo,
    c.nombre_cliente,
    c.Id_cliente,
    c.domicilio_cliente, 
    c.telefono_cliente
FROM movimientosClientes mc
INNER JOIN cliente c ON mc.Id_cliente = c.Id_cliente
WHERE c.Id_cliente = ?
GROUP BY mc.IdMovimientoCliente, mc.fechaRegsitro
ORDER BY mc.fechaRegsitro DESC, mc.IdMovimientoCliente ASC;
`,[Id_cliente],(error,results)=>{
  if(error) throw error
  res.json(results)
})
}



const pagosProveedores = (req,res) =>{
  connection.query("INSERT INTO pagosproveedores SET ?",{
    Id_proveedor: req.body.Id_proveedor,
    Id_compra: req.body.Id_compra,
    Id_metodoPago: req.body.Id_metodoPago,
    monto: req.body.monto,
    montoCreditoActual: req.body.montoCreditoActual,
    Id_usuario: req.body.Id_usuario,
    observaciones: req.body.observaciones
  },(error,results)=>{
    if(error) throw error
    res.json(results)
  })
}


const movimientoProveedores = (req,res) =>{
  connection.query("INSERT INTO movimientosproveedores SET ?",{
    Id_proveedor: req.body.Id_proveedor,
    montoCredito: req.body.montoCredito,
    montoDebito: req.body.montoDebito,
    Saldo: req.body.Saldo,
    Estado: req.body.Estado
  },(error,results)=>{
    if(error) throw error
    res.json(results)
  })
}


const pagocorrelativaProveedor = (req,res)=>{            
  connection.query("SELECT MAX(IdPagoProveedor) + 1 AS ultimoPago FROM pagosproveedores;", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error en la consulta');
    } else {
      res.json({ ultimoPago: result[0]?.ultimoPago || 1 }); 
    }
  });
}


const aumentarDeudaProveedor = (req,res) =>{
  const {montoCredito,Id_proveedor} = req.body
  connection.query("UPDATE proveedores SET montoCredito = montoCredito + ? WHERE Id_proveedor = ?  ",
    [montoCredito, Id_proveedor],(error,results)=>{
      if(error)throw error
      res.json(results)
    }
  )
}


const verMovimientosProveedor = (req,res) =>{
  const Id_proveedor = req.params.Id_proveedor
  connection.query(`
    SELECT 
    mc.IdMovimientoProveedor AS NroMovimiento,
    mc.fechaRegsitro AS FechaMovimiento,
    mc.montoCredito AS Credito,
    mc.montoDebito AS Debito,
    mc.Saldo AS Saldo,
    p.nombre_proveedor,
    p.Id_proveedor,
    p.descripcion_proveedor, 
    p.numTel_proveedor
FROM movimientosproveedores mc
INNER JOIN proveedores p ON mc.Id_proveedor = p.Id_proveedor
WHERE p.Id_proveedor = ?
ORDER BY mc.fechaRegsitro DESC, mc.IdMovimientoProveedor ASC;
`,[Id_proveedor],(error,results)=>{
  if(error) throw error
  res.json(results)
})
}

const cancelarMovimiento = (req,res) => {
  const {Id_proveedor, montoCredito} = req.body
  connection.query(`UPDATE movimientosproveedores 
    SET Estado = 1 
    WHERE Id_proveedor = ? AND montoCredito = ?
    ORDER BY fechaRegsitro DESC 
    LIMIT 1`, [Id_proveedor,montoCredito], (error,results) => {
      if (error) throw error
      res.json(results)
    })
}



const verElCreditoCompletoProveedor = (req, res) => {
  const Id_proveedor = req.params.Id_proveedor
  connection.query(`
   SELECT v.Id_compra, v.totalCompra, v.FechaRegistro, v.faltaPagar, v.descripcion_compra,
  c.Id_proveedor, c.nombre_proveedor, c.numTel_proveedor, c.montoCredito, mp.tipo_metodoPago,
  u.nombre_usuario
  FROM compra v
  JOIN proveedores c ON v.Id_proveedor = c.Id_proveedor
  JOIN metopago mp ON v.Id_metodoPago = mp.Id_metodoPago
  JOIN usuarios u ON v.Id_usuario = u.Id_usuario
  WHERE mp.tipo_metodoPago = 'a credito'
  AND c.Id_proveedor = ?
  AND v.estado_compra = 'pendiente';

  `, [Id_proveedor], (error, results) => {
    if (error) {
      console.error("Error al obtener las compras de los proveedores:", error);
      res.status(500).send("Error interno del servidor al obtener las compras");
      return;
    }
    // Agrupar productos por Id_compra
    const ventasAgrupadas = results.reduce((acc, item) => {
      // Si no existe la venta en el acumulador, agregarla
      if (!acc[item.Id_compra]) {
        acc[item.Id_compra] = {
          Id_compra: item.Id_compra,    
          totalCompra: item.totalCompra,
          FechaRegistro: item.FechaRegistro,
          faltaPagar: item.faltaPagar,
          descripcion_compra: item.descripcion_compra,
          proveedores: {
            Id_proveedor: item.Id_proveedor,
            nombre_proveedor: item.nombre_proveedor,
            montoCredito: item.montoCredito,
            numTel_proveedor: item.numTel_proveedor,
          },
          metodoPago: {
            tipo_metodoPago: item.tipo_metodoPago,
          },
          usuarios:{
            nombre_usuario: item.nombre_usuario
          }
        };
      }
      return acc;
    }, {});

    // Convertir el objeto agrupado en un array
    const ventas = Object.values(ventasAgrupadas);
    res.json(ventas);
  });
};




const restarTotalApagarProveedores = (req, res) => {
  const { Id_compra, faltaPagar } = req.body;

  connection.query(
      "UPDATE compra SET faltaPagar = GREATEST(faltaPagar - ?, 0) WHERE Id_compra = ?",
      [faltaPagar, Id_compra],
      (error, results) => {
          if (error) {
              console.error("Error al actualizar faltaPagar:", error);
              return res.status(500).json({ error: "Error en la actualización del pago" });
          }
          connection.query(
              "SELECT faltaPagar FROM compra WHERE Id_compra = ?",
              [Id_compra],
              (error, result) => {
                  if (error) {
                      console.error("Error al consultar faltaPagar:", error);
                      return res.status(500).json({ error: "Error al consultar faltaPagar" });
                  }
                  if (result.length === 0) {
                      console.error("No se encontró la venta con el ID proporcionado.");
                      return res.status(404).json({ error: "Venta no encontrada" });
                  }
                  const faltaPagarActual = Number(result[0].faltaPagar); 
                  console.log('faltaPagarActual:', faltaPagarActual);

                  if (faltaPagarActual === 0) {
                      connection.query(
                          "UPDATE compra SET estado_compra = 'pagada' WHERE Id_compra = ?",
                          [Id_compra],
                          (error, updateResult) => {
                              if (error) {
                                  console.error("Error al actualizar Estado de la compra:", error);
                                  return res.status(500).json({ error: "Error al actualizar Estado" });
                              }

                              console.log(`Estado de la compra ${Id_compra} actualizado a pagada`);
                              return res.json({ message: "Pago actualizado y compra cerrada correctamente" });
                          }
                      );
                  } else {
                      console.log(`El pago se actualizó, pero falta pagar: ${faltaPagarActual}`);
                      return res.json({ message: "Pago actualizado, pero la compra sigue pendiente" });
                  }
              }
          );
      }
  );
};

const restarDeudaProveedor = (req,res) =>{
  const {montoCredito,Id_proveedor} = req.body
  connection.query("UPDATE proveedores SET montoCredito = montoCredito - ? WHERE Id_proveedor = ?  ",
    [montoCredito, Id_proveedor],(error,results)=>{
      if(error)throw error
      res.json(results)
    }
  )
}

const verDetalleVentaEnCredito = (req,res) => {
  const idMovimiento = req.params.idMovimiento;
  connection.query(`SELECT 
                      p.nombre_producto,
                      dv.CantidadVendida,
                      v.precioTotal_venta
                    FROM movimientosClientes mc
                    INNER JOIN venta v ON mc.Id_venta = v.Id_venta
                    INNER JOIN detalleVenta dv ON v.Id_venta = dv.Id_venta
                    INNER JOIN producto p ON dv.Id_producto = p.Id_producto
                    WHERE mc.IdMovimientoCliente = ?`, [idMovimiento], (error,results) => {
                      if (error) throw error
                      res.json(results)
                    })
}

module.exports = {
  verMovimientosCliente,
  RestarCredito,
  pagosClientes,
  movimientoClientes,
  pagocorrelativaCliente,
  verElCreditoCompleto,
  restarTotalApagar,
  verDetalleVentaEnCredito,
  CreditoACuenta,
  estadoCreditoVenta,


  verElCreditoCompletoProveedor,
  aumentarDeudaProveedor,
  pagosProveedores,
  movimientoProveedores,
  pagocorrelativaProveedor,
  verMovimientosProveedor,
  restarTotalApagarProveedores,
  restarDeudaProveedor,
  cancelarMovimiento
}