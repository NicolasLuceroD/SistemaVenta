const { Router } = require('express');
const router = Router();

const {verVentasEliminadas, ventasEliminadas, verificadorPrecio,estadoVenta, 
    verVenta, crearVenta, eliminarVenta,correlativa,
     verLaVentaCompleta,descCantidad, AumentarCredito,aumentarCantidad ,
     EliminarProductoVenta,verVentaSeleccionada,actualizarPrecioVenta,
     guardarProductoEliminado
    } = require('../controllers/Venta');

router.get("/verVentaSeleccionada/:Id_venta", verVentaSeleccionada);
router.get("/", verVenta);
router.get("/precioProducto/:codProducto/:nombre_producto",verificadorPrecio)
router.get("/ventacorrelativa",correlativa)
router.get("/sucursal/:Id_sucursal", verLaVentaCompleta)
router.put("/aumentarCredito", AumentarCredito)
router.put("/descStock",descCantidad )
router.put("/aumentarCantidad", aumentarCantidad)
router.put("/estadoVenta/:Id_venta", estadoVenta)
router.post("/crear", crearVenta); 
router.delete("/delete/:Id_venta", eliminarVenta);
router.delete("/EliminarProductoVenta/:Id_detalleventa", EliminarProductoVenta);
router.get("/verVentasEliminidas", verVentasEliminadas);
router.post("/guardarVentaEliminada", ventasEliminadas); 

router.post("/guardarProductoEliminado", guardarProductoEliminado); 

router.put("/actualizarPrecioVenta", actualizarPrecioVenta); 


module.exports = router;
