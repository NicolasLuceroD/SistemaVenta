const { Router } = require('express');
const router = Router();

const { verDetalleVenta, crearDetalleVenta, eliminarDetalleVenta,ultimoDetalle } = require('../controllers/DetalleVenta');

router.get("/", verDetalleVenta);
router.get("/ultimoDetalle/:Id_sucursal/:fechaSeleccionada", ultimoDetalle)
router.post("/crear", crearDetalleVenta); 
router.delete("/delete/:Id_venta", eliminarDetalleVenta);


module.exports = router;
