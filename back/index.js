/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
const port = 2201;

app.use(express.json());
app.use(cors({
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Habilita las solicitudes preflight

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize('dbjuanakiosco', 'root', 'Lola2201', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306,
});

const store = new SequelizeStore({
    db: sequelize
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: store
}));

const Productos = require('./routes/Producto');
const Categoria = require('./routes/Categoria');
const Cliente = require('./routes/Cliente');
const DetalleVenta = require('./routes/DetalleVenta');
const Venta = require('./routes/Venta');
const MetodoPago = require('./routes/MetodoPago');
const Login = require('./routes/Login');
const Proveedor = require('./routes/Proveedores');
const Compra = require('./routes/Compra');
const Sucursales = require('./routes/Sucursales');
const Usuarios = require('./routes/Usuarios');
const Stock = require('./routes/Stock');
const Creditos = require('./routes/Credito');
const PlataEnCaja = require('./routes/plataEnCaja');
const PlataLogin = require('./routes/PlataLogin');
const Movimientos = require('./routes/Movimientos');
const Caja = require('./routes/Caja');
const Corte = require('./routes/Corte');
const Paquete = require('./routes/Paquete');
const Reportes = require("./routes/Reportes")
const Cancelaciones = require("./routes/Cancelaciones")
const AuditoriaCompra = require("./routes/AuditoriaCompra")



app.use('/api/productos', Productos);
app.use('/api/categorias', Categoria);
app.use('/api/clientes', Cliente);
app.use('/api/detalleVenta', DetalleVenta);
app.use('/api/ventas', Venta);
app.use('/api/metodoPago', MetodoPago);
app.use('/api/login', Login);
app.use('/api/proveedores', Proveedor);
app.use('/api/compras', Compra);
app.use('/api/sucursales', Sucursales);
app.use('/api/usuarios', Usuarios);
app.use('/api/stock', Stock);
app.use('/api/creditos', Creditos);
app.use('/api/plataCaja', PlataEnCaja);
app.use('/api/plataLogin', PlataLogin);
app.use('/api/movimientos', Movimientos);
app.use('/api/caja', Caja);
app.use('/api/corte', Corte);
app.use('/api/paquete', Paquete);
app.use('/api/reportes',Reportes)
app.use('/api/cancelaciones',Cancelaciones)
app.use('/api/auditoria',AuditoriaCompra)


app.get("/", (req, res) => {
    console.log('servidor activo');
    res.send('Servidor activo');
});

sequelize.authenticate()
    .then(() => {
        console.log('Conectado a la base de datos.');
        store.sync().then(() => {
            app.listen(port, '0.0.0.0', () => {
                console.log(`Server listening at 172.31.81.29:${port}`);
            });
        });
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });
