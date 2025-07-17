const {Router} = require('express')
const router = Router()


const {verComprasCanceladas, verDetalleCompraCancelada, verMontoTotalesCompras, verCuentasAPagar,verdetalleCuentasAPagar, verSaldoSanMartin, verSaldoAvellaneda, verCuentasPagadas, verTotalCuentasPagadas} = require('../controllers/AuditoriaCompra')

/*GETS PARA COMPRAS CANCELADAS*/
router.get('/verComprasCanceladas',verComprasCanceladas)
router.get('/verDetalleCompraCancelada', verDetalleCompraCancelada)
router.get('/verMontosTotalesCompras', verMontoTotalesCompras)

/*GETS PARA CUENTAS A PAGAR*/
router.get('/verCuentasAPagar', verCuentasAPagar)
router.get('/verdetalleCuentasAPagar', verdetalleCuentasAPagar)

/*GETS PARA SALDOS AV Y SM*/
router.get('/verSaldoAvellaneda', verSaldoAvellaneda)
router.get('/verSaldoSanMartin', verSaldoSanMartin)

/*GETS PARA CUENTAS PAGADAS*/
router.get('/verCuentasPagadas', verCuentasPagadas)
router.get('/verTotalCuentasPagadas', verTotalCuentasPagadas)

module.exports = router