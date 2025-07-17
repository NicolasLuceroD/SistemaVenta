
const  {connection} = require ('../database/config')


const  verProveedores = (req,res) =>{
    connection.query("SELECT * FROM proveedores WHERE Estado = 1", (error,results) =>{
        if(error) throw error
        res.json(results)
    })
}


const crearProveedores = (req,res) =>{
    connection.query("INSERT INTO proveedores  SET ?" ,
    {
            nombre_proveedor : req.body.nombre_proveedor,
            descripcion_proveedor :  req.body.descripcion_proveedor,
            numTel_proveedor : req.body.numTel_proveedor,
            Estado: 1,
            montoCredito: 0
            
    },(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}


const editarProveedores = (req, res) => {
    const Id_proveedor = req.params.Id_proveedor;
    const { nombre_proveedor, descripcion_proveedor, numTel_proveedor } = req.body;
    connection.query(
        `UPDATE proveedores SET 
            nombre_proveedor = '${nombre_proveedor}',
            descripcion_proveedor = '${descripcion_proveedor}',       
            numTel_proveedor = '${numTel_proveedor}'
            
            WHERE Id_proveedor = ${Id_proveedor}`,
            (error, results) => {
                if (error) throw error;
                res.json(results);
            }
        );
};

const eliminarProveedor = (req,res) =>{
    const Id_proveedor = req.params.Id_proveedor

    connection.query("UPDATE proveedores SET Estado = 0 WHERE Id_proveedor = " + Id_proveedor, 
    (error,results)=>{
        if(error) throw error
        res.json(results)
    })
}


module.exports = { verProveedores, crearProveedores,editarProveedores,eliminarProveedor}