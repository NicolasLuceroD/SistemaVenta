const {connection} = require('../database/config')


const verMetodoPago = (req,res) =>{
    connection.query("SELECT * FROM metopago", (error,results)=>{
        if(error) throw error
        res.json(results)
    })
}


const crear = (req,res) =>{
    connection.query("INSERT INTO metopago  set ? ",{
        Id_metodoPago: req.body.Id_metodoPago,
        tipo_metodoPago: req.body.tipo_metodoPago
    },(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}

const editar = (req,res) =>{
    const Id_metodoPago = req.params.Id_metodoPago;
    const tipo_metodoPago = req.body.tipo_metodoPago
    connection.query(`UPDATE metopago SET
    
                    tipo_metodoPago = '${tipo_metodoPago}'

                    WHERE Id_metodoPago =${Id_metodoPago}   
    `,(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}

const eliminar = (req, res) => {
    const Id_metodoPago = req.params.Id_metodoPago;
    const query = "DELETE FROM metopago WHERE Id_metodoPago = ?";
    
    connection.query(query, [Id_metodoPago], (error, results) => {
        if (error) {
            console.error("Error al eliminar el método de pago:", error);
            res.status(500).send("Error al procesar su solicitud");
            return;
        }
        res.json(results);
    });
}


module.exports = {verMetodoPago,crear,editar,eliminar}