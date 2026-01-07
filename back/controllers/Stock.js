const {connection} = require('../database/config')


const verStock = (req,res) =>{ 
    const Id_producto = req.params.Id_producto
    const Id_sucursal = req.params.Id_sucursal
    connection.query(`SELECT * FROM stock WHERE Id_producto = ? AND Id_sucursal = ?;`, [Id_producto,Id_sucursal],(error,results) =>{
        if(error)throw error
        res.json(results)
    } )
}



const verStock1 = (req, res) => { 
  connection.query(
    `SELECT 
        s.cantidad, s.Id_stock,
        p.nombre_producto, 
        p.precioCompra,
        p.precioVentaSucGuillermina AS precioVenta, 
        p.precioVentaSucGuillermina,
        p.precioVentaSucSanMartin,
        p.descripcion_producto, p.Id_producto, p.FechaRegistro, p.tipo_venta,
        p.codProducto, p.PrecioMayoreo, p.inventarioMinimo,
        suc.nombre_sucursal, suc.Id_sucursal
     FROM stock s
     INNER JOIN producto p ON s.Id_producto = p.Id_producto
     INNER JOIN sucursales suc ON s.Id_sucursal = suc.Id_sucursal
     WHERE s.Id_sucursal = 1;`,
    (error, results) => {
      if (error) {
        console.error("Error verStock1:", error);
        return res.status(500).json({ error: "Error al obtener stock sucursal 1" });
      }
      res.json(results);
    }
  );
};

const verStock2 = (req, res) => { 
  connection.query(
    `SELECT 
        s.cantidad, s.Id_stock,
        p.nombre_producto, 
        p.precioCompra,
        p.precioVentaSucSanMartin AS precioVenta,    
        p.precioVentaSucGuillermina,
        p.precioVentaSucSanMartin,
        p.descripcion_producto, p.Id_producto, p.FechaRegistro, p.tipo_venta,
        p.codProducto, p.PrecioMayoreo, p.inventarioMinimo,
        suc.nombre_sucursal, suc.Id_sucursal
     FROM stock s
     INNER JOIN producto p ON s.Id_producto = p.Id_producto
     INNER JOIN sucursales suc ON s.Id_sucursal = suc.Id_sucursal
     WHERE s.Id_sucursal = 2;`,
    (error, results) => {
      if (error) {
        console.error("Error verStock2:", error);
        return res.status(500).json({ error: "Error al obtener stock sucursal 2" });
      }
      res.json(results);
    }
  );
};







const crearStock = (req,res) =>{
    connection.query('INSERT INTO stock SET ?',
    {
        cantidad: req.body.cantidad,
        Id_producto: req.body.Id_producto,
        Id_sucursal : req.body.Id_sucursal,
    }
    ,(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}


const editarStock = (req,res) =>{
    const Id_stock = req.params.Id_stock
    const {cantidad, Id_producto} = req.body
    
    connection.query( `UPDATE stock SET 
                    
                        cantidad = '${cantidad}',
                        Id_producto = '${Id_producto}'
                        
                        WHERE Id_stock = ${Id_stock}
    
    `,(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}

const correlativaProduc= (req,res)=>{
    connection.query("select count (*) +1 as 'ultimoProducto' from producto",
    (err,result)=>{
        if(err){
        console.log(err)
    }else{
        res.send(result)
    }})
}


const stockConInvBajo = (req, res) => {
  connection.query(
    `SELECT 
        s.cantidad, s.Id_stock,
        p.nombre_producto, 
        p.precioCompra,
        CASE 
          WHEN s.Id_sucursal = 1 THEN p.precioVentaSucGuillermina
          WHEN s.Id_sucursal = 2 THEN p.precioVentaSucSanMartin
          ELSE p.precioVentaSucGuillermina
        END AS precioVenta,                           
        p.precioVentaSucGuillermina,
        p.precioVentaSucSanMartin,
        p.descripcion_producto, p.Id_producto, p.FechaRegistro, p.tipo_venta,
        p.codProducto, p.inventarioMinimo, p.PrecioMayoreo,
        suc.nombre_sucursal, suc.Id_sucursal
     FROM stock s
     INNER JOIN producto p ON s.Id_producto = p.Id_producto
     INNER JOIN sucursales suc ON s.Id_sucursal = suc.Id_sucursal
     WHERE s.cantidad < p.inventarioMinimo
       AND p.Estado = 1;`,
    (error, results) => {
      if (error) {
        console.error("Error stockConInvBajo:", error);
        return res.status(500).json({ error: "Error al obtener stock con inventario bajo" });
      }
      res.json(results);
    }
  );
};


 
const validarStock = (req,res) =>{
    const {Id_producto, Id_sucursal} = req.params

    connection.query("SELECT * FROM stock where Id_producto = ? and Id_sucursal = ?",
        [Id_producto,Id_sucursal],(error,results)=>{
            if(error) throw error
            res.json(results)
        })
}


module.exports = {verStock, verStock1,verStock2,crearStock,editarStock,correlativaProduc,stockConInvBajo,validarStock}