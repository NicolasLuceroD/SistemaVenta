const {Router} = require('express')
const router = Router()


const {verPlataCaja, IngresarPlata,verUltimoIngreso,verCantidadTotal,
    verificarCajaAbierta,cerrarCaja
} = require("../controllers/plataCaja")


router.get("/:Id_sucursal/:fechaSeleccionada", verPlataCaja)

router.post("/verificarCajaAbierta", verificarCajaAbierta)
router.post("/post",IngresarPlata)
router.get("/plataCajaIngreso",verUltimoIngreso)
router.get("/plataLogin/:Id_usuario/:Id_caja",verCantidadTotal)

router.put("/cerrarCaja",cerrarCaja)


module.exports = router