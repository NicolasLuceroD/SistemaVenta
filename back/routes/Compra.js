const {Router} = require('express')
const router = Router()


const {verCompraConFecha, crearCompra, editarCompra,verTotalSaldo, verCompraCorte,verComprasTotales,verComprasPendientes,verComprasPagadas,verComprasNoPagadas,verMontoComprasPagadas,verMontoComprasNoPagadas, eliminarCompra, verComprasCanceladas, verComprasAnuladas, verPagosProveedores} = require('../controllers/Compra')


router.get("/vercompras/:fechaSeleccionada/:sucursalId",verCompraConFecha)
router.get("/versaldo/:fechaSeleccionada/:sucursalId", verTotalSaldo)
router.get("/vercortecompra/:fecha/:sucursalId",verCompraCorte)
router.get("/vercomprasanuladas/:idCompra", verComprasAnuladas)
router.post("/post", crearCompra)
router.put("/put/:Id_compra",editarCompra)
router.put("/delete/:Id_compra",eliminarCompra)
router.get("/verpagosproveedores/:idCompra", verPagosProveedores)


/*GETS PARA H6*/
router.get("/verComprasTotales/:sucursalId", verComprasTotales);
router.get("/verComprasCanceladas/:sucursalId", verComprasCanceladas);
router.get("/verComprasPendientes/:sucursalId", verComprasPendientes);
router.get("/verComprasPagadas/:sucursalId", verComprasPagadas);
router.get("/verComprasNoPagadas/:sucursalId", verComprasNoPagadas);
router.get("/verMontoComprasPagadas/:sucursalId", verMontoComprasPagadas);
router.get("/verMontoComprasNoPagadas/:sucursalId", verMontoComprasNoPagadas);



module.exports = router