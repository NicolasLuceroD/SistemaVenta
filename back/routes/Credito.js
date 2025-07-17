const {Router} = require('express')
const router= Router()

const {
    verElCreditoCompleto, 
    estadoCreditoVenta,
    RestarCredito,
    CreditoACuenta,
    pagosClientes,
    movimientoClientes,
    pagocorrelativaCliente,
    restarTotalApagar,
    verMovimientosCliente,


    pagocorrelativaProveedor,
    pagosProveedores,
    movimientoProveedores,
    aumentarDeudaProveedor,
    verElCreditoCompletoProveedor,
    verMovimientosProveedor,
    restarTotalApagarProveedores,
    restarDeudaProveedor,
    cancelarMovimiento,
    verDetalleVentaEnCredito
} = require('../controllers/Credito')

router.get('/:Id_cliente', verElCreditoCompleto)
router.put('/estadoCredito/:Id_venta', estadoCreditoVenta)
router.put('/restarCredito', RestarCredito)
router.put('/aCuenta', CreditoACuenta)

router.post('/pagosClientes', pagosClientes)
router.post('/movimientoClientes', movimientoClientes)
router.get('/pagocorrelativa', pagocorrelativaCliente)
router.get('/verMovimientosCliente/:Id_cliente', verMovimientosCliente)
router.put('/RestarTotalAPagar', restarTotalApagar)

router.put('/aumentarDeudaProveedor', aumentarDeudaProveedor)
router.post('/pagosProveedores', pagosProveedores)
router.post('/movimientoProveedores', movimientoProveedores)
router.get('/pagocorrelativaProveedor', pagocorrelativaProveedor)
router.get('/verMovimientosProveedor/:Id_proveedor', verMovimientosProveedor)
router.put('/restarTotalApagarProveedores', restarTotalApagarProveedores)
router.get('/verElCreditoCompletoProveedor/:Id_proveedor', verElCreditoCompletoProveedor)
router.put('/restarDeudaProveedor', restarDeudaProveedor)
router.put('/cancelarmovimiento',cancelarMovimiento)
router.get('/verDetalleVentaEnCredito/:idMovimiento',verDetalleVentaEnCredito)


module.exports = router