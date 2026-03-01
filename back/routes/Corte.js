const { Router } = require('express')
const router = Router()

const { generarCorte } = require("../controllers/Corte")

router.post("/generar", generarCorte)

module.exports = router