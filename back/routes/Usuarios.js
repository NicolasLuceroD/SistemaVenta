const Router = require('express')
const router = Router()

const {verUsuarios,editarUsuarios,crearUsuarios, eliminarUsuarios} = require("../controllers/Usuarios")


router.get("/sucursal/:Id_sucursal",verUsuarios)
router.post("/post",crearUsuarios)
router.put("/put/:Id_usuario",editarUsuarios)
router.put("/delete/:Id_usuario",eliminarUsuarios)


module.exports = router