const {connection} = require("../database/config")


const verTurnos = (req,res) =>{
    connection.query("SELECT * FROM Turno",(error,results)=>{
        if(error)throw error
        res.json(results)
    })
}

const abrirTurno = (req, res) => {
  connection.query(
    "INSERT INTO Turno SET ?",
    {
      FechaSalida: req.body.FechaSalida,
      FondoCaja: req.body.FondoCaja,
      Efectivo: req.body.Efectivo,
      Cigarrillos: req.body.Cigarrillos,
      Transferencia: req.body.Transferencia,
      Debito: req.body.Debito,
      Egreso: req.body.Egreso,
      Ingreso: req.body.Ingreso,
      TotalEnCaja: req.body.TotalEnCaja,
      Id_sucursal: req.body.Id_sucursal,
      Id_usuario: req.body.Id_usuario,
      Id_caja: req.body.Id_caja,
      Estado: "ABIERTO"
    },
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al abrir turno' });
      }
      res.json({
        ok: true,
        IdTurno: results.insertId
      });
    }
  );
};


const finalizarTurno = (req, res) => {
  const { IdTurno, Efectivo, Cigarrillos, Transferencia, Debito, Egreso, Ingreso, TotalEnCaja } = req.body;

  connection.query(
    `UPDATE turno SET 
      FechaSalida = NOW(),
      Efectivo = '${Efectivo}',
      Cigarrillos = '${Cigarrillos}',
      Transferencia = '${Transferencia}',
      Debito = '${Debito}',
      Egreso = '${Egreso}',
      Ingreso = '${Ingreso}',
      TotalEnCaja = '${TotalEnCaja}',
      Estado = 'CERRADO'

     WHERE Id_turno = ${IdTurno}`,
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};



module.exports = {verTurnos,abrirTurno,finalizarTurno}