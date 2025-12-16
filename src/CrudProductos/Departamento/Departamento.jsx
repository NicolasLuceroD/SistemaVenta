import { Button } from "react-bootstrap"
import Productos from "../../components/Productos"
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import {
  MDBInputGroup,
} from 'mdb-react-ui-kit';
import Pagination from "react-bootstrap/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faBan, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from "../../context/DataContext";
import ScrollToTopButton, { scrollToTop } from "../../components/utils/ScrollToTopButton"
import Swal from "sweetalert2";

const Departamento = () => {

  const [verCategoria,setVerCategoria] = useState([])
  const [Id_categoria,setIdCategoria] = useState ("")
  const [nombre_categoria, setNombreCategoria] = useState('')
  const [descripcion_categoria, setdescripcionCategoria] = useState('')

  const [editCat, setEditarCat] = useState(false)  
  const {  URL } = useContext(DataContext);

  const seeCategoria = () => {
    axios.get(`${URL}categorias`).then((response)=>{
      setVerCategoria(response.data)
    })
  }
  function refreshPage() {
    window.location.reload();
  }
  const crearCategoria = () =>{
    if(nombre_categoria.length === 0 || descripcion_categoria.length === 0){
      alert("Debes completar todos los campos")
      return
    }
    axios.post(`${URL}categorias/post`,
    {
      nombre_categoria: nombre_categoria,
      descripcion_categoria: descripcion_categoria
    }
    ).then(()=>{
      seeCategoria()
      alert("Departamento creado con exito")
      limpiarCampos()
      refreshPage()
    }).catch((error)=>{
      console.log("casi pero no", error)
    })
  }



  const editarCategoria = () => {
    axios.put(`${URL}categorias/put/${Id_categoria}`,
    {
      Id_categoria: Id_categoria,
      nombre_categoria: nombre_categoria,
      descripcion_categoria: descripcion_categoria

    }).then(()=>{
      limpiarCampos()
      alert("Departamento actualizado con exito" )
      seeCategoria()
      setEditarCat(false)
      refreshPage()

    }).catch((error)=>{
      console.log(error)
    })
  }

  const Eliminar = (val) => {
  Swal.fire({
    title: '¿Eliminar categoría?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .put(`${URL}categorias/delete/${val.Id_categoria}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Categoría eliminada',
            text: 'La categoría fue eliminada correctamente.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          seeCategoria();
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la categoría.'
          });
          console.log('Error al eliminar ', error);
        });
    }
  });
};



  const updateCategoria = (val) =>{
   setEditarCat(true)
   setIdCategoria(val.Id_categoria)
   setNombreCategoria(val.nombre_categoria)
   setdescripcionCategoria(val.descripcion_categoria)
   scrollToTop()
  }

  const limpiarCampos = () =>{
    setEditarCat(false)
    setIdCategoria("")
    setNombreCategoria("")
    setdescripcionCategoria("")
    console.log('se limpio')
  }




  useEffect(()=>{
    seeCategoria()
  },[])

//PAGINACION (Estados para controlar la pagina actual y la cantidad x pagina)
const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 3;

const totalPaginas = Math.ceil(verCategoria.length / elementosPorPagina);

let items = [];


const mostrarPaginacion = verCategoria.length > elementosPorPagina;

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
const departamentosPaginados = verCategoria.slice(inicio, fin);

  return (
<>
    
    <Productos/> <br />
        <div className="container-fluid">
        <div className="container">
        <br />
            <h2><strong>ADMINISTRACION DEPARTAMENTOS</strong></h2>
            <h4>Gestiona todos los departamentos de tu negocio</h4> <br /> 
            <MDBInputGroup className='mb-3'>
            <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='text' placeholder="Nombre"  value={nombre_categoria} onChange={(e)=> setNombreCategoria(e.target.value)} />
          </MDBInputGroup>

          <MDBInputGroup className='mb-3' >
          <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                </span>
            <input className='form-control' type='text' placeholder="Descripcion" value={descripcion_categoria} onChange={(e)=> setdescripcionCategoria(e.target.value)} />
          </MDBInputGroup>
          </div> 
         

          <div className='card-footer text-muted'>
                  {
                  editCat ? 
                  <div >
                  <Button className="btn btn-warning m-2" onClick={editarCategoria}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon> EDITAR</Button>
                
                  <Button className="btn btn-danger m-2" onClick={limpiarCampos}><FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
                  </div> 
                  :
                
                  <div > 
                      <Button className="btn btn-success m-2" onClick={crearCategoria}><FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR</Button>
                  </div> 
                  } 
                </div>
        </div>
        <div className="container table">
          <div className="row">
            <div className="col">
              <table className='table table-striped table-hover mt-5 shadow-lg'>
                <thead>
                    <tr className="custom-table-header">
                      <th>FOLIO</th>
                      <th>NOMBRE</th>
                      <th>DESCRIPCION</th>
                      <th>EDITAR</th>
                      <th>ELIMINAR</th>
                 
                    </tr>
                </thead>
                <tbody>
                 {
                  departamentosPaginados.map((val)=>(
                    <tr key={val.Id_categoria}>
                      <td>{val.Id_categoria}</td>
                      <td>{val.nombre_categoria}</td>
                      <td>{val.descripcion_categoria}</td>
                       <td className="text-center">
                          <Button variant="warning" size="md" onClick={() => updateCategoria(val)} title="Editar categoría">
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </Button>
                        </td>
                        <td className="text-center">
                          <Button variant="danger" size="md" onClick={() => Eliminar(val)} title="Editar categoría">
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                    </tr>
                  ))
                 }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination size='xl'>{items}</Pagination>
        <br />
      </div>
      <ScrollToTopButton/>
    </>
  )
}

export default Departamento
