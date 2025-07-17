import { useContext, useEffect, useState } from "react"
import App from "../App"
import axios  from "axios"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import Pagination from "react-bootstrap/Pagination";
import { DataContext } from "../context/DataContext";
import '../App.css'

const PlataCaja = () => {

    const [plata, setPlata] = useState([])
    const[plataLogin,setPlataLogin] = useState([])
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const Id_sucursal = localStorage.getItem("sucursalId")


    const {  URL } = useContext(DataContext);
    //PARA FILTRAR X FECHA LA VENTA
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };



      useEffect(()=>{
        const formattedDate = formatDate(fechaSeleccionada);
        axios.get(`${URL}plataCaja/${Id_sucursal}/${formattedDate}`).then((response)=>{
            setPlata(response.data)
        }).catch((error)=>{
            console.log('Error al obtener los datos', error)
        })
      },[fechaSeleccionada,Id_sucursal])


        useEffect(()=>{
            const formattedDate = formatDate(fechaSeleccionada);
            axios.get(`${URL}plataLogin/${Id_sucursal}/${formattedDate}`).then((response)=>{
                setPlataLogin(response.data)
            }).catch((error)=>{
                console.log('Error al obtener los datos', error)
            })
        },[fechaSeleccionada,Id_sucursal])



//ultimo dia 
const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);


const [paginaActual2, setPaginaActual2] = useState(1);
const elementosPorPagina2 = 5;
const totalPaginas2 = Math.ceil(plata.length / elementosPorPagina2);
let items2 = [];
const mostrarPaginacion2 = plata.length > elementosPorPagina2;
for (let number = 1; number <= totalPaginas2; number++) {
  items2.push(
    mostrarPaginacion2 && (
      <Pagination.Item
        key={number}
        active={number === paginaActual2}
        onClick={() => setPaginaActual2(number)}
      >
        {number}
      </Pagination.Item>
    )
  );
}
const inicio2 = (paginaActual2 - 1) * elementosPorPagina2;
const fin2 = inicio2 + elementosPorPagina2;
const productosPaginados2 = plata.slice(inicio2, fin2);



const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 5;
const totalPaginas = Math.ceil(plataLogin.length / elementosPorPagina);
let items = [];
const mostrarPaginacion = plataLogin.length > elementosPorPagina;
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
const productosPaginados = plataLogin.slice(inicio, fin);


  // FUNCION PARA PASAR A PESOS ARG
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };


return (
    <>
    <App/>
    <div className='h3-ventas'>
  <h1>MOVIMIENTO USUARIOS</h1>
  </div><br />
    <div className="container">
              <div className= "row">
                <div className= "col">
                    <h2><strong>CONTROL DE INGRESOS Y SALIDAS</strong></h2>
                    <h4>Controla todos los ingresos y salidas de tus usuarios segun el dia</h4>   
                </div>
              </div>
      </div><br />
    <div className="container">
    <DatePicker
                selected={fechaSeleccionada}
                onChange={(date) => {  
                    setFechaSeleccionada(date)
                }}
                className='form-control custom-date-picker custom-datepicker-wrapper'
                dateFormat="yyyy/MM/d"
                locale={es}
                placeholderText='Ingrese una fecha'
                maxDate={lastDayOfMonth}
               
                />              
<br /><br />
                  <h3>INGRESO DE USUARIOS</h3>
                  <div className="container table">
                      <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
                      <thead className='custom-table-header'>
                        <tr className='table-success'>
                                  <th>NOMBRE DE USUARIO</th>
                                  <th>DINERO EN CAJA</th>
                                  <th>HORA DE INGRESO</th>            
                              </tr>
                          </thead>
                          <tbody>
                              {productosPaginados.map((val) => (
                                  <tr key={val.Id_plataCajaLogin}>
                                      <td>{val.nombre_usuario}</td>
                                      <td className="precio2"><strong>{formatCurrency(val.cantidadPlataLogin)}</strong></td>
                                      <td>{new Date (val.FechaRegistro).toLocaleString()}</td>
                                    
                                  </tr>
          
                              ))} 
                          </tbody>
                      </table>
            
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Pagination size='xl'>{items}</Pagination>
                      </div>
              </div>
    <h3>SALIDA DE USUARIOS</h3>
    <div className="container table">
            <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
            <thead className='custom-table-header'>
              <tr className='table-success'>
                        <th>NOMBRE USUARIO</th>
                        <th >DINERO EN CAJA</th>
                        <th >DINERO FALTANTE</th>
                        <th>HORA DE SALIDA</th>            
                    </tr>
                </thead>
                <tbody>
                    {productosPaginados2.map((val) => (
                        <tr key={val.Id_plataCaja}>
                            <td>{val.nombre_usuario}</td>
                            <td className="precio2"><strong>{formatCurrency(val.CantidadPlata)}</strong></td>
                            <td className="precioF"><strong>{formatCurrency(val.faltante)}</strong></td>
                            <td>{new Date (val.FechaRegistro).toLocaleString()}</td>
                          
                        </tr>

                    ))} 
                </tbody>
            </table> 
        </div> 
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination size='xl'>{items2}</Pagination>
            </div>
            <hr />
    </>
  )
}

export default PlataCaja