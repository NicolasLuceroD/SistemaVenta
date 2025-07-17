const { connection } = require("../database/config");

const ventaxDepartamento = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT 
            c.nombre_categoria, 
            COUNT(*) AS total_ventas_categoria 
        FROM 
            venta v 
        JOIN 
            detalleventa dv ON v.Id_venta = dv.Id_venta 
        JOIN 
            producto p ON dv.Id_producto = p.Id_producto 
        JOIN 
            categoria c ON p.Id_categoria = c.Id_categoria 
        WHERE 
            DATE(v.fecha_registro) BETWEEN ? AND ?
            AND v.Id_sucursal = ?
            AND c.Estado = 1 
        GROUP BY 
            c.nombre_categoria;`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const ventaMetodoPago = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT 
                    metopago.tipo_metodoPago AS tipo_metodo_pago, 
                    SUM(v.precioTotal_venta) AS monto_total 
                FROM 
                    venta v
                INNER JOIN 
                    metopago ON v.Id_metodoPago = metopago.Id_metodoPago 
                WHERE
                DATE 
                    (v.fecha_registro) BETWEEN ? AND ?
                AND 
                    v.Id_sucursal = ?
                GROUP BY 
                    metopago.tipo_metodoPago`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const ventatotalxDepto = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT 
                    c.nombre_categoria, 
                    ROUND(SUM(dv.CantidadVendida * p.precioVenta), 2) AS monto_total 
                FROM 
                    venta v 
                JOIN 
                    detalleventa dv ON v.Id_venta = dv.Id_venta 
                JOIN 
                    producto p ON dv.Id_producto = p.Id_producto 
                JOIN 
                    categoria c ON p.Id_categoria = c.Id_categoria 
                WHERE 
                    DATE(v.fecha_registro) BETWEEN ? AND ?
                    AND v.Id_sucursal = ?
                    AND c.Estado = 1
                GROUP BY 
                    c.nombre_categoria;
                `,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const ventaClientes = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
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
                    AND
                        v.Id_sucursal = ?
                    AND c.Estado = 1    
                    GROUP BY 
                        c.nombre_cliente`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const ventaEmpleados = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;

  connection.query(
    `SELECT
                        u.nombre_usuario AS nombre_usuario,
                        COUNT(v.Id_venta) AS total_ventas,
                        SUM(v.precioTotal_venta) AS precioTotal_venta
                    FROM
                        usuarios u
                    LEFT JOIN
                        venta v ON v.Id_usuario = u.Id_usuario
                    WHERE
                        u.rol_usuario = 'empleado'
                        AND (u.Id_sucursal = ? OR v.Id_venta IS NULL)
                        AND u.Estado = 1
                        AND DATE(v.fecha_registro) BETWEEN ? AND ?
                    GROUP BY
                        u.nombre_usuario, u.Id_usuario`,
    [id_sucursal, fechaInicio, fechaFin],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const ventaTotales = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT SUM((precioTotal_venta)) AS total_ventas
                      FROM venta
                      WHERE DATE(fecha_registro) BETWEEN ? AND ?
                      AND Id_sucursal = ?`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const numeroVentas = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT COUNT(*) AS total_ventas
      FROM venta
      WHERE DATE(fecha_registro) BETWEEN ? AND ?
      AND Id_sucursal = ?`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const gananciasventas = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT ROUND(SUM((p.precioVenta - p.precioCompra) * dv.CantidadVendida), 2) AS total_ganancia
                      FROM detalleventa dv
                      JOIN venta v ON dv.Id_venta = v.Id_venta
                      JOIN producto p ON dv.Id_producto = p.Id_producto
                      WHERE DATE(v.fecha_registro) BETWEEN ? AND ?
                      AND v.Id_sucursal = ?`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};


const gananciasventasXPaquete = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT ROUND(SUM((p.precio_paquete - p.precioCosto) * dv.CantidadVendida), 2) AS gananciaPaquetes
                      FROM detalleventa dv
                      JOIN venta v ON dv.Id_venta = v.Id_venta
                      JOIN paquete p ON dv.Id_paquete= p.Id_paquete
                      WHERE DATE(v.fecha_registro) BETWEEN ? AND ?
                      AND v.Id_sucursal = ?`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};


const margenutilidadpromedio = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT ROUND(AVG((p.precioVenta - p.precioCompra) / p.precioVenta * 100), 2) AS margen_utilidad_promedio
                    FROM detalleventa dv
                    JOIN venta v ON dv.Id_venta = v.Id_venta
                    JOIN producto p ON dv.Id_producto = p.Id_producto
                    WHERE DATE(v.fecha_registro) BETWEEN ? AND ?
                    AND v.Id_sucursal = ?`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const ventaspromedio = (req, res) => {
  const { fechaInicio, fechaFin, id_sucursal } = req.query;
  connection.query(
    `SELECT ROUND(SUM(precioTotal_venta) / COUNT(*) , 2) AS promedio_ventas
                      FROM venta
                      WHERE DATE(fecha_registro) BETWEEN ? AND ?
                      AND Id_sucursal = ?`,
    [fechaInicio, fechaFin, id_sucursal],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};



module.exports = {
  ventaxDepartamento,
  ventaMetodoPago,
  ventatotalxDepto,
  ventaClientes,
  ventaEmpleados,
  ventaTotales,
  numeroVentas,
  gananciasventas,
  ventaspromedio,
  margenutilidadpromedio,
  gananciasventasXPaquete
};
