const { Router } = require('express');
const router = Router();

const { login, loginUsuario } = require("../controllers/Login");

router.post("/post", login); 

router.post("/usu/post", loginUsuario)


module.exports = router;
