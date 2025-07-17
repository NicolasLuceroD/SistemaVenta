const {Router} = require('express')
const router = Router()


const { VerPlataLoginConUsuario, VerPlataLogin, registrarPlataLogin,verPlataCajaLogin} = require('../controllers/LoginPlata')


router.get("/", VerPlataLogin)
router.get("/:Id_usuario/:Id_caja/:fechaSeleccionada", VerPlataLoginConUsuario)
router.get("/:Id_sucursal/:fechaSeleccionada",verPlataCajaLogin)
router.post("/post", registrarPlataLogin)




module.exports = router
