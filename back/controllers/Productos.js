/* eslint-disable no-undef */
const {connection} = require ('../database/config')

 

const precioVentaPorSucursalSQL = (idSucursal) => `
  CASE
    WHEN ${Number(idSucursal) || 0} = 1 THEN p.precioVentaSucGuillermina
    WHEN ${Number(idSucursal) || 0} = 2 THEN p.precioVentaSucSanMartin
    ELSE p.precioVentaSucGuillermina
  END
`;


const verProductos =(req,res)=>{
  connection.query(`SELECT p.Id_producto ,p.nombre_producto, p.descripcion_producto, p.precioCompra, p.precioVentaSucSanMartin,p.precioVentaSucGuillermina, p.tipo_venta,  p.FechaRegistro, p.codProducto, p.PrecioMayoreo ,c.Id_categoria, c.nombre_categoria, c.descripcion_categoria 
                    FROM producto p  INNER JOIN categoria c  ON p.Id_categoria = c.Id_categoria 
                    WHERE p.Estado = 1;  
                    `,
  (error,results)=>{
      if(error)throw error
      res.json(results)
  })
}

const crearProducs = (req, res) => {
  const data = {
    nombre_producto: req.body.nombre_producto,
    descripcion_producto: req.body.descripcion_producto,
    precioCompra: req.body.precioCompra,
    precioVentaSucSanMartin: req.body.precioVentaSucSanMartin,
    precioVentaSucGuillermina: req.body.precioVentaSucGuillermina,
    Id_categoria: req.body.Id_categoria,
    Id_sucursal: req.body.Id_sucursal,
    tipo_venta: req.body.tipo_venta,
    codProducto: req.body.codProducto,
    Estado: 1,
    PrecioMayoreo: req.body.PrecioMayoreo,
    inventarioMinimo: req.body.inventarioMinimo
  };

  connection.query('INSERT INTO producto SET ?', data, (error, results) => {
    if (error) {
      console.error('Error crearProducs:', error);
      return res.status(500).json({ error: 'Error al crear producto' });
    }
    res.json(results);
  });
};

/**
 * POST /productos (robusto)
 * - valida datos
 * - evita duplicados por codProducto
 * - transacción
 */
const crearProductos = (req, res) => {
  const {
    nombre_producto,
    descripcion_producto,
    precioCompra,
    precioVentaSucSanMartin,
    precioVentaSucGuillermina,
    Id_categoria,
    Id_sucursal,
    tipo_venta,
    FechaVencimiento,
    codProducto,
    Estado = 1,
    PrecioMayoreo = 0,
    inventarioMinimo = 0
  } = req.body;

  // Validaciones mínimas (ajustalas si querés)
  if (
    !nombre_producto ||
    !descripcion_producto ||
    isNaN(Number(precioCompra)) ||
    isNaN(Number(precioVentaSucGuillermina)) ||
    isNaN(Number(precioVentaSucSanMartin)) ||
    isNaN(Number(Id_categoria)) ||
    isNaN(Number(Id_sucursal)) ||
    !tipo_venta ||
    !FechaVencimiento ||
    !codProducto
  ) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  const productData = {
    nombre_producto,
    descripcion_producto,
    precioCompra: Number(precioCompra),
    precioVentaSucSanMartin: Number(precioVentaSucSanMartin),
    precioVentaSucGuillermina: Number(precioVentaSucGuillermina),
    Id_categoria: Number(Id_categoria),
    Id_sucursal: Number(Id_sucursal),
    tipo_venta,
    FechaVencimiento,
    codProducto,
    Estado: Number(Estado),
    PrecioMayoreo: Number(PrecioMayoreo),
    inventarioMinimo: Number(inventarioMinimo)
  };

  connection.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ error: 'Error al iniciar la transacción' });
    }

    connection.query(
      'SELECT Id_producto FROM producto WHERE codProducto = ? LIMIT 1',
      [codProducto],
      (err, results) => {
        if (err) {
          console.error('Error al verificar producto:', err);
          return connection.rollback(() => {
            res.status(500).json({ error: 'Error al verificar existencia' });
          });
        }

        if (results.length > 0) {
          return connection.rollback(() => {
            res.status(400).json({ error: 'El producto ya existe' });
          });
        }

        connection.query('INSERT INTO producto SET ?', productData, (error) => {
          if (error) {
            console.error('Error al insertar producto:', error);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al agregar el producto' });
            });
          }

          connection.commit((err) => {
            if (err) {
              console.error('Error al commit:', err);
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error al confirmar transacción' });
              });
            }
            res.json('Producto Agregado');
          });
        });
      }
    );
  });
};

/**
 * PUT /productos/:Id_producto
 * ✅ query parametrizada (sin inyección)
 */
const editarProductos = (req, res) => {
  const Id_producto = Number(req.params.Id_producto);

  const {
    nombre_producto,
    tipo_venta,
    descripcion_producto,
    precioCompra,
    Id_categoria,
    precioVentaSucGuillermina,
    precioVentaSucSanMartin,
    codProducto,
    PrecioMayoreo,
    inventarioMinimo,
    FechaVencimiento
  } = req.body;

  const sql = `
    UPDATE producto SET
      nombre_producto = ?,
      precioCompra = ?,
      precioVentaSucGuillermina = ?,
      precioVentaSucSanMartin = ?,
      descripcion_producto = ?,
      Id_categoria = ?,
      tipo_venta = ?,
      codProducto = ?,
      PrecioMayoreo = ?,
      inventarioMinimo = ?,
      FechaVencimiento = ?
    WHERE Id_producto = ?;
  `;

  const params = [
    nombre_producto,
    Number(precioCompra),
    Number(precioVentaSucGuillermina),
    Number(precioVentaSucSanMartin),
    descripcion_producto,
    Number(Id_categoria),
    tipo_venta,
    codProducto,
    Number(PrecioMayoreo),
    Number(inventarioMinimo ?? 0),
    FechaVencimiento ?? null,
    Id_producto
  ];

  connection.query(sql, params, (error) => {
    if (error) {
      console.error('Error editarProductos:', error);
      return res.status(500).json({ error: 'Error al editar producto' });
    }
    res.json('Producto Editado');
  });
};

/**
 * DELETE lógico: PUT /productos/eliminar/:Id_producto
 */
const eliminarProductos = (req, res) => {
  const Id_producto = Number(req.params.Id_producto);

  connection.query(
    'UPDATE producto SET Estado = 0 WHERE Id_producto = ?',
    [Id_producto],
    (error, results) => {
      if (error) {
        console.error('Error eliminarProductos:', error);
        return res.status(500).json({ error: 'Error al eliminar producto' });
      }
      res.json(results);
    }
  );
};

/**
 * GET /productos/nombre/:nombre_producto
 * ✅ corregido: antes referías columnas que no existen
 */
const ProductoList = (req, res) => {
  const nombre_producto = req.params.nombre_producto;

  if (!nombre_producto) {
    return res.status(400).send('Falta el nombre del producto');
  }

  connection.query(
    `SELECT Id_producto, nombre_producto, descripcion_producto, precioCompra,
            precioVentaSucGuillermina, precioVentaSucSanMartin, PrecioMayoreo, tipo_venta, codProducto
     FROM producto
     WHERE nombre_producto = ? AND Estado = 1
     LIMIT 1;`,
    [nombre_producto],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error al buscar el producto.');
      }
      if (result.length === 0) return res.status(404).send('Producto no encontrado.');
      res.send(result[0]);
    }
  );
};

/**
 * ⚠️ Esta función estaba conceptualmente mal:
 * (SUM(precioCompra) * SUM(cantidad)) no es valor de stock real.
 * Lo correcto es SUM(stock.cantidad * producto.precioCompra).
 */
const verPlataEnStock = (req, res) => {
  const idSucursal = Number(req.query.id_sucursal || req.query.Id_sucursal || 1);

  connection.query(
    `
    SELECT
      COALESCE(SUM(s.cantidad), 0) AS cantidad_productos,
      COALESCE(SUM(s.cantidad * p.precioCompra), 0) AS total_valor
    FROM stock s
    INNER JOIN producto p ON s.Id_producto = p.Id_producto
    WHERE p.Estado = 1
      AND s.Id_sucursal = ?;
    `,
    [idSucursal],
    (error, results) => {
      if (error) {
        console.error('Error verPlataEnStock:', error);
        return res.status(500).json({ error: 'Error al calcular stock' });
      }
      res.json(results);
    }
  );
};

/**
 * GET /productos/categoria/:Id_categoria?id_sucursal=1|2
 * ✅ agrega precioVenta calculado igual que verProductos
 */
const productoPorCategoria = (req, res) => {
  const Id_categoria = Number(req.params.Id_categoria);
  const idSucursal = Number(req.query.id_sucursal || req.query.Id_sucursal || 1);

  const sql = `
    SELECT
      p.Id_producto,
      p.nombre_producto,
      p.descripcion_producto,
      p.precioCompra,
      p.precioVentaSucSanMartin,
      p.precioVentaSucGuillermina,
      ${precioVentaPorSucursalSQL(idSucursal)} AS precioVenta,
      p.PrecioMayoreo,
      p.tipo_venta,
      p.FechaRegistro,
      p.FechaVencimiento,
      p.codProducto,
      p.inventarioMinimo,
      c.nombre_categoria,
      c.descripcion_categoria
    FROM producto p
    INNER JOIN categoria c ON p.Id_categoria = c.Id_categoria
    WHERE c.Id_categoria = ?
      AND p.Estado = 1;
  `;

  connection.query(sql, [Id_categoria], (error, results) => {
    if (error) {
      console.error('Error productoPorCategoria:', error);
      return res.status(500).json({ error: 'Error al traer productos por categoría' });
    }
    res.json(results);
  });
};

/**
 * ❌ Antes actualizabas "precioVenta" que ya no existe / no querés usar.
 * ✅ Ahora actualiza el precio por sucursal según el id_sucursal.
 * PUT /productos/modificarPrecio/:Id_categoria?id_sucursal=1|2
 * body: { porcentaje: 10 }
 */
const modificarPrecioProducto = (req, res) => {
  const porcentaje = Number(req.body.porcentaje);
  const Id_categoria = Number(req.params.Id_categoria);
  const idSucursal = Number(req.query.id_sucursal || req.query.Id_sucursal || 1);

  if (isNaN(porcentaje)) {
    return res.status(400).json({ error: 'porcentaje inválido' });
  }

  const campo =
    idSucursal === 1 ? 'precioVentaSucGuillermina'
    : idSucursal === 2 ? 'precioVentaSucSanMartin'
    : null;

  if (!campo) return res.status(400).json({ error: 'id_sucursal inválido' });

  const sql = `
    UPDATE producto
    SET ${campo} = (${campo} + (${campo} * ? / 100))
    WHERE Id_categoria = ? AND Estado = 1;
  `;

  connection.query(sql, [porcentaje, Id_categoria], (error, results) => {
    if (error) {
      console.error('Error modificarPrecioProducto:', error);
      return res.status(500).json({ error: 'Error al modificar precios' });
    }
    res.json(results);
  });
};

/**
 * GET /productos/catalogo?id_sucursal=1|2
 * ✅ agrega precioVenta listo para front
 */
const catalogo = (req, res) => {
  const idSucursal = Number(req.query.id_sucursal || req.query.Id_sucursal || 1);

  const sql = `
    SELECT
      p.nombre_producto,
      p.precioVentaSucSanMartin,
      p.precioVentaSucGuillermina,
      ${precioVentaPorSucursalSQL(idSucursal)} AS precioVenta,
      p.PrecioMayoreo,
      c.nombre_categoria
    FROM producto p
    INNER JOIN categoria c ON p.Id_categoria = c.Id_categoria
    WHERE p.Estado = 1;
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error catalogo:', error);
      return res.status(500).json({ error: 'Error al traer catálogo' });
    }
    res.json(results);
  });
};

/**
 * Productos próximos a vencer
 */
const productoVencimiento = (req, res) => {
  connection.query(
    `SELECT *
     FROM producto
     WHERE Estado = 1
       AND FechaVencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 20 DAY);`,
    (error, results) => {
      if (error) {
        console.error('Error productoVencimiento:', error);
        return res.status(500).json({ error: 'Error al traer vencimientos' });
      }
      res.json(results);
    }
  );
};

/**
 * ✅ Unifica "productos + promos" (arreglando el UNION que estaba roto)
 * GET /productos/verProductosYPromos?id_sucursal=1|2
 *
 * Devuelve una lista plana con un campo `tipo_item` ("producto" | "promo")
 * para que el front sepa qué es cada uno.
 */
const verProductosYPromos = (req, res) => {
  const idSucursal = Number(req.query.id_sucursal || req.query.Id_sucursal || 1);

  const sql = `
    SELECT
      'producto' AS tipo_item,
      p.Id_producto AS Id_item,
      p.nombre_producto,
      p.descripcion_producto,
      ${precioVentaPorSucursalSQL(idSucursal)} AS precioVenta,
      p.PrecioMayoreo,
      p.tipo_venta,
      NULL AS nombre_promocion,
      NULL AS precio_paquete,
      NULL AS Id_paquete
    FROM producto p
    WHERE p.Estado = 1

    UNION ALL

    SELECT
      'promo' AS tipo_item,
      q.Id_paquete AS Id_item,
      NULL AS nombre_producto,
      NULL AS descripcion_producto,
      NULL AS precioVenta,
      NULL AS PrecioMayoreo,
      'Promo' AS tipo_venta,
      q.nombre_promocion,
      q.precio_paquete,
      q.Id_paquete
    FROM paquete q;
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error verProductosYPromos:', error);
      return res.status(500).send('Error interno del servidor al obtener los productos y promociones');
    }
    res.json(results);
  });
};

module.exports = {
  crearProducs,
  verProductosYPromos,
  productoVencimiento,
  modificarPrecioProducto,
  productoPorCategoria,
  verProductos,
  crearProductos,
  editarProductos,
  eliminarProductos,
  ProductoList,
  verPlataEnStock,
  catalogo
};