const { connection } = require("../database/config");

const login = (req, res) => {
    const nombre_sucursal = req.body.nombre_sucursal;
    const clave = req.body.clave;  
    connection.query(
        "SELECT id_sucursal FROM sucursales WHERE nombre_sucursal = ? AND clave = ?",
        [nombre_sucursal, clave],
        (error, result) => {
            if (error) {
                console.error("Error al ejecutar la consulta SQL:", error);
                res.status(500).send("Error interno del servidor");
            } else {
                if (result.length > 0) {
                    res.status(200).send({ sucursalId: result[0].id_sucursal });
                } else {
                    res.status(400).send('Nombre de sucursal y/o contraseña incorrecta');
                }
            }
        }
    );
};

const loginUsuario = (req, res) => { 
    const nombre_usuario = req.body.nombre_usuario;
    const clave_usuario = req.body.clave_usuario;
    const Id_sucursal = req.body.Id_sucursal;

    connection.query(
        "SELECT id_usuario, rol_usuario FROM usuarios WHERE nombre_usuario = ? AND clave_usuario = ? AND Id_sucursal = ?",
        [nombre_usuario, clave_usuario, Id_sucursal],
        (error, results) => {
            if (error) {
                console.error("Error al ejecutar la consulta SQL:", error);
                res.status(500).send("Error interno del servidor");
            } else {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = nombre_usuario;
                    res.status(200).send({
                        idUsuario: results[0].id_usuario,
                        rol_usuario: results[0].rol_usuario,
                        nombre_usuario: results[0].nombre_usuario
                    });
                } else {
                    res.status(400).send('nombre de usuario y/o contraseña incorrecta');
                }
            }
        }
    );
};


module.exports = { login, loginUsuario };
