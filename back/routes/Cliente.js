const {Router} = require('express')
const router= Router()

const {verClientes,crearCliente,editarCliente,eliminarCliente} = require('../controllers/Clientes')



router.get('/:sucursalId', verClientes)
router.post('/crear', crearCliente)
router.put('/put/:Id_cliente', editarCliente)
router.put('/delete/:Id_cliente', eliminarCliente)


module.exports = router