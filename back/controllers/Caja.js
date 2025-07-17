const {connection} = require('../database/config')



const verCaja = (req,res)=>{
    const Id_sucursal = req.params.Id_sucursal
    connection.query("SELECT * FROM caja WHERE Id_sucursal = ?", [Id_sucursal], (error,results)=>{
        if(error) throw error
        res.json(results)
    })
} 


const loginCaja = (req, res) => {

    const Id_caja = req.body.Id_caja;
    const Id_sucursal = req.body.Id_sucursal;
    
    connection.query(
        "SELECT Id_caja FROM caja WHERE Id_caja = ? AND Id_sucursal = ?",
        [Id_caja, Id_sucursal],
        (error, result) => {
            if (error) {
                console.error("Error al ejecutar la consulta SQL:", error);
                res.status(500).send("Error interno del servidor");
            } else {
                if (result.length > 0) {
                    res.status(200).send({ Id_caja: result[0].Id_caja });
                } else {
                    res.status(400).send('Nombre de sucursal y/o contraseña incorrecta');
                }
            }
        }
    );
};



 

module.exports = {verCaja,loginCaja}


