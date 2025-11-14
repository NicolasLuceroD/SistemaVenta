/* eslint-disable no-undef */
const {connection} = require("../database/config")

const verPaquete = (req,res) =>{
    connection.query("SELECT * FROM paquete",(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}

const crearPaquete = (req,res)=>{
    connection.query('INSERT INTO paquete SET ?',{
        nombre_promocion: req.body.nombre_promocion,
        precio_paquete: req.body.precio_paquete,
        estadoPaquete: req.body.estadoPaquete,
        precioCosto: req.body.precioCosto
    },(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}


const editarPaquete = (req, res) => {
  const Id_paquete = req.params.Id_paquete;
  const { nombre_promocion, precio_paquete, precioCosto } = req.body;

  connection.query(
      `UPDATE paquete SET
          nombre_promocion = '${nombre_promocion}',
          precio_paquete = '${precio_paquete}',
          precioCosto = '${precioCosto}'

       WHERE Id_paquete = ${Id_paquete}`,
      (error, results) => {
          if (error) {
              console.error('Error al editar el paquete:', error);
              return res.status(500).json({ error: 'Error al editar el paquete en la base de datos' });
          }
          res.json(results);
      }
  );
};

const editarDetallePaquete = (req, res) => {
  const Id_detallePaquete = req.params.Id_detallePaquete;
  const { Id_producto, Id_paquete, cantidadProducto } = req.body;

  connection.query(
      `UPDATE detallepaquete SET
          Id_producto = '${Id_producto}',
          Id_paquete = '${Id_paquete}',
          cantidadProducto = '${cantidadProducto}'

       WHERE Id_detallePaquete = ${Id_detallePaquete}`,
      (error, results) => {
          if (error) {
              console.error('Error al editar el detalle del paquete:', error);
              return res.status(500).json({ error: 'Error al editar el detalle del paquete en la base de datos' });
          }
          res.json(results);
      }
  );
};

const CrearDetallePaquete = (req,res) =>{
    connection.query('INSERT INTO detallepaquete SET ?',{
        Id_producto: req.body.Id_producto,
        Id_paquete:  req.body.Id_paquete,
        cantidadProducto: req.body.cantidadProducto
    },(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}

const ultimoPaquete = (req, res) => {
  connection.query("SELECT MAX(Id_paquete) + 1 AS ultimoIdPaquete FROM paquete;", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error en la consulta');
    } else {
      res.json({ ultimoIdPaquete: result[0]?.ultimoIdPaquete || 1 }); 
    }
  });
};






  const verPaqueteCompleto = (req, res) => {
    connection.query(`
    SELECT 
    p.nombre_producto,
    p.Id_producto, 
    q.Id_paquete, 
    q.nombre_promocion, 
    q.precio_paquete,
    q.precioCosto,
    d.Id_detallePaquete,
    d.cantidadProducto
    FROM 
    paquete q
    INNER JOIN 
    detallepaquete d ON q.Id_paquete = d.Id_paquete
    INNER JOIN 
    producto p ON d.Id_producto = p.Id_producto
    WHERE q.estadoPaquete = 1;
    `, (error, results) => {
      if (error) {
        console.error("Error al obtener los paquetes:", error);
        res.status(500).send("Error interno del servidor al obtener los paquetes");
        return;
      }
      
      // Agrupar productos por Id_paquete
      const paquetesAgrupados = results.reduce((acc, item) => {
        // Si no existe el paquete en el acumulador, agregarlo
        if (!acc[item.Id_paquete]) {
          acc[item.Id_paquete] = {
            Id_paquete: item.Id_paquete,
            Id_detallePaquete: item.Id_detallePaquete,
            nombre_promocion: item.nombre_promocion,
            precio_paquete: item.precio_paquete,
            precioCosto: item.precioCosto,
            cantidadProducto: item.cantidadProducto,
            productos: []
          };
        }


       // Verificar si el producto ya se agregó a la venta
      const productoExistente = acc[item.Id_paquete].productos.find(producto => producto.Id_producto === item.Id_producto);
      if (productoExistente) {
        // Si el producto ya está en la venta, actualizar su cantidad
        productoExistente.cantidadProducto += item.cantidadProducto;
      } else {
        // Si el producto no está en la venta, agregarlo
        acc[item.Id_paquete].productos.push({
          Id_producto: item.Id_producto,
          nombre_producto: item.nombre_producto,
          cantidadProducto: item.cantidadProducto, 
        });
      }
      return acc;
    }, {});
  
      // Convertir el objeto agrupado en un array
      const paquetes = Object.values(paquetesAgrupados);
      res.json(paquetes);
    });
  };



  const descCantidadPaquete = (req, res) => {
    const Id_producto = req.body.Id_producto;
    const Id_sucursal = req.body.Id_sucursal;
    const cantidad = req.body.cantidad;
  
    console.log(Id_producto,Id_sucursal,cantidad)
    connection.query('UPDATE stock SET cantidad = cantidad - ? WHERE Id_producto = ? AND Id_sucursal = ?', [cantidad, Id_producto, Id_sucursal], (error, results) => {
      if (error) {
        console.log('Error al actualizar el stock:', error);
      }
      res.json(results);
    });
  };



  const desactivarPaquete = (req, res)=>{
    const Id_paquete = req.params.Id_paquete
    const estadoPaquete = req.body.estadoPaquete
    connection.query('UPDATE paquete SET estadoPaquete = ? WHERE Id_paquete = ?',[estadoPaquete,Id_paquete], (error,results)=>{
      if(error)throw error
      res.json(results)
    })
  }


module.exports= {desactivarPaquete,editarDetallePaquete,verPaquete,crearPaquete,editarPaquete,CrearDetallePaquete,ultimoPaquete,verPaqueteCompleto,descCantidadPaquete}