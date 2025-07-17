
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */


import  { useState } from 'react';
import App from '../App';
import { Link } from 'react-router-dom';

export default function Productos() {
  const [mostrarModificar, setMostrarModificar] = useState(true);
  const rolUsuario = localStorage.getItem("rolUsuario");



  return (
    <>
    <App/>

    <div className='h3-ventas'>
      <h1>PRODUCTOS</h1>
    </div>
    <section className='container-fluid-custom'>
      <div className='row'>
        <div className='col-xl'>
          <div className="productos-container">
            <div className="custom-links">
              <Link to="/nuevoProducto" style={{ color: 'white' }}>NUEVO</Link>
              <Link to="/editarProducto" style={{ color: 'white' }}>MODIFICAR</Link>
              <Link to="/departamentos" style={{ color: 'white' }}>FAMILIAS</Link>
              <Link to="/inventario" style={{ color: 'white' }}>INVENTARIO</Link>
              <Link to="/paquete" style={{ color: 'white' }}>PAQUETES</Link>
              <Link to="/importar" style={{ color: 'white' }}>IMPORTAR</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
)
}