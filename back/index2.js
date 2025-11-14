/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 9005;

// ---------- HTTPS credentials (ANTES de usarlas) ----------
const keyFile  = '/etc/letsencrypt/live/juanakiosco.com.ar-0001/privkey.pem';
const certFile = '/etc/letsencrypt/live/juanakiosco.com.ar-0001/fullchain.pem'; // <- fullchain

const privateKey  = fs.readFileSync(keyFile, 'utf8');
const certificate = fs.readFileSync(certFile, 'utf8');
// Si quisieras, también podrías cargar chain.pem aparte:
// const ca = fs.readFileSync('/etc/letsencrypt/live/juanakiosco.com.ar/chain.pem', 'utf8');
// const credentials = { key: privateKey, cert: certificate, ca };
const credentials = { key: privateKey, cert: certificate };

// ---------- Middlewares ----------
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Detrás de proxy (Apache) para que secure cookies/X-Forwarded-* funcionen bien
app.set('trust proxy', 1);

// ---------- Sequelize ----------
const sequelize = new Sequelize('juanakiosco', 'lucho', 'ServidorAlPalo2024#', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
});

// ---------- Sesión ----------
const store = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: store
}));

// ---------- Rutas ----------
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
const Reportes = require('./routes/Reportes');
const Cancelaciones = require('./routes/Cancelaciones');
const AuditoriaCompra = require('./routes/AuditoriaCompra');

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
app.use('/api/reportes', Reportes);
app.use('/api/cancelaciones', Cancelaciones);
app.use('/api/auditoria', AuditoriaCompra);

// Healthcheck
app.get('/', (req, res) => {
  res.send('Servidor activo');
});

// ---------- Boot ----------
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a la base de datos.');
    return store.sync();
  })
  .then(() => {
    https.createServer(credentials, app).listen(port, '0.0.0.0', () => {
      console.log(`Corriendo en el puerto ${port} con HTTPS`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
