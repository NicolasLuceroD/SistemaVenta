/* eslint-disable no-undef */
const {Router} = require('express')
const router = Router()


const {desactivarPaquete,editarDetallePaquete, descCantidadPaquete,verPaqueteCompleto,ultimoPaquete,CrearDetallePaquete,verPaquete,crearPaquete,editarPaquete} = require("../controllers/Paquete")

router.get("/",verPaquete)
router.get("/paqueteCompleto", verPaqueteCompleto)
router.post("/post", crearPaquete)
router.post("/detallePaquete/post",CrearDetallePaquete )
router.get("/verIdPaquete",ultimoPaquete )
router.put("/put/:Id_paquete",editarPaquete)
router.put("/put/detallePaquete/:Id_detallePaquete",editarDetallePaquete)
router.put("/editar/descPaquete",descCantidadPaquete )
router.put("/put/eliminar/:Id_paquete",desactivarPaquete)

module.exports = router