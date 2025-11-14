import  {useNavigate} from 'react-router-dom'
import './App.css'
import { Button, Navbar } from 'react-bootstrap'
import  axios from 'axios'
import { Modal} from 'react-bootstrap';
import { MDBInputGroup } from 'mdb-react-ui-kit';
import { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft, faCarAlt, faCreditCard, faDoorOpen, faHandHoldingUsd, faMobile, faMobileAlt, faMoneyBillWave, faPhone, faPhoneSlash, faUser, faWallet } from '@fortawesome/free-solid-svg-icons';


import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { faDollar } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from './context/DataContext';
import Dropdown from 'react-bootstrap/Dropdown';

function App(  ) {

 
  const [cantidadPlataCaja, setCantidadPlataCaja] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [totalVentas, setTotalVentas] = useState([]);
  const [time, setTime] = useState(new Date());
  const [faltante, setFaltante] = useState(0);
  const [total_cierre, setTotalCierre] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [metoPago, setMetodosPagos] = useState([]);

  const {  URL } = useContext(DataContext);

      
  const handleShowModal = () => {
    setShowModal(true)
    obtenerDatosCaja()
    verMetoPagos()
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCantidadPlataCaja("")
  }
  const rolUsuario = localStorage.getItem("rolUsuario")

 const navigate = useNavigate()

  const navegar = (ruta) =>{
    navigate(ruta)
  }


 const id_sucursal = localStorage.getItem("sucursalId")
 const id_usuario = localStorage.getItem("idUsuario")
 const IdCaja = localStorage.getItem('idCaja')
 const nombreUsuario = localStorage.getItem('nombreUsuario')
 const nombreSucursal = localStorage.getItem('nombreSucursal')
 




const calcularFaltante = () => {
  const caja = parseFloat(cantidadPlataCaja || 0);
  const diferencia = parseFloat((total_cierre - caja).toFixed(2));
  return Math.max(diferencia, 0);
};



 const verMetoPagos = () =>{
  axios.get(`${URL}plataCaja/verMetodosPagos/${IdCaja}/${id_usuario}`)
  .then((response)=>{
    setMetodosPagos(response.data)
    console.log(response.data)
  }).catch((error)=>{
    console.log('Error al obteners los metodos de pago', error)
  })
 }

const [plataApertura,setPlataApertura] = useState("")
const [plataIngreso,setPlataIngreso] = useState("")
const [plataEgreso,setPlataEgreso] = useState("")

  const obtenerDatosCaja = async () => {
    try {
        const response = await axios.get(`${URL}plataCaja/plataLogin/${id_usuario}/${IdCaja}`);
        if (response.data) {
            setTotalCierre(parseFloat(response.data[0].total_cierre));

            setPlataApertura(parseFloat(response.data[0].montoInicial));
            setPlataEgreso(parseFloat(response.data[0].total_egresos));
            setPlataIngreso(parseFloat(response.data[0].total_ingresos));
          }
    } catch (error) {
        console.error("Error al obtener datos de caja:", error);
    } finally {
        setCargando(false);
    }
};


const cerrarCaja = async () => {
  const plataIF = parseFloat(parseFloat(cantidadPlataCaja).toFixed(2));

  if (isNaN(plataIF) || plataIF < 0) {
      return alert('Por favor ingrese un monto válido.');
  }

  try {
      await axios.post(`${URL}plataCaja/post`, {
          Id_sucursal: id_sucursal,
          Id_usuario: id_usuario,
          cantidadPlata: plataIF,
          faltante: calcularFaltante(),
          IdCaja: IdCaja
      });

      await axios.put(`${URL}plataCaja/cerrarCaja`, {
        Id_usuario: id_usuario,
        Id_caja: IdCaja
    });


      alert('Caja cerrada correctamente. ¡Hasta pronto!');
      localStorage.removeItem('idCaja');  
      navigate('/');

  } catch (error) {
      console.log('Error al cerrar la caja:', error);
  }
};


useEffect(() => {
    obtenerDatosCaja();
},[]);


useEffect(() => {
  const intervalID = setInterval(() => {
    setTime(new Date());
  }, 1000); 

  return () => clearInterval(intervalID);
}, []);

 // FUNCION PARA PASAR A PESOS ARG
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

// LOGICA PARA QUE NO SE CIERRE EL NAVEGADOR SI NO CERRO TURNO
//   useEffect(() => {
//   const handleBeforeUnload = (e) => {
//     const cajaAbierta = localStorage.getItem("idCaja");
//     if (cajaAbierta) {
//       e.preventDefault();
//       e.returnValue = ""; // necesario para mostrar el diálogo en algunos navegadores
//     }
//   };

//   window.addEventListener("beforeunload", handleBeforeUnload);

//   return () => {
//     window.removeEventListener("beforeunload", handleBeforeUnload);
//   };
// }, []);

//ARRAY DE ICONOS CIERRE DE CAJA
const iconMap = {
  1: faMoneyBillWave,          // EFECTIVO
  4: faMoneyBillWave,          // EFECTIVO
  5: faArrowRightArrowLeft,    // TRANSFERENCIA
  7: faHandHoldingUsd,         // A CREDITO
  8: faHandHoldingUsd,         // A CREDITO
  6: faWallet                  // MIXTO
};

  return (
    <>
    <Navbar bg="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">
          <a href="/testVenta">
            <h3 style={{color: 'white'}}>A&L SOFTWARE</h3>
          </a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className='me-auto flex-wrap'>
            <Button onClick={() => navegar('/testVenta')} className='m-2 btn-jsx '>VENTAS</Button>
            <Button onClick={() => navegar('/gestionMesas')} className='m-2 btn-jsx '>MESAS</Button>
            <Dropdown className='m-2'>
              <Dropdown.Toggle className = "dropdown-toggle">
                CREDITOS
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-azul">
                <Button onClick={() => navegar('/credito')} className='m-2 btn-jsx'>CLIENTES</Button>
                <Button onClick={() => navegar('/creditoproveedores')} className='m-2 btn-jsx'>PROVEEDORES</Button>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='m-2'>
              <Dropdown.Toggle className = "dropdown-toggle">
                COMPRAS
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-azul">
                <Button onClick={() => navegar('/compra')} className='m-2 btn-jsx'>COMPRA</Button>
                <Button onClick={() => navegar('/corteC')} className='m-2 btn-jsx'>CORTE COMPRA</Button>
                <Button onClick={() => navegar('/auditoriaC')} className='m-2 btn-jsx'>AUDITORIA</Button>
              </Dropdown.Menu>
            </Dropdown>
            <Button onClick={() => navegar('/corte2')} className='m-2 btn-jsx '>CORTE</Button>
            <Button onClick={() => navegar('/clientes')} className='m-2 btn-jsx '>CLIENTES</Button>
            {rolUsuario === 'admin' && (
              <>
                <Button onClick={() => navegar('/movUsu')} className='m-2 btn-jsx'>MOVIMIENTO USUARIOS</Button>
                <Button onClick={() => navegar('/usuarios')} className='m-2 btn-jsx'>USUARIOS</Button>
                <Button onClick={() => navegar('/reportes')} className='m-2 btn-jsx'>REPORTES</Button>
                <Button onClick={() => navegar('/corte')} className='m-2 btn-jsx'>DETALLE VENTAS</Button>  
                <Button onClick={() => navegar('/stock')} className='m-2 btn-jsx '>STOCK</Button>  
                <Button onClick={() => navegar('/productos')} className='m-2 btn-jsx '>PRODUCTOS</Button>
                <Button onClick={() => navegar('/configuracion')} className='m-2 btn-jsx '>PROVEEDORES</Button>
                <Button onClick={() => navegar('/metodoPago')} className='m-2 btn-jsx '>METODO PAGO</Button>
                
              </>
            )}
            {rolUsuario === 'admin' ||  rolUsuario === 'encargado'  && (
              <>      
                <Button onClick={() => navegar('/corte')} className='m-2 btn-jsx'>DETALLE VENTAS</Button>    
                <Button onClick={() => navegar('/corteC')} className='m-2 btn-jsx '>CORTE COMPRA</Button>      
                <Button onClick={() => navegar('/productos')} className='m-2 btn-jsx '>PRODUCTOS</Button>
                <Button onClick={() => navegar('/compra')} className='m-2 btn-jsx '>COMPRA</Button>
                <Button onClick={() => navegar('/configuracion')} className='m-2 btn-jsx '>PROVEEDORES</Button>
                <Button onClick={() => navegar('/metodoPago')} className='m-2 btn-jsx '>METODO PAGO</Button>
                <Button onClick={() => navegar('/stock')} className='m-2 btn-jsx '>STOCK</Button> 
              </>
            )}
          </Nav>
          <Nav className='ms-auto'>
            <Button onClick={handleShowModal} className='btn-cerrarT'>
              <FontAwesomeIcon icon={faDoorOpen} style={{ marginRight: '5px', width: '30px' }} />CERRAR TURNO
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
              <div className='container-fluid datos'>
                <div className='row'>
                  <div className='col'><h5>USUARIO: {nombreUsuario}</h5></div>
                  <div className='col'><h5>SUCURSAL: {nombreSucursal}</h5></div>
                  <div className='col'><h5>CAJA: {IdCaja}</h5></div>
                  <div className='col'><h5>{time.toLocaleString()}</h5></div>        
                </div>
              </div>
              
            
       
          <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton className="border-0">
    <Modal.Title className="fw-bold" style={{ letterSpacing: "1px" }}>
      SALIR
    </Modal.Title>
  </Modal.Header>

  <Modal.Body style={{ paddingTop: "0px" }}>

    {/* PLATA EN CAJA */}
    <h5 className="mb-3 text-secondary" style={{ fontWeight: 500 }}>
      PLATA EN CAJA:
      <strong className="ms-2 text-success">{formatCurrency(total_cierre)}</strong>
    </h5>

    {/* INPUT */}
    <MDBInputGroup className="mb-2 shadow-sm" style={{ borderRadius: "10px" }}>
      <span className="input-group-text bg-white border-end-0">
        <FontAwesomeIcon icon={faDollar} size="lg" style={{ color: "#012541" }} />
      </span>

      <input
        className="form-control border-start-0"
        type="text"
        placeholder="Ingrese la cantidad de plata en caja"
        value={cantidadPlataCaja}
        onChange={(e) => setCantidadPlataCaja(e.target.value)}
        style={{ background: "#f8fafc" }}
      />
    </MDBInputGroup>

    {/* VALIDACIONES */}
    {cantidadPlataCaja && parseFloat(cantidadPlataCaja) < total_cierre && (
      <p className="text-danger small mt-1">¡Está faltando plata y se verá en tu corte!</p>
    )}

    {calcularFaltante() === 0 && (
      <p className="text-success small mt-1">¡Gracias, todo en orden!</p>
    )}

    {/* TABLA DE APERTURA/EGRESO/INGRESO */}
    <h6 className="fw-bold mt-4 mb-2">Resumen de Caja</h6>
   <table className="table table-sm table-striped table-light shadow-sm">
      <tbody>
        <tr>
          <td className="fw-semibold">Apertura de caja</td>
          <td className="text-end fw-bold text-success"> + {formatCurrency(plataApertura)}</td>
        </tr>
        <tr>
          <td className="fw-semibold">Egreso de caja</td>
          <td className="text-end fw-bold text-danger"> - {formatCurrency(plataEgreso)}</td>
        </tr>
        <tr>
          <td className="fw-semibold">Ingreso de caja</td>
          <td className="text-end fw-bold text-success"> + {formatCurrency(plataIngreso)}</td>
        </tr>
      </tbody>
    </table>


  <hr />

    {/* TABLA DE MÉTODOS DE PAGO */}
    <h6 className="fw-bold mt-4 mb-2">Métodos de Pago</h6>
    <table className="table table-sm table-striped shadow-sm">
      <tbody>
        {metoPago.map((tipo) => {

          const iconMap = {
            1: faMoneyBillWave,       // EFECTIVO
            4: faMobileAlt,       // EFECTIVO
            5: faUser, // A CREDITO
            7: faCreditCard,      // TARJETA
            8: faCreditCard,      // TARJETA 
            6: faWallet               // MIXTO
          };

          return (
            <tr key={tipo.Id_metodoPago}>
              <td className="fw-semibold d-flex align-items-center gap-2">
                <FontAwesomeIcon 
                  icon={iconMap[tipo.Id_metodoPago] || faWallet}
                  className="text-secondary"
                />
                {tipo.tipo_metodoPago}
              </td>

             <td className={`text-end fw-bold ${ tipo.Id_metodoPago === 5 ? "text-warning" : "text-success"}`}>
                {formatCurrency(tipo.total_ventas_metodo)}
             </td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {/* FALTANTE */}
    <h5 className="mt-3">
      FALTANTE:{" "}
      <strong className={calcularFaltante() === 0 ? "text-success" : "text-danger"}>
        {formatCurrency(calcularFaltante())}
      </strong>
    </h5>

    {/* BOTÓN SALIR */}
    <div className="mt-3 text-center">
      <Button
        onClick={cerrarCaja}
        variant="outline-danger"
        className="px-4 py-2 fw-bold"
        style={{
          borderRadius: "12px",
          letterSpacing: "1px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "0 auto"
        }}
      >
        <FontAwesomeIcon icon={faDoorOpen} size="lg" />
        SALIR
      </Button>
    </div>
  </Modal.Body>

  <Modal.Footer className="border-0">
    <Button variant="danger" onClick={handleCloseModal} className="px-3">
      CERRAR
    </Button>
  </Modal.Footer>

  {cantidadPlataCaja && cantidadPlataCaja === total_cierre && (
    <p className="text-success text-center small mb-3">¡Bien hecho!</p>
  )}
</Modal>


    
        </>

  )
}

export default App
