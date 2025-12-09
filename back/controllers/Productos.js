/* eslint-disable no-undef */
const {connection} = require ('../database/config')

 



const verProductos =(req,res)=>{
  connection.query(`SELECT p.Id_producto ,p.nombre_producto, p.descripcion_producto, p.precioCompra, p.precioVenta, p.tipo_venta,  p.FechaRegistro, p.codProducto, p.PrecioMayoreo ,c.Id_categoria, c.nombre_categoria, c.descripcion_categoria 
                    FROM producto p  INNER JOIN categoria c  ON p.Id_categoria = c.Id_categoria 
                    WHERE p.Estado = 1;  
                    `,
  (error,results)=>{
      if(error)throw error
      res.json(results)
  })
}


const crearProducs = (req,res) =>{
  const inv = req.body.inventarioMinimo
  console.log('inv', inv)
  connection.query("INSERT INTO producto SET ?", {
    nombre_producto: req.body.nombre_producto,
    descripcion_producto: req.body.descripcion_producto,
    precioCompra: req.body.precioCompra,
    precioVenta: req.body.precioVenta,
    Id_categoria: req.body.Id_categoria, 
    Id_sucursal: req.body.Id_sucursal, 
    tipo_venta: req.body.tipo_venta, 
    codProducto: req.body.codProducto,
    Estado : 1,
    PrecioMayoreo:req.body.PrecioMayoreo,
    inventarioMinimo: req.body.inventarioMinimo

  }, (error,results)=>{
    if(error)throw error
    res.json(results)
  })
}


const crearProductos = (req, res) => {
  const {
    nombre_producto,
    descripcion_producto,
    precioCompra,
    precioVenta,
    Id_categoria,
    Id_sucursal,
    tipo_venta,
    FechaVencimiento,
    codProducto,
    Estado = 1,  
    PrecioMayoreo = 0   
  } = req.body;

  if (
    !nombre_producto ||
    !descripcion_producto ||
    isNaN(precioCompra) ||
    isNaN(precioVenta) ||
    isNaN(Id_categoria) ||
    isNaN(Id_sucursal) ||
    !tipo_venta ||
    !FechaVencimiento ||
    !codProducto
  ) {
    return res.status(400).json({ error: "Datos incompletos o inválidos" });
  }

  const productData = {
    nombre_producto,
    descripcion_producto,
    precioCompra,
    precioVenta,
    Id_categoria,
    Id_sucursal,
    tipo_venta,
    FechaVencimiento,
    codProducto,
    Estado,
    PrecioMayoreo
  };

  console.log("Datos a insertar en la BD:", productData);

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar la transacción:", err);
      return res.status(500).json({ error: "Error al iniciar la transacción" });
    }

    // Verificar si el producto ya existe
    connection.query('SELECT * FROM producto WHERE codProducto = ?', [codProducto], (err, results) => {
      if (err) {
        console.error("Error al verificar la existencia del producto:", err);
        return connection.rollback(() => {
          res.status(500).json({ error: "Error al verificar la existencia del producto" });
        });
      }

      if (results.length > 0) {
        console.log("El producto ya existe:", results);
        return connection.rollback(() => {
          res.status(400).json({ error: "El producto ya existe" });
        });
      }

      connection.query('INSERT INTO producto SET ?', productData, (error, results) => {
        if (error) {
          console.error("Error al insertar en la base de datos:", error);
          return connection.rollback(() => {
            res.status(500).json({ error: "Error al agregar el producto" });
          });
        }

        connection.commit((err) => {
          if (err) {
            console.error("Error al confirmar la transacción:", err);
            return connection.rollback(() => {
              res.status(500).json({ error: "Error al confirmar la transacción" });
            });
          }

          console.log("Producto agregado correctamente:", results);
          res.json("Producto Agregado");
        });
      });
    });
  });
};











const editarProductos = (req,res)=>{
    const Id_producto= req.params.Id_producto
    const{nombre_producto,tipo_venta,descripcion_producto,precioCompra,Id_categoria,precioVenta,codProducto,PrecioMayoreo} = req.body
    connection.query( `UPDATE producto SET

                            nombre_producto='${nombre_producto}',
                            precioCompra='${precioCompra}',
                            precioVenta= '${precioVenta}',
                            descripcion_producto='${descripcion_producto}',
                            Id_categoria = '${Id_categoria}',
                            tipo_venta = '${tipo_venta}',
                            codProducto = '${codProducto}',
                            PrecioMayoreo  = '${PrecioMayoreo}'

                            WHERE Id_producto = ${Id_producto}`,
                    
                            (error)=>{
                                if(error) throw error
                                res.json("Producto Editado")
                            }
                            )
}


const eliminarProductos = (req,res) =>{
    const Id_producto= req.params.Id_producto
    connection.query('UPDATE producto set Estado = 0 WHERE Id_producto= ' + Id_producto,
    (error,results)=>{
        if(error) throw error
        res.json(results)
    }
    )
}


const ProductoList = (req, res) => {
    const nombre_producto = req.params.nombre_producto;
  
    if (!nombre_producto) {
      res.status(400).send("Falta el nombre del producto");
      return;
    }
  
    connection.query(
      "SELECT Id_producto, nombre_producto, descripcion_producto, precio_producto, cantidad_producto FROM producto WHERE nombre_producto = ?",
      [nombre_producto],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al buscar el producto.");
        } else {
          const productoEncontrado = result.length > 0;
  
          if (productoEncontrado) {
            res.send(result[0]);
          } else {
            res.status(404).send("Producto no encontrado.");
          }
        }
      }
    );
  };
  

const verPlataEnStock = (req,res) =>{
  connection.query(`SELECT
  (SELECT SUM(precioCompra) FROM producto) AS stock_plata,
  (SELECT SUM(cantidad) FROM stock) AS cantidad_productos,
  (SELECT SUM(precioCompra) FROM producto) * (SELECT SUM(cantidad) FROM stock) AS total_valor`
,(error,results)=>{
  if(error) throw error
  res.json(results)
})
}

const productoPorCategoria = (req,res) =>{
  const Id_categoria = req.params.Id_categoria
  connection.query("SELECT p.Id_producto, p.nombre_producto, p.descripcion_producto, p.precioCompra, p.precioVenta, p.tipo_venta,  p.FechaRegistro, c.nombre_categoria, c.descripcion_categoria FROM producto p  INNER JOIN categoria c  ON p.Id_categoria = c.Id_categoria WHERE c.Id_categoria = ?",[Id_categoria],(error,results)=>{
    if(error) throw error
    res.json(results)
  })
}



const modificarPrecioProducto = (req,res) =>{
  const precioVenta = req.body.precioVenta
  const Id_categoria = req.params.Id_categoria
  connection.query( "UPDATE producto SET precioVenta= (precioVenta + precioVenta * ? /100) WHERE Id_categoria = ?",[precioVenta,Id_categoria],(error,results)=>{
    if(error) throw error
    res.json(results)
  }                          
)                                                                                   
}





const catalogo = (req,res) =>{
  connection.query("SELECT p.nombre_producto, p.precioVenta, p.PrecioMayoreo,c.nombre_categoria FROM producto p  INNER JOIN categoria c  ON p.Id_categoria = c.Id_categoria;",(error,results)=>{
    if(error)throw error
    res.json(results)
  })
}


const productoVencimiento =(req,res) =>{
  connection.query(` SELECT * from producto WHERE FechaVencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 20 DAY)`, (error,results)=>{
    if(error)throw error
    res.json(results)
  })
}

const verProductosYPromos = (req, res) => {
  connection.query(`
SELECT 
    p.nombre_producto, 
    p.descripcion_producto, 
    p.precioVenta, 
    p.tipo_venta,
    NULL AS nombre_promocion, 
    NULL AS precio_paquete,
    NULL AS Id_detallePaquete
FROM 
    producto p

UNION ALL

SELECT 
    p.nombre_producto, 
    p.descripcion_producto, 
    p.precioVenta, 
    p.tipo_venta,
    q.nombre_promocion, 
    q.precio_paquete,
    d.Id_detallePaquete
FROM 
    paquete q
INNER JOIN 
    detallePaquete d ON q.Id_paquete = d.Id_paquete
INNER JOIN 
    producto p ON d.Id_producto = p.Id_producto;

  `, (error, results) => {
    if (error) {
      console.error("Error al obtener los productos y promociones:", error);
      res.status(500).send("Error interno del servidor al obtener los productos y promociones");
      return;
    }
    
    // Agrupar productos y promociones por tipo_item
    const itemsAgrupados = results.reduce((acc, item) => {
      // Si no existe el tipo_item en el acumulador, agregarlo
      if (!acc[item.tipo_item]) {
        acc[item.tipo_item] = [];
      }
      // Agregar el producto o promoción al tipo correspondiente
      acc[item.tipo_item].push({
        nombre_producto: item.nombre_producto,
        descripcion_producto: item.descripcion_producto,
        precioVenta: item.precioVenta,
        tipo_venta: item.tipo_venta,
        nombre_promocion: item.nombre_promocion,
        precio_paquete: item.precio_paquete,
        Id_detallePaquete: item.Id_detallePaquete
      });
      return acc;
    }, {});

    // Convertir el objeto agrupado en un array
    const productosYPromos = Object.entries(itemsAgrupados).map(([tipo_item, items]) => {
      return { tipo_item, items };
    });

    res.json(productosYPromos);
  });
};


module.exports= {crearProducs, verProductosYPromos,productoVencimiento,modificarPrecioProducto,productoPorCategoria,verProductos,crearProductos,editarProductos,eliminarProductos,ProductoList,verPlataEnStock,catalogo}