const { connection } = require('../database/config');

const crearCancelacion = (req, res) => {
  const { motivo_cancelacion, Id_compra, Id_usuario } = req.body;
  
  connection.query('INSERT INTO cancelaciones SET ?', {
    motivo_cancelacion,
    Id_compra,
    Id_usuario
  }, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};

module.exports = { crearCancelacion };
