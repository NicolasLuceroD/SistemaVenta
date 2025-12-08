/* eslint-disable no-unused-vars */
import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import App from '../App.jsx';
import {
  MDBInputGroup,
} from 'mdb-react-ui-kit';
import Form from 'react-bootstrap/Form';
import Pagination from "react-bootstrap/Pagination";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faCalendar, faCalendarAlt, faDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../context/DataContext.jsx';


const Compras = () => {

  const [buscar, setBuscar] = useState("");
  const [verProvedores, setVerProveedores] = useState([])
  const [Id_proveedor, setId_proveedor] = useState("0")
  const [Id_compra, setId_compra] = useState("")
  const [descripcion_compra, setDescripcionComra] = useState("")
  const [totalCompra, setTotalCompra] = useState("")
  const [personaPideCompra, setPersonaPide] = useState("")
  const [personaRecibeCompra, setPerosonaRecibe] = useState("")
  const [estadoCompra, setEstadoCompra] = useState("")
  const [verCompra, setVerCompra] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [provedor,setProvedor] = useState('0')
  const [fechaLlegada, setFechaLlegada] = useState(null)
  const [creditoActaul, setCreditoActual] = useState(0)
  const [verSaldo, setVerSaldo] = useState([])

  const {  URL } = useContext(DataContext);
  const idusuario = localStorage.getItem("idUsuario")

    //PARA FILTRAR X FECHA LA VENTA
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // FUNCION PARA PASAR A PESOS ARG
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
      }).format(value);
    };

 


      const verCompras = () => {
        const formattedDate = formatDate(fechaSeleccionada);
        const sucursalId = localStorage.getItem('sucursalId');
        axios.get(`${URL}compras/vercompras/${formattedDate}/${sucursalId}`).then((response)=>{
          console.log("Datos de compras recibidos:", response.data);
          setVerCompra(response.data)
        }).catch((error)=>{
          console.log(error)
        })
      }

      useEffect(()=>{
        verCompras()
      },[fechaSeleccionada])
     


const verProveedores =  ()  => {
   axios.get(`${URL}proveedores`).then((response)=>{
    setVerProveedores(response.data)
  }).catch((error)=>{
    console.log('Error al obtener los proveedores', error)
  })
}

const verDeuda = () => {
  const formattedDate = formatDate(fechaSeleccionada)
  const sucursalId = localStorage.getItem('sucursalId')
  axios.get(`${URL}compras/versaldo/${formattedDate}/${sucursalId}`).then((response)=>{
    setVerSaldo(response.data[0].total_pendiente)
  }).catch((error)=>{
    console.log(error)
  })
}

const obtenerCreditoProveedor = (Id_proveedor) => {
  console.log('Id_proveedor', Id_proveedor)
  setId_proveedor(Id_proveedor)
  let creditoActual = verProvedores.find(c => c.Id_proveedor === parseInt(Id_proveedor));
  console.log('creditoActaul',creditoActaul)
  return creditoActual ? setCreditoActual(creditoActual.montoCredito)  : 'Proveedor no encontrado';
};

const FinalizarCompra = () => {
  const idProveedor = parseInt(document.getElementById('proveedor').value);
  if (idProveedor === 0) {
    alert("Debes elegir un proveedor!");
  } else {
    const id_sucursal = localStorage.getItem('sucursalId');
    const formattedFechaEstimada = fechaLlegada ? formatDate(fechaLlegada) : null; 
    console.log('Fecha estimada de llegada:', formattedFechaEstimada);
    axios.post(`${URL}compras/post`, {
      descripcion_compra: descripcion_compra,
      totalCompra: totalCompra,
      estado_compra: 'pendiente',
      personaPideCompra: personaPideCompra,
      personaRecibeCompra: '---',
      Id_proveedor: Id_proveedor,
      Id_sucursal: id_sucursal,
      FechaLlegada: formattedFechaEstimada,
      Id_usuario: idusuario
    }).then(() => {
      axios.post(`${URL}creditos/movimientoProveedores`,{
        Id_proveedor: Id_proveedor,
        montoCredito: totalCompra,
        montoDebito: 0,
        Saldo:  parseFloat(totalCompra) + parseFloat(creditoActaul)
      })
    }).then(()=>{
      axios.put(`${URL}creditos/aumentarDeudaProveedor`,{
        Id_proveedor: Id_proveedor,
        montoCredito: totalCompra
      })
    }).then(() => {
      alert('Compra finalizada con exito');
      verCompras()
      limpiarCampos();
    });
  }
};


const limpiarCampos= () =>{
  setId_compra('')
  setDescripcionComra('')
  setTotalCompra('')
  setEstadoCompra('')
  setPersonaPide('')
  setPerosonaRecibe('')
  setProvedor(0)
  setFechaLlegada(null);
  setId_proveedor("0");
 }


useEffect(() => {
  verProveedores()
  verDeuda()
}, [verDeuda]);

//PAGINACION (Estados para controlar la pagina actual y la cantidad x pagina)
const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 10;

const totalPaginas = Math.ceil(verCompra.length / elementosPorPagina);

let items = [];


const mostrarPaginacion = verCompra.length > elementosPorPagina;

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
const comprasPaginadas = verCompra.slice(inicio, fin);



//ultimo dia 
const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
return (
<>
  <App/>
    
    <div className='h3-ventas'>
      <h1>COMPRAS</h1>
    </div>

    <div className="container-fluid"><br />
                    <h2><strong>ADMINISTRACION DE COMPRA</strong></h2>
                    <h4>Gestiona todas los pedidos a tus proveedores de forma centralizada</h4>   <br />
      <div className='container'>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='text' placeholder="Descripcion" value={descripcion_compra} onChange={(e) => setDescripcionComra(e.target.value)} />
          </MDBInputGroup>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='number' placeholder="Total Compra " value={totalCompra} onChange={(e) => setTotalCompra(e.target.value)} />
          </MDBInputGroup>

          {/* <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#012541",}} />
                </span>
            <input className='form-control' type='text' placeholder="Estado de la compra" value={estadoCompra} onChange={(e) => setEstadoCompra(e.target.value)} />
          </MDBInputGroup> */}

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faPerson} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='text' placeholder="Persona que pide " value={personaPideCompra} onChange={(e) => setPersonaPide(e.target.value)} />
          </MDBInputGroup>

          {/* <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faPersonWalking} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='text' placeholder="Persona que recibe " value={personaRecibeCompra} onChange={(e) => setPerosonaRecibe(e.target.value)} />
          </MDBInputGroup> */}
        <br />

        <MDBInputGroup className='mb-3'>
              <span className="input-group-text">
                <FontAwesomeIcon icon={faCalendarAlt} size="lg" style={{ color: "#01992f" }} />
              </span>
              <DatePicker
                selected={fechaLlegada}
                onChange={(date) => setFechaLlegada(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Fecha estimada de llegada"
                className="form-control"
                locale={es}
              />
        </MDBInputGroup>    
          
          <h4 style={{display:'flex', flexDirection:'flex-start', marginTop:'50px'}}>PROVEEDORES</h4>
          <MDBInputGroup className='mb-3'>
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faTruck} size="lg" style={{color: "#01992f",}} />
                </span>
          <Form.Select  key={Id_proveedor} aria-label="Nombre proveedor" id="proveedor" value={Id_proveedor}  onChange={(e) => obtenerCreditoProveedor(e.target.value)}>
          <option value='0' disabled selected >Seleccione Proveedor</option>
                {verProvedores.map((cat)=>   
                    <option key={cat.Id_proveedor} value={cat.Id_proveedor}>{cat.nombre_proveedor}</option>   
                )}
            </Form.Select>
          </MDBInputGroup>
                
       

                <br />

          <Button className="btn btn-success" onClick={FinalizarCompra}><FontAwesomeIcon icon ={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR COMPRA</Button>
          </div>
            
            
        </div>
             <br></br> 
      <div className="container-fluid">
        <div className='container'>
        <h4>ELEGIR COMPRA EXISTENTE</h4>
        <div className='col'>
          
      
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
              <br /> <br />

        <h5 style={{textAlign: 'left'}}>A PAGAR COMPRAS PENDIENTES: <strong>{formatCurrency(verSaldo)} </strong></h5>
        </div> <br />
        <div className="row">     
          <div className="col">  
          <div className='container table'>
            <Table striped bordered hover className='custom-table'>
            <thead className='custom-table-header'>
              <tr>
                  <th>FOLIO</th>
                  <th>DESCRIPCION</th>
                  <th>TOTAL</th>
                  <th>ESTADO</th>
                  <th>P. PIDE COMPRA</th>
                  <th>P. RECIBE COMPRA</th>
                  <th>PROVEEDOR</th>
                  <th>F. DE REGISTRO</th>
                  <th>F. DE LLEGADA</th>
              </tr>
              </thead>
              <tbody>
                {comprasPaginadas.map((compra) => 
                    <tr key={compra.Id_compra}>
                      <td>{compra.Id_compra}</td>
                      <td>{compra.descripcion_compra}</td>
                      <td className='precio'>
                        <strong>{formatCurrency(compra.totalCompra)}</strong>
                      </td>
                      <td>
                        <span className={`badge 
                          ${compra.estado_compra === 'cancelada' ? 'bg-danger' :
                            compra.estado_compra === 'pendiente' ? 'bg-warning text-dark' :
                            compra.estado_compra === 'pagada' ? 'bg-success' : 'bg-secondary'
                          }`}>
                          {compra.estado_compra}
                        </span>
                      </td>
                      <td>{compra.personaPideCompra}</td>
                      <td>{compra.personaRecibeCompra}</td>
                      <td>{compra.nombre_proveedor}</td>
                      <td>{new Date(compra.FechaRegistro).toLocaleString()}</td>
                      <td className="bg-primary-subtle text-dark">
                        {new Date(compra.FechaLlegada).toLocaleDateString('es-AR')}
                      </td>
                    </tr>
                )}
              </tbody>

            </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination size='xl'>{items}</Pagination>
        <br />
      </div>
      </div>
    </>
);
}

export default Compras

