const {Router} = require('express')
const router = Router()


const {verPlataCaja, IngresarPlata,verUltimoIngreso,verCantidadTotal,
    verificarCajaAbierta,cerrarCaja,verMetodosPagos
} = require("../controllers/plataCaja")


router.get("/:Id_sucursal/:fechaSeleccionada", verPlataCaja)

router.post("/verificarCajaAbierta", verificarCajaAbierta)
router.post("/post",IngresarPlata)
router.get("/plataCajaIngreso",verUltimoIngreso)
router.get("/plataLogin/:Id_usuario/:Id_caja",verCantidadTotal)

router.put("/cerrarCaja",cerrarCaja)

router.get("/verMetodosPagos/:Id_caja/:Id_usuario",verMetodosPagos)


module.exports = router