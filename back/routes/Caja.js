const {Router} = require('express')
const router = Router()


const { verCaja, loginCaja } = require('../controllers/Caja')

router.get("/:Id_sucursal", verCaja)

router.post("/post",loginCaja)


module.exports = router