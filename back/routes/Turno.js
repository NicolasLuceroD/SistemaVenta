const {Router} = require('express')
const router = Router()


const {verTurnos,abrirTurno,finalizarTurno,turnoActivo} = require("../controllers/Turno")


router.get("/verTurnos",verTurnos)
router.get("/turnoActivo/:id_usuario/:id_caja",turnoActivo)
router.post("/abrirTurno",abrirTurno)
router.put("/finalizarTurno",finalizarTurno)


module.exports = router