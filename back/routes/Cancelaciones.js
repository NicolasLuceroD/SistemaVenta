const {Router} = require('express')
const router = Router()

const {crearCancelacion} = require('../controllers/Cancelaciones')

router.post("/post",crearCancelacion)

module.exports = router