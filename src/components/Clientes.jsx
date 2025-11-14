import  { useContext, useEffect, useState } from 'react'
import App from '../App'
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  MDBInputGroup,
} from 'mdb-react-ui-kit';
import Pagination from "react-bootstrap/Pagination";
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faDollar } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../context/DataContext.jsx';



 const Clientes = () =>{

  const[Id_cliente,setIdCliente] = useState();
  const[nombre_cliente,setNombreCliente] = useState("");
  const[apellido_cliente,setApellidoCliente] = useState("");
  const[telefono_cliente,setTelefonoCliente] = useState("");
  const[domicilio_cliente,setDomicilioCliente] = useState("");
  const [montoCredito, setMontoCredito] = useState("")
  const [LimiteCredito, setLimiteCredito] = useState("")
  const [editarCliente, setEditarCliente] = useState(false)  
  
  
  const {  URL } = useContext(DataContext);

  const[buscar,setBuscar] = useState();
  const[ver,setVer] = useState([]);
  const buscador = (e) => {
    setBuscar(e.target.value)
  }

  let resultado = []
  if (!buscar) {
    resultado = ver
  } else {
    resultado = ver.filter((dato) =>
      dato.nombre_cliente.toLowerCase().includes(buscar.toLowerCase())
    )
  }

//PAGINACION (Estados para controlar la pagina actual y la cantidad x pagina)
const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 3;

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
const clientesPaginados = resultado.slice(inicio, fin);



  /**********VER CLIENTES************/
 const verClientes = () => {
  const sucursalId = localStorage.getItem('sucursalId');
  axios.get(`${URL}clientes/${sucursalId}`)
    .then(response => {
      setVer(response.data);
    });
}

 
  
  /*********CREAR CLIENTES************/
  
  const agregarClientes = () =>{
    if (nombre_cliente.length === 0 ||  apellido_cliente.length === 0 ||  telefono_cliente.length === 0 
      ||  domicilio_cliente.length === 0  || montoCredito.length === 0 || LimiteCredito.length === 0
    ){
        alert('Debe completar todos los campos')
    }else if(LimiteCredito.length > 6){
          alert('El limite de credito es demasiado grande')
    }else{
    const sucursalId = localStorage.getItem('sucursalId');
      axios.post(`${URL}clientes/crear`,{
        Id_cliente:Id_cliente,
        nombre_cliente:nombre_cliente,
        apellido_cliente:apellido_cliente,
        telefono_cliente:telefono_cliente,
        domicilio_cliente:domicilio_cliente,
        montoCredito: montoCredito,
        LimiteCredito: LimiteCredito,
        Id_sucursal: sucursalId
      }).then(()=>{
        verClientes()
        limpiarCampos()
        Swal.fire({
          title: " <strong>Agregacion exsitosa!</strong>",
          html: "<i>El cliente <strong> "+nombre_cliente+" </strong> fue agregado con exito</i>",
          icon: 'success',
          timer:3000
        })       
      });  
    }
    
  }

  /*********EDITAR CLIENTES************/
  const editarClientes = () =>{
    axios.put(`${URL}clientes/put/${Id_cliente}`,
    {    
        Id_cliente:Id_cliente,
        nombre_cliente:nombre_cliente,
        apellido_cliente:apellido_cliente,
        telefono_cliente:telefono_cliente,
        domicilio_cliente:domicilio_cliente,
        montoCredito: montoCredito,
        LimiteCredito: LimiteCredito
    }).then(()=>{
        verClientes()
        limpiarCampos()
        Swal.fire({
            title: " <strong>Actualizacion exsitosa!</strong>",
            html: "<i>El cliente <strong> "+nombre_cliente+" </strong> fue actualizado con exito</i>",
            icon: 'success',
            timer:3000
          })       
    });
}



const seeClientes = (val) =>{
  setEditarCliente(true)
  setIdCliente(val.Id_cliente)
  setNombreCliente(val.nombre_cliente)
  setApellidoCliente(val.apellido_cliente)
  setTelefonoCliente(val.telefono_cliente)
  setDomicilioCliente(val.domicilio_cliente)
  setMontoCredito(val.montoCredito)
  setLimiteCredito(val.LimiteCredito)
}

const limpiarCampos = () =>{
  setEditarCliente(false)
  setNombreCliente('')
  setApellidoCliente('')
  setTelefonoCliente('')
  setDomicilioCliente('')
  setMontoCredito('')
  setLimiteCredito('')
}

const Eliminar = (val) =>{
  axios.put(`${URL}clientes/delete/${val.Id_cliente}`).then(()=>{
    alert("Cliente Eliminado con exito")
    verClientes()
  }).catch((error)=>{
    console.log('Error al eliminar el cliente', error)
  })
}



  // FUNCION PARA PASAR A PESOS ARG
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };
 

  useEffect(() => {
    verClientes()
  }, [])

  return (
    <>
    <App/>
    <div className='h3-ventas'>
    <h1>CLIENTES</h1>
    </div>
    <br />
    <h2><strong>ADMINISTRACION DE CLIENTES</strong></h2>
    <h4>
      Administra a todos los clientes de tu negocio(credito,facturacion,etc.)
      de forma centralizada.
    </h4>
  <div className="container-fluid">
    <div className='container'>
    <div className="row">
      <div className="col-3">
      </div>
      <div className="col-">
        <br /> <br />
        <div className="container-fluid">

        <MDBInputGroup className='mb-3'>
        <span className="input-group-text">
          <FontAwesomeIcon icon={faUsers} size="lg" style={{color: "#FF914D",}} />
        </span>
          <input className='form-control' type='text' placeholder="Nombre"  value={nombre_cliente} onChange={(e) => setNombreCliente(e.target.value)}/>
        </MDBInputGroup>

        <MDBInputGroup className='mb-3' >
        <span className="input-group-text">
          <FontAwesomeIcon icon={faUsers} size="lg" style={{color: "#FF914D",}} />
        </span>
          <input className='form-control' type='text' placeholder="Apellido" value={apellido_cliente} onChange={(e) => setApellidoCliente(e.target.value)}/>
        </MDBInputGroup>

        <MDBInputGroup className='mb-3' >
        <span className="input-group-text">
          <FontAwesomeIcon icon={faPhone} size="lg" style={{color: "#FF914D",}} />
        </span>
          <input className='form-control' type='number' placeholder="Telefono" value={telefono_cliente} onChange={(e) => setTelefonoCliente(e.target.value)}/>
        </MDBInputGroup>
        
        <MDBInputGroup className='mb-3' >
        <span className="input-group-text">
          <FontAwesomeIcon icon={faHouse} size="lg" style={{color: "#FF914D",}} />
        </span>
          <input className='form-control' type='text' placeholder="Domicilio" value={domicilio_cliente} onChange={(e) => setDomicilioCliente(e.target.value)}/>
        </MDBInputGroup>

        <MDBInputGroup className='mb-3' textAfter='.00' >
        <span className="input-group-text">
          <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#FF914D",}} />
        </span>
          <input className='form-control' type='number' placeholder="Credito"  value={montoCredito} onChange={(e) => setMontoCredito(e.target.value)}/>
        </MDBInputGroup>

        <MDBInputGroup className='mb-3' textAfter='.00' >
        <span className="input-group-text">
          <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#FF914D",}} />
        </span>
          <input className='form-control' type='number' placeholder="Limite de credito"  value={LimiteCredito} onChange={(e) => setLimiteCredito(e.target.value)}/>
        </MDBInputGroup>


              <div className='card-footer text-muted'>
                {
                editarCliente ? 
                <div >
                <Button className="btn btn-warning m-2" onClick={editarClientes}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon> EDITAR CLIENTE</Button>
              
                <Button className="btn btn-danger m-2" onClick={limpiarCampos}><FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
                </div> 
                :
              
                    <div > 
                    <Button className="btn btn-success m-2" onClick={agregarClientes}><FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR CLIENTE</Button>
                    </div> 
                }

                  
                 
              </div>




              <br /><br />
              <MDBInputGroup>
              <span className="input-group-text">
                      <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" style={{color: "#FF914D",}} />
                  </span>
              <input value={buscar} onChange={buscador} type="text" placeholder='Busca un cliente...' className='form-control'/>
              </MDBInputGroup>
          </div>



          <div className='container table'>
          <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
              <thead className='custom-table-header'>
                  <tr>
                      <th>NOMBRE</th>
                      <th>APELLIDO</th>
                      <th>TELEFONO</th>
                      <th>DOMICILIO</th>
                      <th>CREDITO</th>
                      <th>LIMITE CREDITO</th>
                      <th>EDITAR</th>
                       <th>ELIMINAR</th>
                  </tr>
              </thead>
              <tbody>
                  {
                      clientesPaginados.map((val) => (
                          <tr key={val.Id_cliente}>
                              <td>{val.nombre_cliente}</td>
                              <td>{val.apellido_cliente}</td>
                              <td>{val.telefono_cliente}</td>
                              <td>{val.domicilio_cliente}</td>
                              <td><strong>{formatCurrency(val.montoCredito)}</strong></td>
                              <td><strong>{formatCurrency(val.LimiteCredito)}</strong></td>              
                              <td className=''  aria-label="Basic example">
                                   <Button className='btn btn-primary m-2' onClick={()=>{seeClientes(val)}}> SELECCIONAR </Button>
                              </td>
                              <td><Button variant='danger' onClick={()=>Eliminar(val)}>ELIMINAR </Button></td>
                          </tr>
                      ))
                  }
              </tbody>
          </table> 
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
  )

}
export default Clientes
