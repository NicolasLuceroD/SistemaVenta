/* eslint-disable no-unused-vars */
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Button } from 'react-bootstrap';
import App from "../App";
import {
    MDBInputGroup,
  } from 'mdb-react-ui-kit';
  import Form from 'react-bootstrap/Form';
  import Pagination from "react-bootstrap/Pagination";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../context/DataContext";
import Swal from "sweetalert2";

const Usuarios = () => {

//ESTADOS 
    const [usuarios, setUsuarios] = useState([])
    const [Id_usuario, setIdUsuario] = useState("")
    const [nombre_usuario, setNombreUsuario] = useState("")
    const [clave_usuario, setClaveUsuario] = useState("")
    const [editarUsuarios, setEditarUsuarios] = useState(false)  
    const [rol, setRol] = useState('0'); 
    const {  URL } = useContext(DataContext);
   
    const Id_sucursal = localStorage.getItem("sucursalId")


    const verUsuarios = () =>{
        axios.get(`${URL}usuarios/sucursal/${Id_sucursal}`)
        .then((response) => {
            setUsuarios(response.data);
        })
        .catch((error) => {
            console.log('Error al obtener los usuarios:', error);
        });
    }

const crearUsuarios = () =>{ 
   const rol = (document.getElementById("usuariosRol").value) 
    if  (!nombre_usuario || !clave_usuario || rol <= 0 ){ 
       Swal.fire({
          icon: 'warning',
          title: 'Atencion',
          text: 'Por favor debe completar todos los campos',
          timerProgressBar: true,
          timer: 2500
        })
    } else
    {
        axios.post(`${URL}usuarios/post`,{
        nombre_usuario: nombre_usuario,
        clave_usuario: clave_usuario,
        rol_usuario: rol,
        Id_sucursal: Id_sucursal
        }).then(()=>{
           Swal.fire({
                     title: " <strong>Agregacion exitosa!</strong>",
                     html: "<i>El usuario <strong> "+nombre_usuario+" </strong> fue agregado con exito</i>",
                     icon: 'success',
                     timer:3000
                   })    
            limpiarCampos()
            verUsuarios()
        }).catch((error)=>{
            console.log('casi pero no post', error)
        })
    }   
}

    const editarUsuario = () =>{
        const rol = parseInt(document.getElementById("usuariosRol").value)  
        if(rol === 0){
            alert("Debes elegir un rol para el usuario")
        }else{  
        axios.put(`${URL}usuarios/put/${Id_usuario}`,{
            nombre_usuario: nombre_usuario,
            clave_usuario: clave_usuario,
            rol_usuario: document.getElementById("usuariosRol").value,
            Id_sucursal: Id_sucursal
        }).then(()=>{
            alert('Usuario editado con exito')
            limpiarCampos()
        }).catch((error)=>{
            console.log('casi pero no en el put',error)
        })
        }
    }

    const Eliminar = (val) =>{
        axios.put(`${URL}usuarios/delete/${val.Id_usuario}`).then(()=>{
            alert("Usuario Eliminado con exito")
            verUsuarios()
        }).catch((error)=>{
            console.log('Error al eliminar el usuario', error)
        })
    }


    const seeUsuarios = (val) =>{
        setRol(val.rol)                            
        setEditarUsuarios(true)
        setIdUsuario(val.Id_usuario)
        setNombreUsuario(val.nombre_usuario),
        setClaveUsuario(val.clave_usuario)
    }

    const limpiarCampos = () =>{
        setEditarUsuarios(false)
        setNombreUsuario('')
        setClaveUsuario('')
        setRol('0')
    }

    //PAGINACION (Estados para controlar la pagina actual y la cantidad x pagina)
const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 3;

const totalPaginas = Math.ceil(usuarios.length / elementosPorPagina);

let items = [];


const mostrarPaginacion = usuarios.length > elementosPorPagina;

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
const usuariosPaginados = usuarios.slice(inicio, fin);

    useEffect(()=>{
        verUsuarios()
    },[])


  return (
<>
    <App/>

    <div className="h3-ventas">
        <h1>USUARIOS</h1>
    </div>   <br />
     <div className="container">
              <div className= "row">
                <div className= "col">
                    <h2><strong>ADMINISTRACION DE USUARIOS</strong></h2>
                    <h4>Gestiona todos tus usuarios y sus roles de forma centralizada</h4>   
                </div>
              </div>
      </div><br />
       <div className="container-fluid">
        <div className="container">
       <MDBInputGroup className='mb-3'>
       <span className="input-group-text">
                        <FontAwesomeIcon icon={faUser} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='text' placeholder="Nombre" value={nombre_usuario} onChange={(e) => setNombreUsuario(e.target.value)}/>
          </MDBInputGroup>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faLock} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='text' placeholder="Clave"  value={clave_usuario} onChange={(e) => setClaveUsuario(e.target.value)} />
          </MDBInputGroup>
              
          <h4 style={{display:'flex', flexDirection:'flex-start', marginTop:'50px'}}> ROL </h4 >
          <MDBInputGroup>
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faUserGear} size="lg" style={{color: "#01992f",}} />
                </span>
          <Form.Select aria-label="Tipo de venta"  value={rol} onChange={(e)=>setRol(e.target.value)}  key={Id_usuario} id="usuariosRol"  >
                <option value="0" disabled selected>Selecciona un rol</option>
                <option value="admin">admin</option>
                <option value="empleado">empleado</option>
                <option value="encargado">encargado</option>
          </Form.Select>
          </MDBInputGroup>

              <br />
             
              <div className='card-footer text-muted'>
                  {
                  editarUsuarios ? 
                  <div >
                  <Button className="btn btn-warning m-2" onClick={editarUsuario}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon> EDITAR USUARIO</Button>
                
                  <Button className="btn btn-danger m-2" onClick={limpiarCampos}><FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
                  </div> 
                  :
                
                      <div > 
                      <Button className="btn btn-success m-2" onClick={crearUsuarios} ><FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR USUARIO</Button>
                      </div> 
                  }

                    
                   
                </div>
            </div>

           <div className="container table">
            <table className='table table-striped table-hover mt-5 shadow-lg'>
            <thead className='custom-table-header'>
                    <tr className='table-info'>
                        <th>NOMBRE</th>
                        <th>CLAVE</th>
                        <th>ROL</th>
                        <th>EDITAR</th>
                        <th>ELIMINAR</th> 
                    </tr>
                </thead>
                <tbody>
                    {
                        usuariosPaginados.map((val) => (
                            <tr key={val.Id_usuario}>                  
                                <td>{val.nombre_usuario}</td>
                                <td>{val.clave_usuario}</td>
                                <td>{val.rol_usuario}</td>
                                <td><Button className="btn btn-primary" onClick={()=>seeUsuarios(val)}>SELECCIONAR</Button></td>
                                <td><Button variant="danger" onClick={()=>Eliminar(val)}>ELIMINAR</Button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Pagination size='xl'>{items}</Pagination>
      </div>
      </div>
    </>
  )
}

export default Usuarios
