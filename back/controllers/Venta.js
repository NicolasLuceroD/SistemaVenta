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
  const Id_sucursal = Number(req.params.Id_sucursal);

  connection.query(
    `
    SELECT 
      v.Id_venta, 
      DATE_FORMAT(v.fecha_registro, '%Y-%m-%d %H:%i:%s') AS fecha_registro,
      v.Id_sucursal,
      c.Id_cliente, 
      c.nombre_cliente, 
      mt.Id_metodoPago, 
      mt.tipo_metodoPago,
      p.Id_producto, 
      p.Id_categoria,
      p.nombre_producto, 
      CASE 
        WHEN v.Id_sucursal = 1 THEN p.precioVentaSucGuillermina
        WHEN v.Id_sucursal = 2 THEN p.precioVentaSucSanMartin
        ELSE p.precioVentaSucGuillermina
      END AS precioVenta,
      p.PrecioMayoreo,
      p.precioCompra,
      dv.Id_detalleVenta, 
      dv.CantidadVendida, 
      dv.productocomun,
      dv.precioproductocomun,
      u.nombre_usuario,
      pa.nombre_promocion,
      pa.precio_paquete,
      pa.Id_paquete
    FROM detalleventa dv
    LEFT JOIN venta v ON dv.Id_venta = v.Id_venta
    LEFT JOIN producto p ON dv.Id_producto = p.Id_producto
    LEFT JOIN cliente c ON v.Id_cliente = c.Id_cliente
    LEFT JOIN metopago mt ON v.Id_metodoPago = mt.Id_metodoPago
    LEFT JOIN usuarios u ON v.Id_usuario = u.Id_usuario
    LEFT JOIN paquete pa ON dv.Id_paquete = pa.Id_paquete
    WHERE v.Id_sucursal = ?
    ORDER BY v.fecha_registro DESC
    `,
    [Id_sucursal],
    (error, results) => {
      if (error) {
        console.error("Error al obtener las ventas:", error);
        return res.status(500).send("Error interno del servidor al obtener las ventas");
      }

      const ventasAgrupadas = results.reduce((acc, item) => {
        if (!acc[item.Id_venta]) {
          acc[item.Id_venta] = {
            Id_venta: item.Id_venta,
            precioTotal_venta: 0,      // total mostrado
            totalCigarrillos: 0,       // acumulador interno
            fecha_registro: item.fecha_registro,
            cliente: {
              Id_cliente: item.Id_cliente,
              nombre_cliente: item.nombre_cliente,
            },
            metodoPago: {
              Id_metodoPago: item.Id_metodoPago,
              tipo_metodoPago: item.tipo_metodoPago,
            },
            usuarios: {
              nombre_usuario: item.nombre_usuario,
            },
            paquetes: [],
            productos: [],
          };
        }

        const venta = acc[item.Id_venta];

        // =========================
        // 🧾 PRODUCTOS CON CÓDIGO
        // =========================
        if (item.Id_producto) {
          const productoExistente = venta.productos.find(
            p => p.Id_producto === item.Id_producto
          );

          if (!productoExistente) {
            venta.productos.push({
              Id_producto: item.Id_producto,
              nombre_producto: item.nombre_producto,
              precioVenta: item.precioVenta,
              precioCompra: item.precioCompra,
              PrecioMayoreo: item.PrecioMayoreo,
              cantidadVendida: parseFloat(item.CantidadVendida) || 0,
              Id_detalleVenta: item.Id_detalleVenta,
              Id_categoria: item.Id_categoria,
            });
          }

          const subtotal =
            (item.precioVenta || 0) *
            (parseFloat(item.CantidadVendida) || 0);

          if (item.Id_categoria === 10) {
            // 👉 cigarrillos: caja aparte
            venta.totalCigarrillos += subtotal;
          } else {
            // 👉 productos normales
            venta.precioTotal_venta += subtotal;
          }
        }

        // =========================
        // 📦 PRODUCTOS COMUNES
        // =========================
        if (!item.Id_producto && item.productocomun) {
          venta.productos.push({
            Id_producto: `comun-${item.Id_detalleVenta}`,
            nombre_producto: item.productocomun,
            precioVenta: parseFloat(item.precioproductocomun) || 0,
            cantidadVendida: parseFloat(item.CantidadVendida) || 0,
            Id_detalleVenta: item.Id_detalleVenta,
          });

          venta.precioTotal_venta +=
            (parseFloat(item.precioproductocomun) || 0) *
            (parseFloat(item.CantidadVendida) || 0);
        }

        // =========================
        // 🎁 PAQUETES
        // =========================
        if (item.Id_paquete) {
          const paqueteExistente = venta.paquetes.find(
            p => p.Id_paquete === item.Id_paquete
          );

          if (!paqueteExistente) {
            venta.paquetes.push({
              Id_paquete: item.Id_paquete,
              nombre_promocion: item.nombre_promocion,
              precio_paquete: item.precio_paquete,
              cantidadVendida: parseFloat(item.CantidadVendida) || 0,
            });

            venta.precioTotal_venta +=
              (parseFloat(item.precio_paquete) || 0) *
              (parseFloat(item.CantidadVendida) || 0);
          }
        }

        return acc;
      }, {});

      // 🔴 ajuste final: ventas SOLO de cigarrillos
      const resultadoFinal = Object.values(ventasAgrupadas).map(v => {
        if (v.precioTotal_venta === 0 && v.totalCigarrillos > 0) {
          v.precioTotal_venta = v.totalCigarrillos;
        }
        delete v.totalCigarrillos; // no lo mandamos al front
        return v;
      });

      res.json(resultadoFinal);
    }
  );
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
const verVentaSeleccionada = (req, res) => {
  const Id_venta = req.params.Id_venta;

  connection.query(
    `
    SELECT 
      p.nombre_producto, 
      p.Id_producto, 
      CASE 
        WHEN v.Id_sucursal = 1 THEN p.precioVentaSucGuillermina
        WHEN v.Id_sucursal = 2 THEN p.precioVentaSucSanMartin
        ELSE p.precioVentaSucGuillermina
      END AS precioVenta,                                
      pa.nombre_promocion,
      pa.precio_paquete,
      v.Id_venta, 
      v.precioTotal_venta,
      dv.Id_detalleVenta, 
      dv.CantidadVendida
    FROM detalleventa dv
    LEFT JOIN venta v ON dv.Id_venta = v.Id_venta
    LEFT JOIN producto p ON dv.Id_producto = p.Id_producto
    LEFT JOIN paquete pa ON dv.Id_paquete = pa.Id_paquete
    WHERE v.Id_venta = ?;
    `,
    [Id_venta],
    (error, results) => {
      if (error) {
        console.error("Error verVentaSeleccionada:", error);
        return res.status(500).json({ error: "Error al obtener la venta seleccionada" });
      }
      res.json(results);
    }
  );
};


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
  connection.query("INSERT INTO productoseliminados SET ?",{
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



const finalizarVenta = (req, res) => {
  const {
    descripcion_venta,
    precioTotal_venta,
    Id_metodoPago,
    Id_cliente,
    Id_sucursal,
    Id_usuario,
    Id_caja,
    faltaPagar,
    items,
    aplicarCredito,
    montoCredito
  } = req.body;

  if (!Id_sucursal || !Id_usuario || !Id_caja) {
    return res.status(400).json({ ok: false, message: "Faltan datos de sesión." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, message: "No hay items para registrar." });
  }

  connection.beginTransaction((err) => {
    if (err) {
      console.error("beginTransaction error:", err);
      return res.status(500).json({ ok: false, message: "Error iniciando transacción." });
    }

    const ventaData = {
      descripcion_venta: descripcion_venta || "VENTA",
      precioTotal_venta,
      Id_metodoPago,
      Id_cliente,
      Id_sucursal,
      Id_usuario,
      Id_caja,
      faltaPagar: faltaPagar || 0,
      Estado: 1
    };

    connection.query("INSERT INTO venta SET ?", ventaData, (err1, result1) => {
      if (err1) {
        return connection.rollback(() => {
          console.error("INSERT venta error:", err1);
          res.status(500).json({ ok: false, message: "Error creando venta." });
        });
      }

      const Id_venta = result1.insertId;

      // 🔥 INSERT DETALLEVENTA CORRECTO
      const detalleValues = items.map((it) => {

        const cantidad = Number(it.CantidadVendida || 0);
        const precioVenta = Number(it.precioUnitarioVenta || 0);
        const precioCosto = Number(it.precioUnitarioCosto || 0);
        const subtotal = Number(it.subtotal || (cantidad * precioVenta));
        const ganancia = subtotal - (precioCosto * cantidad);

        return [
          "-",                    // descripcion_detalleVenta
          it.tipo_item,           // NUEVO
          precioVenta,            // NUEVO
          precioCosto,            // NUEVO
          subtotal,               // NUEVO
          precioTotal_venta,      // ventasTotales_detalleVenta
          cantidad,
          ganancia,
          Id_venta,
          it.Id_producto || null,
          1,
          1,
          it.Id_paquete || null,
          it.productocomun || null,
          it.precioproductocomun || null
        ];
      });

      const detalleSql = `
        INSERT INTO detalleventa
        (
          descripcion_detalleVenta,
          tipo_item,
          precioUnitarioVenta,
          precioUnitarioCosto,
          subtotal,
          ventasTotales_detalleVenta,
          CantidadVendida,
          ganacia_detalleVenta,
          Id_venta,
          Id_producto,
          IdEstadoCredito,
          IdEstadoVenta,
          Id_paquete,
          productocomun,
          precioproductocomun
        )
        VALUES ?
      `;

      connection.query(detalleSql, [detalleValues], (err2) => {
        if (err2) {
          return connection.rollback(() => {
            console.error("INSERT detalleventa error:", err2);
            res.status(500).json({ ok: false, message: "Error creando detalle." });
          });
        }

        // ============================
        // 🔽 DESCUENTO DE STOCK
        // ============================

        const stockPromises = [];

        // PRODUCTOS
        items
          .filter(it => it.tipo_item === "producto")
          .forEach(it => {
            const cantidad = Number(it.CantidadVendida || 0);
            if (!cantidad) return;

            stockPromises.push(
              new Promise((resolve, reject) => {
                connection.query(
                  "UPDATE stock SET cantidad = cantidad - ? WHERE Id_producto = ? AND Id_sucursal = ?",
                  [cantidad, it.Id_producto, Id_sucursal],
                  (err) => err ? reject(err) : resolve()
                );
              })
            );
          });

        // PAQUETES
        items
          .filter(it => it.tipo_item === "paquete")
          .forEach(it => {

            const cantidadVendida = Number(it.CantidadVendida || 0);
            if (!cantidadVendida) return;

            stockPromises.push(
              new Promise((resolve, reject) => {

                connection.query(
                  "SELECT Id_producto, cantidadProducto FROM detallepaquete WHERE Id_paquete = ?",
                  [it.Id_paquete],
                  (err, productosPaquete) => {

                    if (err) return reject(err);

                    const updatesInternos = productosPaquete.map(prod => {
                      const cantidadADescontar =
                        Number(prod.cantidadProducto) * cantidadVendida;

                      return new Promise((resInt, rejInt) => {
                        connection.query(
                          "UPDATE stock SET cantidad = cantidad - ? WHERE Id_producto = ? AND Id_sucursal = ?",
                          [cantidadADescontar, prod.Id_producto, Id_sucursal],
                          (err2) => err2 ? rejInt(err2) : resInt()
                        );
                      });
                    });

                    Promise.all(updatesInternos)
                      .then(resolve)
                      .catch(reject);
                  }
                );
              })
            );
          });

        Promise.all(stockPromises)
          .then(() => {

            if (aplicarCredito) {
              connection.query(
                "UPDATE cliente SET montoCredito = montoCredito + ? WHERE Id_cliente = ?",
                [Number(montoCredito || precioTotal_venta), Id_cliente],
                (err4) => {
                  if (err4) {
                    return connection.rollback(() => {
                      console.error("UPDATE credito error:", err4);
                      res.status(500).json({ ok: false, message: "Error crédito." });
                    });
                  }

                  connection.commit((errC) => {
                    if (errC) {
                      return connection.rollback(() => {
                        res.status(500).json({ ok: false });
                      });
                    }
                    res.json({ ok: true, Id_venta });
                  });
                }
              );
            } else {
              connection.commit((errC) => {
                if (errC) {
                  return connection.rollback(() => {
                    res.status(500).json({ ok: false });
                  });
                }
                res.json({ ok: true, Id_venta });
              });
            }

          })
          .catch((errStock) => {
            connection.rollback(() => {
              console.error("Stock error:", errStock);
              res.status(500).json({ ok: false, message: "Error descontando stock." });
            });
          });
      });
    });
  });
};



module.exports = {
  finalizarVenta,

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