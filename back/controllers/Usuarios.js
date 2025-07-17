const {connection} = require("../database/config")



const verUsuarios = (req,res) =>{
    const Id_sucursal = req.params.Id_sucursal
   connection.query("SELECT * FROM usuarios WHERE Id_sucursal = ? AND  Estado = 1 ",[Id_sucursal] , (error,results)=>{
    if(error)throw error
    res.json(results)
   })
}

const crearUsuarios = (req,res) =>{
   connection.query("INSERT INTO usuarios SET ?",{
    nombre_usuario: req.body.nombre_usuario,
    clave_usuario: req.body.clave_usuario,
    rol_usuario: req.body.rol_usuario,
    Id_sucursal: req.body.Id_sucursal,
    Estado: 1
   },(error,results)=>{
    if(error)throw error
    res.json(results)
   })
}

const editarUsuarios = (req,res) =>{ 
    const Id_usuario = req.params.Id_usuario
    const {nombre_usuario, clave_usuario, rol_usuario,Id_sucursal} = req.body
    connection.query(`UPDATE usuarios SET
    
                      nombre_usuario = '${nombre_usuario}',
                      clave_usuario = '${clave_usuario}',
                      rol_usuario = '${rol_usuario}',
                      Id_sucursal = '${Id_sucursal}'

                      WHERE Id_usuario = ${Id_usuario}`,
    (error,results)=>{
        if(error)throw error
        res.json(results)
    }) 
}


const eliminarUsuarios = (req,res)=>{
    const Id_usuario = req.params.Id_usuario

    connection.query("UPDATE usuarios set Estado = 0 WHERE Id_usuario = " + Id_usuario, (error,results)=>{
        if(error)throw error
        res.json(results)
    })
}


module.exports = {verUsuarios,crearUsuarios,editarUsuarios,eliminarUsuarios}