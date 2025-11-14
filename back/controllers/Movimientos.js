const {connection} = require("../database/config")



const registrarEgreso = (req,res) =>{
    console.log('todo',req.body)
    connection.query("INSERT INTO egreso SET ?",{
        DescripcionEgreso: req.body.DescripcionEgreso,
        montoTotalEgreso: req.body.montoTotalEgreso,
        Id_usuario: req.body.Id_usuario,
        Id_sucursal: req.body.Id_sucursal,
        Id_caja: req.body.Id_caja,
    },(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}

const verEgreso = (req,res) =>{
    connection.query("SELECT * FROM egreso",(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}
const verIngreso = (req,res) =>{
    connection.query("SELECT * FROM ingreso",(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}



const registrarIngreso = (req,res) =>{
    connection.query("INSERT INTO ingreso SET ?",{
        DescripcionIngreso: req.body.DescripcionIngreso,
        montoTotalIngreso: req.body.montoTotalIngreso,
        Id_usuario: req.body.Id_usuario,
        Id_sucursal: req.body.Id_sucursal,
        Id_caja: req.body.Id_caja,
    },(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}



const retistrarMotivosEgresos = (req,res) =>{
    connection.query("INSERT INTO motivosegresos SET ?",{
        Motivo: req.body.Motivo,
        Estado: 1
    },(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}


const verMotivosEgresos = (req,res) =>{
    connection.query("SELECT * FROM motivosegresos where Estado = 1", (error,results)=>{
        if(error) throw error
        res.json(results)
    })
}

const eliminarMotivosEgresos = (req,res) =>{
    const IdMotivoEgreso= req.params.IdMotivoEgreso
    connection.query('UPDATE  motivosegresos set  Estado  = 0 where IdMotivoEgreso = ? ',[IdMotivoEgreso],
    (error,results)=>{
        if(error) throw error
        res.json(results)
    }
    )
}

const editarMotivosEgresos = (req,res)=>{
    const IdMotivoEgreso=  req.body.IdMotivoEgreso
    const Motivo = req.body.Motivo
    connection.query( `UPDATE motivosegresos SET

                            Motivo='${Motivo}'

                            WHERE IdMotivoEgreso = ${IdMotivoEgreso}`,
                    
                            (error)=>{
                                if(error) throw error
                                res.json("Motivo Editado")
                            }
                            )
}

module.exports={ registrarEgreso, verMotivosEgresos,editarMotivosEgresos,registrarIngreso,eliminarMotivosEgresos,retistrarMotivosEgresos,verEgreso,verIngreso}
