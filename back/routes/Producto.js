/* eslint-disable no-undef */
const {Router}=require('express')
const router= Router()

const {crearProducs,verProductosYPromos,productoVencimiento,catalogo,modificarPrecioProducto,productoPorCategoria, verProductos,crearProductos,editarProductos,eliminarProductos,ProductoList,verPlataEnStock}=require('../controllers/Productos')


router.get('/', verProductos)
router.get('/:Id_categoria', productoPorCategoria)
router.get('/verPlataStock',verPlataEnStock)
router.get('/nombre_producto', ProductoList)
router.get('/ver/catalogo',catalogo)
router.get("/ver/vencimineto",productoVencimiento)
router.get("/harto/productosCompletos",verProductosYPromos)

router.put('/put/preciosXCategoria/:Id_categoria',modificarPrecioProducto)
router.put('/put/:Id_producto',editarProductos)

router.post('/post',crearProductos)
router.post('/post/producs',crearProducs)

router.put('/delete/:Id_producto', eliminarProductos)





module.exports= router