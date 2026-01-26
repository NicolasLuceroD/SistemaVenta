const {connection} = require("../database/config")


const verTurnos = (req,res) =>{
    connection.query(`
    SELECT 
      t.Id_turno,
      t.FechaIngreso AS FechaIngreso,
      DATE_FORMAT(t.FechaSalida, '%Y-%m-%d %H:%i:%s')  AS FechaSalida,
      t.FondoCaja,
      t.Efectivo,
      t.Cigarrillos,
      t.Transferencia,
      t.Debito,
      t.Egreso,
      t.Ingreso,
      t.Id_turno,
      t.FechaIngreso AS FechaIngreso,
      DATE_FORMAT(t.FechaSalida, '%Y-%m-%d %H:%i:%s')  AS FechaSalida,
      t.FondoCaja,
      t.Efectivo,
      t.Cigarrillos,
      t.Transferencia,
      t.Debito,
      t.Egreso,
      t.Ingreso,
      t.TotalEnCaja,
      t.Estado,
      t.Id_sucursal,
      t.Id_usuario,
      t.Id_caja,
      s.nombre_sucursal AS NombreSucursal,
      u.nombre_usuario AS NombreUsuario
    FROM turno t
    INNER JOIN sucursales s ON t.Id_sucursal = s.Id_sucursal
    INNER JOIN usuarios u ON t.Id_usuario = u.Id_usuario
    ORDER BY t.FechaIngreso DESC
    `,(error,results)=>{
        if(error)throw error
        res.json(results)
    })
} 

const abrirTurno = (req, res) => {
  connection.query(
    "INSERT INTO turno SET ?",
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
  const {
    IdTurno,
    Efectivo,
    Cigarrillos,
    Transferencia,
    Debito,
    Egreso,
    Ingreso,
    TotalEnCaja
  } = req.body;

  connection.query(
    `
    UPDATE turno SET 
      FechaSalida = CONVERT_TZ(NOW(), @@session.time_zone, '-03:00'),
      Efectivo = ?,
      Cigarrillos = ?,
      Transferencia = ?,
      Debito = ?,
      Egreso = ?,
      Ingreso = ?,
      TotalEnCaja = ?,
      Estado = 'CERRADO'
    WHERE Id_turno = ?
    `,
    [
      Efectivo,
      Cigarrillos,
      Transferencia,
      Debito,
      Egreso,
      Ingreso,
      TotalEnCaja,
      IdTurno
    ],
    (error, results) => {
      if (error) {
        console.error("Error al cerrar turno:", error);
        return res.status(500).json({ error: "Error al cerrar turno" });
      }
      res.json(results);
    }
  );
};



module.exports = {verTurnos,abrirTurno,finalizarTurno}