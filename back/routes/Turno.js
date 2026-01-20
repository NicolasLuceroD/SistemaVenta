const {Router} = require('express')
const router = Router()


const {verTurnos,abrirTurno,finalizarTurno} = require("../controllers/Turno")


router.get("/verTurnos",verTurnos)
router.post("/abrirTurno",abrirTurno)
router.put("/finalizarTurno",finalizarTurno)


module.exports = router