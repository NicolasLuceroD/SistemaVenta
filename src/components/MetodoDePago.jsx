import axios from "axios"
import { useContext, useEffect, useState } from "react"
import App from "../App"
import { Button } from "react-bootstrap"
import {
  MDBInputGroup,
} from 'mdb-react-ui-kit';
import Pagination from "react-bootstrap/Pagination";
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../context/DataContext.jsx';

const MetodoDePago = () => {

  const[verMetodoPago, setVerMetodoPago] = useState([])
  const[tipo_metodoPago, setTipoMetodoPago] = useState("")
  const[Id_metodoPago, setId_metodoPago] = useState("")
  const [editarMetodoPago, setEditarmetodoPago] = useState(false)  

  const {  URL } = useContext(DataContext);

  const verMetodos = () =>{
    axios.get(`${URL}metodopago`).then((response)=>{
      setVerMetodoPago(response.data)
    })
  }


  const crearMetodo = () =>{
    if(tipo_metodoPago.length === 0){
      alert("Debes insertar un metodo de pago")
    }else{
      axios.post(`${URL}metodopago/post`,{
        tipo_metodoPago: tipo_metodoPago
      }).then(()=>{
        verMetodos()
        alert("Metodo de pago creado con exito")
        limpiarCampos()
      })
    }
  
  }



  const editarMetodo = () =>{
    axios.put(`${URL}metodopago/put/${Id_metodoPago}`,{
      Id_metodoPago: Id_metodoPago,
      tipo_metodoPago: tipo_metodoPago
    }).then(()=>{
      verMetodos()
      alert("Metodo de pago actualizado con exito")
      limpiarCampos()
    }).catch((error)=>{
      console.log('Eror al editar el metodo de pago',error)
    })
  }


  const verLosMetodos = (metodos) =>{
    setEditarmetodoPago(true)
    setId_metodoPago(metodos.Id_metodoPago)
    setTipoMetodoPago(metodos.tipo_metodoPago)
  }
  const limpiarCampos = () =>{
    setEditarmetodoPago(false)
    setId_metodoPago("")
    setTipoMetodoPago("")
  }

  useEffect(()=>{
    verMetodos()
  },[])


   //PAGINACION (Estados para controlar la pagina actual y la cantidad x pagina)
   const [paginaActual, setPaginaActual] = useState(1);
   const elementosPorPagina = 6;
   
   const totalPaginas = Math.ceil(verMetodoPago.length / elementosPorPagina);
   
   let items = [];
   
   
   const mostrarPaginacion = verMetodoPago.length > elementosPorPagina;
   
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
   const metodopagoPaginados = verMetodoPago.slice(inicio, fin);


  return (
  
    <>
  <App/>
  <div className="h3-ventas">
  <h1>METODO DE PAGO</h1>
</div>
<div className="container"><br />
              <div className= "row">
                <div className= "col">
                    <h2><strong>ADMINISTRACION DE PAGOS</strong></h2>
                    <h4>Gestiona todos los metodos de pago en tu negocio</h4>   
                </div>
              </div>
  <br/>  <br/> 
  <MDBInputGroup className='mb-3'>
  <span className="input-group-text">
                  <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#FF914D",}} />
          </span>
      <input className='form-control' type='text' placeholder="Nombre" value={tipo_metodoPago} onChange={(e) => setTipoMetodoPago(e.target.value)}/>
    </MDBInputGroup>
       
</div>
<br/>

<div className='card-footer text-muted'>
            {
            editarMetodoPago ? 
            <div >
            <Button className="btn btn-warning m-2" onClick={editarMetodo}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon> EDITAR</Button>
          
            <Button className="btn btn-danger m-2" onClick={limpiarCampos}><FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
            </div> 
            :
          
                <div > 
                <Button className="btn btn-success m-2" onClick={crearMetodo}><FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR</Button>
                </div> 
            }

              
             
          </div>

  <div className="container table">
  <table className='table table-striped table-hover mt-5 shadow-lg'>
  <thead className='custom-table-header'>
              <tr>
                  <th>FOLIO</th>
                  <th>NOMBRE METODO PAGO</th>                    
                  <th>OPCION</th>                    
              </tr>
          </thead>
          <tbody>
             {metodopagoPaginados.map((metodos) =>(
              <tr  key={metodos.Id_metodoPago}>
               <td>{metodos.Id_metodoPago}</td>
                <td>{metodos.tipo_metodoPago}</td>
                <td><Button className="btn btn-primary" onClick={()=>verLosMetodos(metodos)}>SELECCIONAR</Button></td>
              </tr>
                  
               ))}
          </tbody>
      </table>
  </div>

 
      <div style={{ display: 'flex', justifyContent: 'center' }}>
  <Pagination size='xl'>{items}</Pagination>
  <br />
</div>

</>
  )
}

export default MetodoDePago
