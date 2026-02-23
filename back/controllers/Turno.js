const { connection } = require("../database/config");

/* =========================
   Helpers
========================= */

const isNumber = (v) => !isNaN(parseFloat(v)) && isFinite(v);

const safeNumber = (v) => (isNumber(v) ? parseFloat(v) : 0);

const badRequest = (res, msg) =>
  res.status(400).json({ ok: false, error: msg });

const serverError = (res, error, context = "") => {
  console.error(`❌ ${context}`, error);
  return res.status(500).json({
    ok: false,
    error: "Error interno del servidor",
  });
};

/* =========================
   VER TURNOS
========================= */

const verTurnos = (req, res) => {
  const { fecha } = req.query;

  let sql = `
    SELECT 
      t.Id_turno,
      t.FechaIngreso,
      DATE_FORMAT(t.FechaSalida, '%Y-%m-%d %H:%i:%s') AS FechaSalida,
      t.FondoCaja,
      t.Efectivo,
      t.Cigarrillos,
      t.Transferencia,
      t.Debito,
      t.Egreso,
      t.Mixto,
      t.Credito,
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
  `;

  const params = [];

  if (fecha) {
    sql += `
      WHERE t.FechaIngreso >= CONCAT(?, ' 00:00:00')
        AND t.FechaIngreso < DATE_ADD(CONCAT(?, ' 00:00:00'), INTERVAL 1 DAY)
    `;
    params.push(fecha, fecha);
  }

  sql += ` ORDER BY t.FechaIngreso DESC`;

  connection.query(sql, params, (error, results) => {
    if (error) return serverError(res, error, "verTurnos");
    res.json({ ok: true, data: results });
  });
};

/* =========================
   ABRIR TURNO
========================= */

const abrirTurno = (req, res) => {
  const {
    FondoCaja,
    Id_sucursal,
    Id_usuario,
    Id_caja,
    FechaIngreso,
  } = req.body;

  if (!Id_usuario || !Id_caja || !Id_sucursal) {
    return badRequest(res, "Faltan datos obligatorios");
  }

  connection.query(
    `
    SELECT Id_turno 
    FROM turno
    WHERE Estado = 'ABIERTO'
      AND Id_usuario = ?
      AND Id_caja = ?
    LIMIT 1
    `,
    [Id_usuario, Id_caja],
    (error, results) => {
      if (error) return serverError(res, error, "verificar turno existente");

      if (results.length > 0) {
        return badRequest(res, "Ya existe un turno abierto para esta caja");
      }

      const turnoData = {
        FechaIngreso: FechaIngreso || new Date(),
        FondoCaja: safeNumber(FondoCaja),
        Efectivo: 0,
        Cigarrillos: 0,
        Transferencia: 0,
        Debito: 0,
        Credito: 0,
        Mixto: 0,
        Egreso: 0,
        Ingreso: 0,
        TotalEnCaja: safeNumber(FondoCaja),
        Id_sucursal,
        Id_usuario,
        Id_caja,
        Estado: "ABIERTO",
      };

      connection.query(
        "INSERT INTO turno SET ?",
        turnoData,
        (error, results) => {
          if (error) return serverError(res, error, "abrirTurno");

          res.json({
            ok: true,
            IdTurno: results.insertId,
          });
        }
      );
    }
  );
};

/* =========================
   FINALIZAR TURNO
========================= */

const finalizarTurno = (req, res) => {
  const {
    IdTurno,
    Efectivo,
    Cigarrillos,
    Transferencia,
    Credito,
    Debito,
    Mixto,
    Egreso,
    Ingreso,
    TotalEnCaja,
  } = req.body;

  console.log("Datos recibidos:", req.body);

  const turnoId = Number(IdTurno);

  if (!turnoId) {
    return badRequest(res, "IdTurno inválido");
  }

  connection.query(
    `SELECT Estado FROM turno WHERE Id_turno = ? LIMIT 1`,
    [turnoId],
    (error, results) => {
      if (error) return serverError(res, error, "verificar turno");

      if (!results.length) {
        return badRequest(res, "El turno no existe");
      }

      console.log("Estado en DB:", results[0].Estado);

      if (results[0].Estado !== "ABIERTO") {
        return badRequest(res, "El turno ya está cerrado");
      }

      connection.query(
        `
        UPDATE turno SET 
          FechaSalida = CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-03:00'),
          Efectivo = ?,
          Cigarrillos = ?,
          Transferencia = ?,
          Credito = ?,
          Debito = ?,
          Mixto = ?,
          Egreso = ?,
          Ingreso = ?,
          TotalEnCaja = ?,
          Estado = 'CERRADO'
        WHERE Id_turno = ?
        `,
        [
          safeNumber(Efectivo),
          safeNumber(Cigarrillos),
          safeNumber(Transferencia),
          safeNumber(Credito),
          safeNumber(Debito),
          safeNumber(Mixto),
          safeNumber(Egreso),
          safeNumber(Ingreso),
          safeNumber(TotalEnCaja),
          turnoId,
        ],
        (error, updateResult) => {
          if (error) return serverError(res, error, "finalizarTurno");

          console.log("UPDATE resultado:", updateResult);

          if (updateResult.affectedRows === 0) {
            return badRequest(res, "No se pudo cerrar el turno");
          }

          res.json({
            ok: true,
            message: "Turno cerrado correctamente",
          });
        }
      );
    }
  );
};
/* =========================
   TURNO ACTIVO
========================= */

const turnoActivo = (req, res) => {
  const { id_usuario, id_caja } = req.params;

  if (!id_usuario || !id_caja) {
    return badRequest(res, "Parámetros inválidos");
  }

  connection.query(
    `
    SELECT *
    FROM turno
    WHERE Estado = 'ABIERTO'
      AND Id_usuario = ?
      AND Id_caja = ?
    ORDER BY FechaIngreso DESC
    LIMIT 1
    `,
    [id_usuario, id_caja],
    (error, results) => {
      if (error) return serverError(res, error, "turnoActivo");

      res.json({
        ok: true,
        data: results[0] || null,
      });
    }
  );
};

module.exports = {
  verTurnos,
  abrirTurno,
  finalizarTurno,
  turnoActivo,
};