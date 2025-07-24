import  {useNavigate} from 'react-router-dom'
import './App.css'
import { Button, Navbar } from 'react-bootstrap'
import  axios from 'axios'
import { Modal} from 'react-bootstrap';
import { MDBInputGroup } from 'mdb-react-ui-kit';
import { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';


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

  const {  URL } = useContext(DataContext);

      
  const handleShowModal = () => {
    setShowModal(true)
    obtenerDatosCaja()
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




  const obtenerDatosCaja = async () => {
    try {
        const response = await axios.get(`${URL}plataCaja/plataLogin/${id_usuario}/${IdCaja}`);
        if (response.data) {
            setTotalCierre(parseFloat(response.data[0].total_cierre));
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
              
            
       
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>SALIR</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
            
        <h4>PLATA EN CAJA: <strong>{formatCurrency(total_cierre)}</strong></h4>
        <MDBInputGroup className="mb-3">
            <span className="input-group-text">
                <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#012541",}} />
            </span>
            <input 
                className="form-control" 
                type="text" 
                placeholder="Ingrese la cantidad de plata en caja" 
                value={cantidadPlataCaja} 
                onChange={(e) => setCantidadPlataCaja(e.target.value)} 
            />
        </MDBInputGroup>
        {cantidadPlataCaja && parseFloat(cantidadPlataCaja) < total_cierre && (
            <p style={{ color: 'red' }}>¡Esta faltando plata y se vera en tu corte!</p>
        )}
         {calcularFaltante() === 0 && (
            <p style={{ color: 'green' }}>¡Gracias, todo en orden!</p>
        )}
        <h4>FALTANTE: <strong>{formatCurrency(calcularFaltante())}</strong></h4>
        <MDBInputGroup>
            <Button onClick={cerrarCaja} variant="outline-danger">  
                <FontAwesomeIcon icon={faDoorOpen} size="lg" style={{color: "#970202",}} /> 
                SALIR
            </Button>
        </MDBInputGroup>      
    </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleCloseModal}>
                  CERRAR
                </Button>
            </Modal.Footer>{cantidadPlataCaja && cantidadPlataCaja === total_cierre && (
            <p style={{ color: 'green' }}>¡Bien hecho!</p>
        )}
        </Modal>
    
        </>

  )
}

export default App
