const {Router} = require('express')
const router = Router()

const {verMetodoPago,crear,editar,eliminar} = require('../controllers/MetodoPago')

router.get('/', verMetodoPago)
router.post('/post', crear)
router.put('/put/:Id_metodoPago', editar)
router.delete('/delete/:Id_metodoPago', eliminar)


module.exports = router