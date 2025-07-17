/* eslint-disable no-undef */
const {connection} = require('../database/config')



const verSucursales = (req, res) => {
    connection.query("SELECT * FROM sucursales", (error, results) => {
      if (error) {
        console.error("Error al consultar las sucursales:", error);
        res.status(500).json([]);
        return;
      }
      console.log("Resultados obtenidos:", results);
      res.json(results || []); 
    });
  };
  


module.exports = {verSucursales}













