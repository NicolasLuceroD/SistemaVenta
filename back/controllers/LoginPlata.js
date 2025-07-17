const {connection} = require('../database/config')


const VerPlataLogin = (req,res) =>{
    connection.query("SELECT * FROM plataencajalogin",(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}
const VerPlataLoginConUsuario = (req,res) =>{
    const Id_usuario = req.params.Id_usuario
    const Id_caja = req.params.Id_caja
    const FechaRegistro = req.params.fechaSeleccionada
    connection.query(" SELECT * FROM plataencajalogin  WHERE Id_usuario = ? and Id_caja = ? and DATE(FechaRegistro) =  ? ORDER BY FechaRegistro DESC LIMIT 1",[Id_usuario,Id_caja,FechaRegistro],(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}

const verPlataCajaLogin = (req, res) => {
    const Id_sucursal = req.params.Id_sucursal;
    const FechaRegistro = req.params.fechaSeleccionada; 
    connection.query(`  
    SELECT u.nombre_usuario, s.nombre_sucursal, p.cantidadPlataLogin, p.FechaRegistro
    FROM plataencajalogin p
    INNER JOIN  usuarios u ON u.Id_usuario = p.Id_usuario
    INNER JOIN sucursales s ON s.Id_sucursal = p.Id_sucursal
    INNER JOIN caja c ON c.Id_caja = p.Id_caja
    WHERE s.Id_sucursal =?
	AND Date(p.FechaRegistro) = ?;`, [Id_sucursal, FechaRegistro], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};




const registrarPlataLogin = (req,res) =>{
    connection.query("INSERT INTO plataencajalogin SET ? ",{
        cantidadPlataLogin : req.body.cantidadPlataLogin,
        Id_usuario: req.body.Id_usuario,
        Id_sucursal: req.body.Id_sucursal,
        Id_caja: req.body.Id_caja
    }, (error,results)=>{
        if(error) throw error
        res.json(results)
    })
   
}


module.exports = { VerPlataLoginConUsuario, VerPlataLogin, registrarPlataLogin,verPlataCajaLogin}