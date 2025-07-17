const {Router} = require('express')
const router  = Router()


const {verIngreso,verEgreso,registrarIngreso,
    registrarEgreso,retistrarMotivosEgresos,
    verMotivosEgresos,eliminarMotivosEgresos,editarMotivosEgresos} = require('../controllers/Movimientos')


router.get("/ingreso", verIngreso)
router.get("/egreso",verEgreso)

router.post("/ingreso/post", registrarIngreso)
router.post("/egreso/post", registrarEgreso)

router.post("/retistrarMotivosEgresos/post", retistrarMotivosEgresos)
router.get("/verMotivosEgresos", verMotivosEgresos)
router.put("/eliminarMotivosEgresos/:IdMotivoEgreso", eliminarMotivosEgresos)
router.put("/editarMotivosEgresos", editarMotivosEgresos)


module.exports = router