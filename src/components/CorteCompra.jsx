/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../index.css';
import App from '../App';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import {
  MDBInputGroup,
} from 'mdb-react-ui-kit';
import Form from 'react-bootstrap/Form';
import Pagination from "react-bootstrap/Pagination";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faDollar, faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { DataContext } from '../context/DataContext';
import Swal from 'sweetalert2';


const CorteCompra = ({ filename, sheetname }) => {

  const [compraVer, setCompraVer] = useState([])
  const [verProvedores, setVerProveedores] = useState([])
  const [Id_proveedor, setId_proveedor] = useState(0)
  const [nombre_proveedor, setNombre_proveedor] = useState("")
  const [Id_compra, setId_compra] = useState("")
  const [descripcion_compra, setDescripcionComra] = useState("")
  const [totalCompra, setTotalCompra] = useState("")
  const [personaPideCompra, setPersonaPide] = useState("")
  const [personaRecibeCompra, setPerosonaRecibe] = useState("")
  const [estado_compra, setEstadoCompra] = useState("")
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [esconderBotones, setEsconderBotones] = useState(false)  
  const [comprasanuladas, setComprasAnuladas] = useState([])
  const [pagos,setPagos] = useState([])
  const idSucursal = localStorage.getItem("sucursalId")

  /*ARRAYS PARA LOS H6*/
  const [comprastotales, setComprasTotales] = useState(0)
  const [compraspendientes, setComprasPendientes] = useState([])
  const [compraspagadas, setComprasPagadas] = useState([])
  const [comprasnopagadas, setComprasNoPagadas] = useState([])
  const [montocompraspagadas, setMontoComprasPagadas] = useState([])
  const [montocomprasnopagadas, setMontoComprasNoPagadas] = useState([])
  const [comprascanceladas, setComprasCanceladas] = useState([])

  /*MODALES*/
  const [showmodalcancelaciones, setShowModalCancelaciones] = useState(false)
  const [showmodalobservaciones, setShowModalObservaciones] = useState(false)

  /*MANEJADORES DEL MODAL*/
  const handleShowModalCancelaciones = () => setShowModalCancelaciones(true)
  const handleCloseModalCancelaciones = () => setShowModalCancelaciones(false)

  const handleShowModalObservaciones = () => setShowModalObservaciones(true)
  const handleCloseModalObservaciones = () => setShowModalObservaciones(false)


  const Id_usuario = localStorage.getItem('idUsuario');


  

  const {  URL } = useContext(DataContext);
    //PARA FILTRAR X FECHA LA VENTA
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

const verCompras = () => {
  const sucursalId = localStorage.getItem('sucursalId')
  const formattedDate = fechaSeleccionada ? formatDate(fechaSeleccionada) : "all";
  axios.get(`${URL}compras/vercortecompra/${formattedDate}/${sucursalId}`).then((response) => {
      setCompraVer(response.data);
      console.log("Compras:", response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const verPagos = (idCompra) => {
  axios.get(`${URL}compras/verpagosproveedores/${idCompra}`).then((response)=> {
    setPagos(response.data)
    console.log("Observaciones: ", response.data)
  }).catch((error)=>{
    console.error('Error', error)
  })
}



const verProveedores =  ()  => {
  axios.get(`${URL}proveedores`).then((response)=>{
   setVerProveedores(response.data)
 })
}

 const editarCompra = () =>{
  const idProveedor = parseInt(document.getElementById('proveedor').value)
  if(idProveedor === 0){
    alert("Debes elegir un proveedor!")
  }else{
    axios.put(`${URL}compras/put/${Id_compra}`,
    {
      Id_compra: Id_compra,
      descripcion_compra: descripcion_compra,
      totalCompra: totalCompra,
      estado_compra: estado_compra,
      personaPideCompra: personaPideCompra,
      personaRecibeCompra: personaRecibeCompra,  
      Id_proveedor: idProveedor,
      Id_sucursal: idSucursal
    }).then(()=>{
      limpiarCampos()
      alert('Compra editada con exito')
      verCompras()
    }).catch((error)=>{
      console.log('no se pudo editar la compra',error)
    })
  }
 }
 const seeCompra= (compra) =>{
  setNombre_proveedor(nombre_proveedor)
  setId_compra(compra.Id_compra)
  setDescripcionComra(compra.descripcion_compra)
  setTotalCompra(compra.totalCompra)
  setEstadoCompra(compra.estado_compra)
  setPersonaPide(compra.personaPideCompra)
  setPerosonaRecibe(compra.personaRecibeCompra)
  setId_proveedor(compra.Id_proveedor)
  setEsconderBotones(true)
 }
 const limpiarCampos= () =>{
  setId_compra('')
  setDescripcionComra('')
  setTotalCompra('')
  setEstadoCompra('')
  setPersonaPide('')
  setPerosonaRecibe('')
  setId_proveedor(0)
  setEsconderBotones(false);
 }

 /* GETS PARA LOS H6*/

 const sucursalId = localStorage.getItem("sucursalId");

 const verComprasTotales = () => {
  axios.get(`${URL}compras/verComprasTotales/${sucursalId}`).then((response)=> {
    setComprasTotales(response.data[0].total_compras)
    console.log("Compras totales: ", response.data)
  }).catch((error)=>{
    console.log("Error al obtener compras totales",error)
  })
}

const verComprasPendientes = () => {
  axios.get(`${URL}compras/verComprasPendientes/${sucursalId}`).then((response)=> {
    setComprasPendientes(response.data[0].compras_pendientes)
    console.log("Compras pendientes: ", response.data)
  }).catch((error)=> {
    console.log("Error al obtener compras pendientes", error)
  })
}

const verComprasPagadas = () => {
  axios.get(`${URL}compras/verComprasPagadas/${sucursalId}`).then((response)=> {
    setComprasPagadas(response.data[0].compras_pagadas)
    console.log("Compras pagadas: ", response.data)
  }).catch((error)=> {
    console.log("Error al obtener compras pagadas", error)
  })
}

const verComprasNoPagadas = () => {
  axios.get(`${URL}compras/verComprasNoPagadas/${sucursalId}`).then((response)=> {
    setComprasNoPagadas(response.data[0].compras_no_pagadas)
    console.log("Compras no pagadas: ", response.data)
  }).catch((error)=> {
    console.log("Error al obtener compras no pagadas", error)
  })
}

const verMontoComprasPagadas = () => {
  axios.get(`${URL}compras/verMontoComprasPagadas/${sucursalId}`).then((response)=> {
    setMontoComprasPagadas(response.data[0].monto_compras_pagadas)
    console.log("Monto compras pagadas: ", response.data)
  }).catch((error)=> {
    console.log("Error al obtener compras pagadas", error)
  })
}

const verMontoComprasNoPagadas = () => {
  axios.get(`${URL}compras/verMontoComprasNoPagadas/${sucursalId}`).then((response)=> {
    setMontoComprasNoPagadas(response.data[0].monto_compras_no_pagadas)
    console.log("Monto compras no pagadas: ", response.data)
  }).catch((error)=> {
    console.log("Error al obtener compras no pagadas", error)
  })
}

const verComprasCanceladas = () => {
  axios.get(`${URL}compras/verComprasCanceladas/${sucursalId}`).then((response)=> {
    setComprasCanceladas(response.data[0].compras_canceladas)
  }).catch((error)=>{
    console.error("Error", error)
  })
}

 const verTodasLasCompras = () => {
  setFechaSeleccionada(null);  
  verCompras();  
};

const eliminarCompra = (Id_compra) => {
  const compra = compraPaginados.find(c => c.Id_compra === Id_compra); 
  Swal.fire({
    icon: 'info',
    title: 'Motivo de cancelación',
    input: 'textarea',
    inputLabel: 'Escribí el motivo por el cual estás cancelando esta compra:',
    inputPlaceholder: 'Motivo...',
    inputAttributes: {
      'aria-label': 'Motivo de cancelación'
    },
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Cancelar compra',
    cancelButtonText: 'Volver',
    preConfirm: (motivo) => {
      if (!motivo) {
        Swal.showValidationMessage('¡Debes escribir un motivo!');
      }
      return motivo;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const motivo = result.value;

      axios.put(`${URL}compras/delete/${Id_compra}`)
        .then(() => {
          return axios.post(`${URL}cancelaciones/post`, {
            Id_compra,
            motivo_cancelacion: motivo,
            Id_usuario,
          });
        })
        .then(() => {
          return axios.put(`${URL}creditos/restarDeudaProveedor`, {
            montoCredito: compra.totalCompra,
            Id_proveedor: compra.Id_proveedor
          });
        })
        .then(()=> {
          return axios.put(`${URL}creditos/cancelarmovimiento`,{
            montoCredito: compra.totalCompra,
            Id_proveedor: compra.Id_proveedor
          })
        })
        .then(() => {
          Swal.fire('Cancelada', 'La compra fue cancelada correctamente.', 'success');
          verCompras();
          verMontoComprasNoPagadas()
        })
        .catch((error) => {
          console.error(error);
          Swal.fire('Error', 'No se pudo cancelar la compra.', 'error');
        });
    }
  });
};


const verComprasAnuladas = (idCompra) => {
  axios.get(`${URL}compras/vercomprasanuladas/${idCompra}`).then((response)=> {
  setComprasAnuladas(response.data)
  console.log('Compras anuladas: ',response.data)
  }).catch((error)=>{
    console.error(error)
  })
}




const mostrarBotonVerTodas = fechaSeleccionada !== null;


useEffect(()=>{
  verProveedores()
  verCompras()
  verComprasTotales()
  verComprasPendientes()
  verComprasPagadas()
  verComprasNoPagadas()
  verMontoComprasPagadas()
  verMontoComprasNoPagadas()
  verComprasCanceladas()
  verComprasAnuladas()
  verPagos()
},[fechaSeleccionada])
    

      const exportToExcel2 = () => {
        const ws = XLSX.utils.json_to_sheet(compraVer);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, `${filename}.xlsx`);
      };

//PAGINACION (Estados para controlar la pagina actual y la cantidad x pagina)
const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 10;

const totalPaginas = Math.ceil(compraVer.length / elementosPorPagina);

let items = [];


const mostrarPaginacion = compraVer.length > elementosPorPagina;

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
const compraPaginados = compraVer.slice(inicio, fin);

 //ultimo dia 
 const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

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
      <h1>CORTE COMPRA</h1>
    </div><br />
    <h2><strong>CORTE COMPRA</strong></h2>
    <h4>Gestiona todas tus compras completas con sus estados y montos</h4>
      <br /><br />
      
    <div className="container">

   


      <MDBInputGroup className='mb-3' >
      <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#FF914D",}} />
                    </span>
            <input className='form-control' type='text' placeholder="Descripcion" value={descripcion_compra} onChange={(e) => setDescripcionComra(e.target.value)} />
          </MDBInputGroup>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#FF914D",}} />
                </span>
            <input className='form-control' type='number' placeholder="Total Compra " value={totalCompra} onChange={(e) => setTotalCompra(e.target.value)} />
          </MDBInputGroup>

          {/* <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#012541",}} />
                    </span>
            <input className='form-control' type='text' placeholder="Estado de la compra" value={estado_compra} onChange={(e) => setEstadoCompra(e.target.value)} />
          </MDBInputGroup> */}

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faPerson} size="lg" style={{color: "#FF914D",}} />
                </span>
            <input className='form-control' type='text' placeholder="Persona que pide " value={personaPideCompra} onChange={(e) => setPersonaPide(e.target.value)} />
          </MDBInputGroup>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faPersonWalking} size="lg" style={{color: "#FF914D",}} />
                </span>
            <input className='form-control' type='text' placeholder="Persona que recibe " value={personaRecibeCompra} onChange={(e) => setPerosonaRecibe(e.target.value)} />
          </MDBInputGroup>
        <br />
          <h4 style={{display:'flex', flexDirection:'flex-start', marginTop:'50px'}}>PROVEEDORES</h4>
          <MDBInputGroup>
          <span className="input-group-text">
           <FontAwesomeIcon icon={faTruck} size="lg" style={{color: "#FF914D",}} />
          </span>
          <Form.Select aria-label="Nombre proveedor" id="proveedor" value={Id_proveedor} onChange={(e)=>setId_proveedor(e.target.value)}>
            <option value="0" disabled selected>Selecciona un proveedor</option>
                {verProvedores.map((cat)=>   
                    <option key={cat.Id_proveedor} value={cat.Id_proveedor}  >{cat.nombre_proveedor}</option>   
                )}
            </Form.Select>
          </MDBInputGroup>
                
                <br />

                <div className='card-footer text-muted'>
                  <div >
                    {esconderBotones && (
                      <>
                      <Button className="btn btn-warning m-2" onClick={editarCompra}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon> EDITAR</Button>
                      <Button className="btn btn-danger m-2" onClick={limpiarCampos}><FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
                      </>
                    )}
                
                  </div>          
                   
                </div>

    </div>

            
      <div className='container'><br />
      <DatePicker
                selected={fechaSeleccionada}
                onChange={(date) => {
                    setFechaSeleccionada(date)
                }}
                className='form-control custom-date-picker custom-datepicker-wrapper'
                dateFormat="yyyy/MM/d"
                locale={es}
                placeholderText='Ingrese una fecha de llegada'
        /> <br /><br />
        {mostrarBotonVerTodas && (
          <Button onClick={verTodasLasCompras}>
            VOLVER A VER TODAS LAS COMPRAS
          </Button>
        )}
        
        <h6 style={{textAlign: 'left', color: 'blue'}}><strong>COMPRAS TOTALES: {comprastotales}</strong></h6>
        <h6 style={{textAlign: 'left', color: 'red'}}><strong>COMPRAS CANCELADAS: {comprascanceladas}</strong> </h6>
        <h6 style={{textAlign: 'left', color: 'green'}}><strong>COMPRAS PAGADAS: {compraspagadas}</strong></h6>
        <h6 style={{textAlign: 'left', color: '#c6be1e'}}><strong>COMPRAS PENDIENTES: {compraspendientes}</strong></h6>
        <h6 style={{textAlign: 'left', color: 'green'}}><strong>MONTO DE COMPRAS PAGADAS: {formatCurrency(montocompraspagadas)}</strong></h6>
        <h6 style={{textAlign: 'left', color: 'red'}}><strong>DEUDA TOTAL CON PROVEEDORES: {formatCurrency(montocomprasnopagadas)}</strong></h6>
        <br /> <br />
        <div className='container table'>
        <Form.Select
          value={estado_compra}
          onChange={(e) => setEstadoCompra(e.target.value)}
          className="mb-3"
        >
          <option value="">FILTRAR POR ESTADO COMPRA</option>
          <option value="pagada">Pagada</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelada">Cancelada</option>
        </Form.Select>

        <table className='table mt-5 shadow-lg custom-table'>
  <thead className='custom-table-header'>
    <tr>
      <th>FOLIO</th>
      <th>DESCRIPCION</th>
      <th>TOTAL</th>
      <th>ESTADO</th>
      <th>P. PIDE COMPRA</th>
      <th>P. RECIBE COMPRA</th>
      <th>PROVEEDOR</th>
      <th>F. REGISTRO</th>
      <th>F. LLEGADA</th>
      <th>ACCIONES</th>
    </tr>
  </thead>
  <tbody>
    {compraPaginados
      .filter(compra => estado_compra === "" || compra.estado_compra === estado_compra) 
      .map(compra => (
        <tr key={compra.Id_compra}>
          <td>{compra.Id_compra}</td>
          <td>{compra.descripcion_compra}</td>
          <td className='precio'><strong>{formatCurrency(compra.totalCompra)}</strong></td>
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
          <td>
          <ButtonGroup>
              <Button variant='warning' onClick={() => seeCompra(compra)}><FontAwesomeIcon icon={faPencil}></FontAwesomeIcon></Button>
              {compra.estado_compra === 'cancelada' && (
                <Button variant='success' onClick={() => { verComprasAnuladas(compra.Id_compra) ; handleShowModalCancelaciones();}}>
                  <FontAwesomeIcon icon={faEye} />
              </Button>
              )}
              {compra.estado_compra !== 'cancelada' && (
                <Button variant='danger' onClick={() => eliminarCompra(compra.Id_compra)}>
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                </Button>
              )}
            <Button variant='info' onClick={() => {verPagos(compra.Id_compra); handleShowModalObservaciones()}}>
              <FontAwesomeIcon icon={faClipboard} />
            </Button>
            </ButtonGroup>
          </td>
        </tr>
      ))}
  </tbody>
</table>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination size='xl'>{items}</Pagination>
        <br />
      </div>


     {/* MODAL DETALLE COMPRA CANCELADA */}
      <Modal show={showmodalcancelaciones} onHide={handleCloseModalCancelaciones} size='lg'>
        <Modal.Header closeButton>
         <Modal.Title>DETALLE DE COMPRA CANCELADA</Modal.Title>
        </Modal.Header>
      <Modal.Body>
      <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
          <thead className='custom-table-header'>
            <tr>
              <th>FOLIO</th>
              <th>MOTIVO</th>
              <th>F.REGISTRO</th>
              <th>USUARIO</th>
            </tr>
          </thead>
          <tbody>
            {
            comprasanuladas.map((val)=>(
              <tr key={val.Id_cancelacion}>
                <td>{val.Id_cancelacion}</td>
                <td>{val.motivo_cancelacion}</td>
                <td>{new Date(val.FechaRegistro).toLocaleString()}</td>
                <td>{val.nombre_usuario}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(handleCloseModalCancelaciones)}>CERRAR</Button>
      </Modal.Footer>
      </Modal>


      {/* MODAL OBSERVACIONES */}
      <Modal show={showmodalobservaciones} onHide={handleCloseModalObservaciones} size='lg'>
        <Modal.Header closeButton>
         <Modal.Title>OBSERVACIONES DE PAGOS</Modal.Title>
        </Modal.Header>
      <Modal.Body>
      <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
          <thead className='custom-table-header'>
            <tr>
              <th>FOLIO DE COMPRA</th>
              <th>MONTO ABONADO</th>
              <th>OBSERVACIONES</th>
              <th>USUARIO</th>
              <th>F.REGISTRO</th>
            </tr>
          </thead>
          <tbody>
            {
            pagos.map((val)=>(
              <tr key={val.IdPagoProveedor}>
                <td>{val.Id_compra}</td>
                <td>{`${formatCurrency(val.monto)}`}</td>
                <td>{val.observaciones && val.observaciones.trim() !== '' ? val.observaciones : 'No hay observaciones'}</td>
                <td>{val.nombre_usuario}</td>
                <td>{new Date(val.fechaRegsitro).toLocaleString()}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(handleCloseModalObservaciones)}>CERRAR</Button>
      </Modal.Footer>
      </Modal>





      <button onClick={exportToExcel2} className='btn btn-secondary'>Exportar a Excel</button>


    </>
  )
}

export default CorteCompra
