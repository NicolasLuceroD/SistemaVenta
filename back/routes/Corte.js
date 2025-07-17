const { Router } = require('express');
const router = Router();


const {verEmpleadoConVentaXMES, verPlataLoginConUsuario,importeVentaTotalXUsuario, 
    verEgresoEfectivoConUsuario,verEntradaEfectivoConUsuario,ventaTotalconUsuario,
    ventaTotal,ventaxCliente,ventaxCategoria,ventatotalxCategoria, verEmpleadoConVenta,
    verVentaXMes, importeVentaTotal, verGanancia, GananciaXdepartamento, verEntradaEfectivo, 
    verEgresoEfectivo, ventaTotalxMES, ventaxCategoriaxMES, ventatotalxCategoriaxMES, 
    ventatotalxClientexMES, verGananciaXUsuario,ventaxCategoriaUsuarios,ventatotalxPaquetes,
    verGananciaPaquetes, ventatotalxPaquetesXUsuarios, verGananciaPaquetesXUsuario,
    verPagosCreditos,verProductosEliminados



} = require('../controllers/Corte')

//GET DE GRAFICOS
router.get("/verProductosEliminados/:fechaSeleccionada", verProductosEliminados)
router.get("/verPagosCreditos/:fechaSeleccionada", verPagosCreditos)
router.get("/ventatotal", ventaTotal)
router.get("/ventatotal/:fechaSeleccionada/:Id_sucursal/:Id_usuario/:Id_caja", ventaTotalconUsuario)
router.get("/veringresoefectivo/:Id_usuario/:fechaSeleccionada/:Id_caja", verEntradaEfectivoConUsuario)
router.get("/veregresoefectivo/:Id_usuario/:fechaSeleccionada/:Id_caja", verEgresoEfectivoConUsuario)
router.get("/ventaxcategoria", ventaxCategoria)
router.get("/ventaxCategoriaUsuarios", ventaxCategoriaUsuarios)
router.get("/ventaxcliente", ventaxCliente)
router.get("/verGananciaPaquetesXUsuario", verGananciaPaquetesXUsuario)
router.get("/ventatotalxPaquetesXUsuarios", ventatotalxPaquetesXUsuarios)
router.get("/ventatotalxcategoria", ventatotalxCategoria)
router.get("/verempleadoxventa/:fechaSeleccionada/:Id_sucursal", verEmpleadoConVenta)
router.get("/ventaxmes" , verVentaXMes)
router.get("/verganancia", verGanancia)
router.get("/verGananciaPaquetes", verGananciaPaquetes)
router.get("/gananciaUsuario", verGananciaXUsuario)
router.get("/vergananciaxdep", GananciaXdepartamento)
router.get("/veringresoefectivo", verEntradaEfectivo)
router.get("/veregresoefectivo", verEgresoEfectivo)
router.get("/ventatotalxMES", ventaTotalxMES)
router.get("/ventaxcategoriaxMES", ventaxCategoriaxMES)
router.get("/ventatotalxcategoriaxMES", ventatotalxCategoriaxMES)
router.get("/ventaxclientexMES", ventatotalxClientexMES)
router.get('/ventaxempleadoxMES/:Id_sucursal', verEmpleadoConVentaXMES);

router.get('/ventatotalxPaquetes', ventatotalxPaquetes);

//COMPONENTE CORTE
router.get("/importeventatotal", importeVentaTotal)
router.get("/importeventatotalUsuario/:fechaSeleccionada/:Id_usuario", importeVentaTotalXUsuario)


router.get("/plataloginconusuario/:fechaSeleccionada/:Id_usuario",verPlataLoginConUsuario)

module.exports = router;