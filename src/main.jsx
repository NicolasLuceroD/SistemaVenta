/* eslint-disable no-undef */
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {departamentos, compra, reportes, corte2,cliente, productos, configuracion, nuevoProducto, editarProducto, eliminarProducto, app, importar, corteC, loginUsuario, usuarios, metodoPago, credito, testVenta, plataEnCaja, corte, inventario, paquete, stock, creditoproveedores, auditoriacompra, gestionMesas} from './routes/routes.js'
import Clientes from './components/Clientes.jsx'
import Compra from './components/Compras.jsx'
import Productos from './components/Productos.jsx'
import Configuracion from "./components/Configuracion.jsx"
import NuevoProduct from "./CrudProductos/NuevoProduct.jsx"
import Eliminar from "./CrudProductos/Eliminar.jsx"
import Editar from "./CrudProductos/Editar.jsx"
import Departamentos from "./CrudProductos/Departamento/Departamento.jsx"
import { CarritoProvider } from './context/CarritoProvider.jsx'
import DataProvider from './context/DataProvider.jsx'
import Login from './components/Login.jsx'
import Importar from './CrudProductos/Importar.jsx'
import CorteCompra from './components/CorteCompra.jsx'
import LoginUsuario from './components/LoginUsuario.jsx'
import Usuarios from './components/Usuarios.jsx'
import MetodoDePago from './components/MetodoDePago.jsx'
import Creditos from './components/Credito.jsx'
import TestVenta from './components/TestVenta.jsx'
import PlataCaja from './components/PlataCaja.jsx'
import { VentaProvider } from './context/VentaProvider.jsx'
import Corte2 from './components/Corte2.jsx'
import Reportes from './components/Reportes.jsx'
import Corte from './components/Corte.jsx'
import Stock from './components/Stock.jsx'
import Inventario from './CrudProductos/Inventario.jsx'
import Paquete from './CrudProductos/Paquete.jsx'
import CreditoProveedores from './components/CreditoProveedores.jsx'
import AuditoriaCompra from './components/AuditoriaCompra.jsx'
import GestionMesas from './components/GestionMesas.jsx'





ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
  
    <BrowserRouter>
   

    
      <DataProvider>
        <CarritoProvider>
          <VentaProvider>
            <Routes>
              
                <Route path={app} element={<App/>}/>  
                <Route path="/" element={<Login/>}/>
                <Route path={compra} element={<Compra/>}/>
                <Route path={cliente} element={<Clientes/>}/>
                {/* <Route path={corteV} element={<Corte/>}/> */}
                <Route path={corteC} element={<CorteCompra/>}/>
                <Route path={configuracion} element={<Configuracion/>}/>
                <Route path={loginUsuario} element={<LoginUsuario/>}/>
                <Route path={usuarios} element={<Usuarios/>}/>
                <Route path={metodoPago} element={<MetodoDePago/>}/>
                <Route path={credito} element={<Creditos/>}/>
                <Route path={testVenta} element={<TestVenta/>}/>
                <Route path={plataEnCaja} element={<PlataCaja/>}/>
                <Route path={corte2} element={<Corte2/>}/>
                <Route path={reportes} element={<Reportes/>}/>
                <Route path={corte} element={<Corte/>}/>
                <Route path={inventario} element={<Inventario/>}/>
                <Route path={paquete} element={<Paquete/>}/>
                <Route path={creditoproveedores} element={<CreditoProveedores/>}/>
                <Route path={auditoriacompra} element={<AuditoriaCompra/>}/>
                {/* PRODUCTOS */}
                <Route path={productos} element={<Productos/>}/>
                <Route path={nuevoProducto} element={<NuevoProduct/>}/>
                <Route path={editarProducto} element={<Editar/>}/>
                <Route path={eliminarProducto} element={<Eliminar/>}/>
                <Route path={departamentos} element={<Departamentos/>}/>
                <Route path={importar} element={<Importar/>}/>
                <Route path={stock} element={<Stock/>}/>
                <Route path={gestionMesas} element={<GestionMesas/>}/>

              </Routes>
            </VentaProvider>  
          </CarritoProvider>
      </DataProvider>
  
    </BrowserRouter>
   
  //</React.StrictMode>,
)
