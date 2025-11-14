/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import App from '../App';
import * as XLSX from 'xlsx';
import '../index.css';
import Pagination from "react-bootstrap/Pagination";
import { DataContext } from '../context/DataContext.jsx';
import Paginacion from './Paginacion.jsx';


export const Corte = ({ filename, sheetname }) => {


  const [buscar, setBuscar] = useState("");
  const [resultado, setResultado] = useState([]);
  const [sumaTotal, setSumaTotal] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [datosOriginales, setDatosOriginales] = useState([]);

  const {  URL } = useContext(DataContext);

  const buscador = (e) => {
    const textoBuscado = e.target.value.toLowerCase();
    setBuscar(textoBuscado);
    let resultadoFiltrado = [];
    let total = 0;
  
    if (!textoBuscado) {
      resultadoFiltrado = [...datosOriginales];
    } else {
      resultadoFiltrado = datosOriginales.filter((dato) => {
        const fechaRegistroStr = new Date(dato.fecha_registro).toLocaleString().toLowerCase();
        const nombreEmpleado = dato.usuarios.nombre_usuario.toLowerCase(); 
        return fechaRegistroStr.includes(textoBuscado) || nombreEmpleado.includes(textoBuscado);
      });
    }
  
    if (resultadoFiltrado.length > 0) {
      total = resultadoFiltrado.reduce((acumulador, valorActual) => {
        const precioTotal = parseFloat(valorActual.precioTotal_venta);
        return acumulador + (isNaN(precioTotal) ? 0 : precioTotal);
      }, 0);
    }
  
    setSumaTotal(total);
    setResultado(resultadoFiltrado);
  };
  

  const verUsuarios = () => {
    axios.get(`${URL}usuarios/sucursal/${id_sucursal}`)
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.log('Error al obtener los usuarios:', error);
      });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(resultado);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const id_sucursal = localStorage.getItem('sucursalId');

  useEffect(() => {
    axios.get(`${URL}ventas/sucursal/${id_sucursal}`)
      .then((response) => {
        setResultado(response.data);
        setDatosOriginales(response.data);
        setTotal(response.data.length)
      })
      .catch((error) => {
        console.log('Error al obtener los datos:', error);
      });
  }, [id_sucursal]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const totalPaginas = Math.ceil(resultado.length / elementosPorPagina);
  let items = [];
  const mostrarPaginacion = resultado.length > elementosPorPagina;

  for (let number = 1; number <= totalPaginas; number++) {
    items.push(
      mostrarPaginacion && (
        <Pagination.Item
          key={number}
          active={number === paginaActual}
          onClick={() => setPaginaActual(number)}
        >
          {number}
        </Pagination.Item>
      )
    );
  }

  const inicio = (paginaActual - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const resultadosPaginados = resultado.slice(inicio, fin);



  const nombreSuc = localStorage.getItem("nombreSucursal")

  const sortedResultados = resultado.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
//PAGINACION NUEVA
const productosPorPagina = 10
const [actualPagina,setActualPagina] = useState(1)
const [total, setTotal]=useState(0)
const ultimoIndex = actualPagina * productosPorPagina;
const primerIndex = ultimoIndex - productosPorPagina;




  // FUNCION PARA PASAR A PESOS ARG
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };



useEffect(() => {
  verUsuarios();
}, []);

  return (
    <>
      <App />

      <div className='h3-ventas'>
        <h1>DETALLE DE VENTAS</h1>
      </div>

      <br />
      <h2><strong>REPORTE DE LAS VENTAS</strong></h2>
      <h4>Ventas completas junto a sus detalles de venta</h4>
      <h5>Sucursal: {nombreSuc}</h5>
      <br /><br />

        <div className='container'>
          <input value={buscar} onChange={buscador} type="text" placeholder='Busca una venta...' className='form-control' />
          <div style={{marginTop: '10px'}}><h4>SUMA TOTAL DE VENTAS: <strong>{formatCurrency(sumaTotal)}</strong></h4></div>
        </div>


        <div className='container table'>
        <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
          <thead className='custom-table-header'>
            <tr className='table-success'>
              <th>FOLIO</th>
              <th>TOTAL DE LA VENTA</th>
              <th>PRODUCTOS DE LA VENTA</th>
              <th>CANTIDAD VENDIDA</th>
              <th>PRECIO PRODUCTO</th>
              <th>CLIENTE</th>
              <th>METODO PAGO</th>
              <th>FECHA REGISTRO</th>
              <th>EMPLEADO QUE REALIZO LA VENTA</th>
            </tr>
          </thead>
  <tbody>
  {sortedResultados.slice(primerIndex, ultimoIndex).map((val) => (
    <tr key={val.Id_venta}>
      <td>{val.Id_venta}</td>
      <td><strong>{formatCurrency(val.precioTotal_venta)}</strong></td>
      <td>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {val.paquetes && val.paquetes.length > 0 && val.paquetes.map(paquete => (
            <li key={paquete.Id_paquete} style={{ marginLeft: '20px', fontWeight: 'bold' }}>
              {paquete.nombre_promocion}
            </li>
          ))}
          {val.productos && val.productos.length > 0 && val.productos.map(producto => (
            <li key={producto.Id_producto} style={{ marginLeft: '20px' }}>
              {producto.nombre_producto}
            </li>
          ))}
        </ul>
      </td>
      <td>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {val.paquetes && val.paquetes.length > 0 && val.paquetes.map(paquete => (
            <li key={paquete.Id_paquete} style={{ marginLeft: '20px' }}>
              {paquete.cantidadVendida}
            </li>
          ))}
          {val.productos && val.productos.length > 0 && val.productos.map(producto => (
            <li key={producto.Id_producto} style={{ marginLeft: '20px' }}>
             <strong>{producto.cantidadVendida}</strong> 
            </li>
          ))}
        </ul>
      </td>
      <td className='precio'>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {val.paquetes && val.paquetes.length > 0 && val.paquetes.map(paquete => (
            <li key={paquete.Id_paquete} style={{ marginLeft: '20px', fontWeight: 'bold' }}>
              {formatCurrency(paquete.precio_paquete ? paquete.precio_paquete : '')}
            </li>
          ))}
          {val.productos && val.productos.length > 0 && val.productos.map((producto) => (
            <li key={producto.Id_producto} style={{ marginLeft: '20px' }}>
               <strong>{formatCurrency(producto.precioVenta ? producto.precioVenta : '')}</strong>
            </li>
          ))}
        </ul>
      </td>             
      <td>{val.cliente.nombre_cliente}</td>
      <td>{val.metodoPago.tipo_metodoPago}</td>             
      <td>{new Date(val.fecha_registro).toLocaleString()}</td>
      <td className='empleado'>{val.usuarios.nombre_usuario}</td>   
    </tr>
  ))}
</tbody>


</table>

        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
        <Paginacion productosPorPagina={productosPorPagina} 
        actualPagina={actualPagina} 
        setActualPagina={setActualPagina}
        total={total}
        />
        </div>
          
        <button onClick={exportToExcel} className='btn btn-secondary'>Exportar a Excel</button><br /><br /><br />

    </>
  );
};

export default Corte;