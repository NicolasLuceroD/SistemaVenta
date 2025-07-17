const {Router} = require('express')
const router = Router()


const {stockConInvBajo,verStock,verStock2,verStock1,crearStock,editarStock, correlativaProduc,validarStock} = require('../controllers/Stock')

router.get("/:Id_producto/:Id_sucursal",verStock)
router.get("/sucursal1", verStock1)
router.get("/sucursal2", verStock2)
router.get("/ultimoProducto", correlativaProduc)
router.get("/invBajo",stockConInvBajo)
router.get("/validarstock/:Id_producto/:Id_sucursal", validarStock)

router.post("/post", crearStock)
router.put("/put/:Id_stock",editarStock)


module.exports= router