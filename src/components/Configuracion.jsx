import {  useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap';
import App from '../App';
import {
  MDBInputGroup,
} from 'mdb-react-ui-kit';
import Pagination from "react-bootstrap/Pagination";
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../context/DataContext.jsx';
import Swal from 'sweetalert2';




export default function Configuracion() {

   const [verProveedores, setVerProveedores] = useState([])
   const [descripcion_proveedor, setdDescripcion_proveedor] = useState("")
   const [numTel_proveedor, setNumTel_proveedor] = useState("")
   const [nombre_proveedor, setNombre_proveedor] = useState("")
   const [Id_proveedor, setId_proveedor] = useState("")
   const[buscar,setBuscar] = useState();
   const [editarProveedores, setEditarProveedores] = useState(false)  

   const {  URL } = useContext(DataContext);

   const buscador = (e)=>{
     setBuscar(e.target.value)
   }
   
   let resultado = []
    if(!buscar)
    {
      resultado = verProveedores
   }else{  
      resultado = verProveedores.filter((dato) =>
      dato.nombre_proveedor.toLowerCase().includes(buscar.toLocaleLowerCase())) 
 }

 const seeProveedores= (val) =>{
  setEditarProveedores(true)
  setId_proveedor(val.Id_proveedor)
  setNombre_proveedor(val.nombre_proveedor)
  setdDescripcion_proveedor(val.descripcion_proveedor)
  setNumTel_proveedor(val.numTel_proveedor)
 }
 const limpiarCampos= () =>{
  setEditarProveedores(false)
  setId_proveedor("")
  setNombre_proveedor("")
  setdDescripcion_proveedor("")
  setNumTel_proveedor("")
 }

   const verLosProveedores = () =>{
    axios.get(`${URL}proveedores`).then((response)=>{
      setVerProveedores(response.data)
    })
   }

   const crearProveedores = () =>{
    if(nombre_proveedor.length === 0 || descripcion_proveedor === 0 || numTel_proveedor === 0){
       Swal.fire({
                 icon: 'warning',
                 title: 'Atencion',
                 text: 'Por favor debe completar todos los campos',
                 timerProgressBar: true,
                 timer: 2500
               })
    }else{
      axios.post(`${URL}proveedores/post`,{
        nombre_proveedor: nombre_proveedor,
        descripcion_proveedor: descripcion_proveedor,
        numTel_proveedor: numTel_proveedor
      }).then(()=>{
        Swal.fire({
                 title: " <strong>Agregacion exitosa!</strong>",
                 html: "<i>El proveedor <strong> "+nombre_proveedor+" </strong> fue agregado con exito</i>",
                 icon: 'success',
                 timer:3000
               })   
        verLosProveedores()
        limpiarCampos()
      }).catch(()=>{
        console.log('error al crear proveedor')
      })
    }
   
   }


   const editarProveedor = () =>{
    axios.put(`${URL}proveedores/put/${Id_proveedor}`,
    {
      Id_proveedor: Id_proveedor,
      nombre_proveedor: nombre_proveedor,
      descripcion_proveedor: descripcion_proveedor,
      numTel_proveedor: numTel_proveedor

    }).then(()=>{
      alert('Proveedor editado con exito')
      verLosProveedores()
      limpiarCampos()
    }).catch((error)=>{
      console.log('error al editar proveedor',error)
  
    })
   }


   const Eliminar = (val) =>{
    axios.put(`${URL}proveedores/delete/${val.Id_proveedor}`).then(()=>{
      alert("Proveedor eliminado con exito")
      verLosProveedores()
    }).catch((error)=>{
      console.log('Error al eliminar un proveedor', error)
    })
   }

const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 3;

const totalPaginas = Math.ceil(verProveedores.length / elementosPorPagina);

let items = [];


const mostrarPaginacion = verProveedores.length > elementosPorPagina;

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
const proveedoresPaginados = resultado.slice(inicio, fin);



useEffect(()=>{
  verLosProveedores()
},[verProveedores])


    return (
<>
        <App/>
      
        <div className='h3-ventas'>
          <h1>PROVEEDORES</h1>
        </div>
          <br />
            <h2><strong>ADMINISTRACION DE PROVEEDORES</strong></h2>
            <h4>Gestiona todos los proveedores de tus pedidos</h4> <br /> 
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
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                    </span>
            <input className='form-control' type='text' placeholder="Nombre"  value={nombre_proveedor} onChange={(e) => setNombre_proveedor(e.target.value)}/>
          </MDBInputGroup>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                    </span>
            <input className='form-control' type='text' placeholder="Descripcion" value={descripcion_proveedor} onChange={(e) => setdDescripcion_proveedor(e.target.value)} />
          </MDBInputGroup>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faPhone} size="lg" style={{color: "#01992f",}} />
                    </span>
            <input className='form-control' type='number' placeholder="Telefono" value={numTel_proveedor} onChange={(e) => setNumTel_proveedor(e.target.value)} />
          </MDBInputGroup>
                
          <div className='card-footer text-muted'>
                  {
                  editarProveedores ? 
                  <div >
                    <Button className="btn btn-warning m-2" onClick={editarProveedor}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon> EDITAR PROVEEDOR</Button>
                
                    <Button className="btn btn-danger m-2" onClick={limpiarCampos}> <FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
                  </div> 
                  :      
                  <div > 
                    <Button className="btn btn-success m-2" onClick={crearProveedores}><FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR PROVEEDOR</Button>
                  </div> 
                  }

                </div>
                <MDBInputGroup>
                <span className="input-group-text">
                        <FontAwesomeIcon icon={faTruck} size="lg" style={{color: "#01992f",}} />
                    </span>
                  <input value={buscar} onChange={buscador} type="text" placeholder='Busca un porveedor...' className='form-control'/>
                  </MDBInputGroup>
              </div>
              <div className='container table'>
              <table className='table table-striped table-hover mt-5 shadow-lg'>
              <thead className='custom-table-header'>
                      <tr>
                          <th>NOMBRE</th>
                          <th>DESCRIPCION</th>
                          <th>TELEFONO</th>
                          <th>EDITAR</th>
                          <th>ELIMINAR</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          proveedoresPaginados.map((val) => (
                              <tr key={val.Id_proveedor}>
                                  <td>{val.nombre_proveedor}</td>
                                  <td>{val.descripcion_proveedor}</td>
                                  <td>{val.numTel_proveedor}</td>               
                                  <td  aria-label="Basic example">
                                       <Button type='button' className='btn btn-primary' onClick={()=>{seeProveedores(val)}}> SELECCIONAR </Button>
                                  </td>
                                  <td>
                                    <Button variant='danger' onClick={()=>Eliminar(val)}>ELIMINAR</Button>
                                  </td>
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
