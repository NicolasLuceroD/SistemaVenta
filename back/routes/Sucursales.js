/* eslint-disable no-undef */
const {Router} = require('express')
const router = Router()


const {verSucursales} = require('../controllers/Sucursales')


router.get("/",verSucursales)


module.exports = router