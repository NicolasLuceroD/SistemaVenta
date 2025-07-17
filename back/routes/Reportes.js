const Router = require('express')
const router = Router()

const {ventaxDepartamento, ventaMetodoPago,ventatotalxDepto,ventaClientes, 
    ventaEmpleados,ventaTotales,numeroVentas,gananciasventas,
    margenutilidadpromedio,ventaspromedio,gananciasventasXPaquete

} = require('../controllers/Reportes')

router.get('/ventaxdepartamento',ventaxDepartamento)
router.get('/ventaxmetodopago', ventaMetodoPago)
router.get('/ventamontoxdepto', ventatotalxDepto)
router.get('/ventaclientes', ventaClientes)
router.get('/ventaempleados', ventaEmpleados)
router.get('/ventatotal', ventaTotales)
router.get('/numeroventas',numeroVentas)
router.get('/ganancias', gananciasventas)
router.get('/ventaspromedio', ventaspromedio)
router.get('/utilidadpromedio', margenutilidadpromedio)
router.get('/gananciasventasXPaquete', gananciasventasXPaquete)



module.exports = router