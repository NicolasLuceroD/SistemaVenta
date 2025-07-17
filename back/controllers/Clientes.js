const {connection} = require ('../database/config')

const verClientes = (req, res) => {
  const sucursalId = req.params.sucursalId;
  connection.query(
    'SELECT * FROM cliente WHERE Estado = 1 AND Id_sucursal = ?',
    [sucursalId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};




const crearCliente = (req,res)=>{
    connection.query('INSERT INTO cliente SET ?',
    {
        Id_cliente: req.body.Id_cliente,
        nombre_cliente: req.body.nombre_cliente,
        apellido_cliente: req.body.apellido_cliente,
        telefono_cliente: req.body.telefono_cliente,
        domicilio_cliente: req.body.domicilio_cliente,
        montoCredito: req.body.montoCredito,
        LimiteCredito: req.body.LimiteCredito,
        Estado: 1,
        Id_sucursal: req.body.Id_sucursal
    },
    (error,results)=>{
        if(error) throw error
        res.json(results)
    })
}


const editarCliente = (req,res)=>{
    const Id_cliente = req.params.Id_cliente
    const {nombre_cliente,apellido_cliente,telefono_cliente,domicilio_cliente,montoCredito,LimiteCredito}=req.body
    connection.query(`UPDATE cliente SET

                    nombre_cliente='${nombre_cliente}',
                    apellido_cliente= '${apellido_cliente}',
                    telefono_cliente= '${telefono_cliente}',
                    domicilio_cliente='${domicilio_cliente}',
                    montoCredito = '${montoCredito}',
                    LimiteCredito= '${LimiteCredito}'


                    WHERE Id_cliente =${Id_cliente}  `,
                    (error,results)=>{
                        if(error)throw error
                        res.json(results)
                    }
  )
}



const eliminarCliente = (req,res)=>{
    const Id_cliente = req.params.Id_cliente
    connection.query('UPDATE cliente set Estado = 0 WHERE Id_cliente= ' + Id_cliente,
    (error,results)=>{
        if(error) throw error
        res.json(results)
    })
}



module.exports= {verClientes,crearCliente,editarCliente,eliminarCliente}