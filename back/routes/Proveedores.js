const {Router} = require('express')
const router = Router()


const  {verProveedores, crearProveedores,eliminarProveedor,editarProveedores} = require("../controllers/Proveedor")

router.get("/",verProveedores)
router.post("/post",crearProveedores)
router.put("/put/:Id_proveedor",editarProveedores)
router.put("/delete/:Id_proveedor", eliminarProveedor)

module.exports = router