/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import { Modal, Button, Table} from 'react-bootstrap';
import { DataContext } from "../context/DataContext";
import styled from "styled-components";
import Badge from '@mui/material/Badge';
import carritoImg from '../assets/logo-carrito.png'
import axios from "axios";
import { MDBInputGroup } from 'mdb-react-ui-kit';
import Productos from '../components/Productos';
import Paginacion from '../components/Paginacion.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faDollar } from '@fortawesome/free-solid-svg-icons';




const Paquete = () => {
    const inputRef = useRef(null);

    const [estadoModal1, setEstadoModal1] = useState(false);
    const [showModal8, setShowModal8] = useState(false);
    const [buscar, setBuscar] = useState("");
    const [buscar2, setBuscar2] = useState("");
    const [cantidadesVendidas, setCantidadesVendidas] = useState(0);
    const [Id_detallePaquete,setId_detallePaquete] = useState("")
    const [showModal9, setShowModal9] = useState(false);
    const [nombre_promocion, setNombrePromocion] = useState("")
    const [precio_paquete, setPrecioPaquete] = useState("")
    const [Id_paquete, setIdPaquete] = useState ("")
    const [paquetes, setPaquetes] = useState([])
    const [editPaquete, setEditPaquete] = useState(false)  





    const { listaCompras, eliminarCompra, agregarCompra,agregarCompras } = useContext(CarritoContext);
    const { productos,URL } = useContext(DataContext);

    
    const handleShowModal8 = () => {
        setShowModal8(true);
      }
      const handleCloseModal8 = () => {
        setShowModal8(false);
      }
    const handleShowModal9 = () => setShowModal9(true);
    const handleCloseModal9 = () => setShowModal9(false)

      const handleShowModal1 = () => setEstadoModal1(true);
      const handleCloseModal1 = () => setEstadoModal1(false);
  


      // PAGINACION
      const productosPorPagina = 5  
      const [actualPagina,setActualPagina] = useState(1)
      const [total, setTotal]=useState(0)
      const ultimoIndex = actualPagina * productosPorPagina;
      const primerIndex = ultimoIndex - productosPorPagina; 






      const calcularTotal = () => {
        return listaCompras.reduce((total, item) => {
          const cantidadVendida = parseFloat(cantidadesVendidas[item.Id_producto]);
          const precioFinalProducto = parseFloat(item.precioCompra) || 0;
      
          return total + (precioFinalProducto * cantidadVendida);
        }, 0);
      };
      

      useEffect(()=>{
        calcularTotal()
        console.log('total:  ', calcularTotal())
      },[])

        const traerUltimoPaquete = () =>{
        axios.get(`${URL}paquete/verIdPaquete`).then((response)=>{
            setIdPaquete(response.data.ultimoIdPaquete)
            console.log('ultima paquete',response.data.ultimoIdPaquete)
        }).catch((error)=>{
            console.log('Error al traer el ultimo paquete', error)
        })
      }


      
      
      //FUNCION PARA CREAR LOS PAQUETES 

      const crearPaquete = () =>{
          axios.post(`${URL}paquete/post`,{
                nombre_promocion: nombre_promocion,
                precio_paquete: precio_paquete,
                estadoPaquete: 1,
                precioCosto: calcularTotal()
            }).then(()=>{
                listaCompras.forEach(producto => {
                axios.post(`${URL}paquete/detallePaquete/post`,{
                    Id_producto: producto.Id_producto,
                    Id_paquete: parseInt(Id_paquete),
                    cantidadProducto: parseFloat(cantidadesVendidas[producto.Id_producto])
                }).catch((error)=>{
                    console.log('Error al crear el detalle del paquete',error)
                })
            });
        }).then(()=>{
            alert("Paquete creado con exito!")
            verTodosLosPaquetes()
            listaCompras.length = 0
            limpiarCampos()
       })  
      }

      const editarPaquete = () => {
        axios.put(`${URL}paquete/put/${Id_paquete}`, {
          nombre_promocion: nombre_promocion,
          precio_paquete: precio_paquete,
          precioCosto: calcularTotal()
        })
        .then((response) => {
          console.log('Id_detallePaquete:', Id_detallePaquete);
          // Obtener el detalle actual del paquete
          axios.get(`${URL}paquete/get/detallePaquete/${Id_detallePaquete}`)
            .then((response) => {
              // Obtener la lista actual de productos del detalle del paquete
              const productosActuales = response.data;
      
              // Agregar el nuevo producto a la lista
              listaCompras.forEach(producto => {
                productosActuales.push({
                  Id_producto: producto.Id_producto,
                  Id_paquete: Id_paquete,
                  cantidadProducto: cantidadesVendidas[producto.Id_producto]
                });
              });
      
              // Actualizar el detalle del paquete con la lista actualizada de productos
              axios.put(`${URL}paquete/put/detallePaquete/${Id_detallePaquete}`, productosActuales)
                .then(() => {
                  console.log('Detalle del paquete editado exitosamente');
                })
                .catch((error) => {
                  console.error('Error al editar el detalle del paquete:', error);
                });
            })
            .catch((error) => {
              console.error('Error al obtener el detalle del paquete:', error);
            });
      
          alert("Paquete editado con éxito!");
          verTodosLosPaquetes()
          limpiarCampos()
        })
        .catch((error) => {
          console.error('Error al editar el paquete:', error);
          alert("Hubo un error al editar el paquete");
        });
      };
      
      
    
    
      




      const verTodosLosPaquetes = () =>{
        axios.get(`${URL}paquete/paqueteCompleto`).then((response)=>{
            setPaquetes(response.data)
            setTotal(response.data.length);
        }).catch((error)=>{
            console.log('Error al obtener los paquetes', error)
        })
      }



        //FILTRO PARA BUSCAR PRODUCTOS
  const buscador = (e) => {
    setBuscar(e.target.value)
  }
  let resultado = []
  if (!buscar) {
    resultado = productos
  } else {
    resultado = productos.filter((dato) =>
      dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase())
    )
  }
        //FILTRO PARA BUSCAR PRODUCTOS
  const buscador2 = (e) => {
    setBuscar2(e.target.value)
  }
  let resultado2 = []
  if (!buscar2) {
    resultado2 = paquetes
  } else {
    resultado2 = paquetes.filter((dato) =>
      dato.nombre_promocion.toLowerCase().includes(buscar2.toLowerCase())
    )
  }


//FUNCION  PARA AGREGAR UN PRODUCTO A LA LISTACOMPRA
const handleAgregar = (compra) => {
    const cantidadActual = cantidadesVendidas[compra.Id_producto];
    if (cantidadActual === undefined) {
      setCantidadesVendidas({ ...cantidadesVendidas, [compra.Id_producto]: 1 });
    } 
    agregarCompra(compra);
    setBuscar("")
    handleCloseModal1(true);
  };

  useEffect(()=>{
    traerUltimoPaquete()
    verTodosLosPaquetes()
  },[])

  useEffect(() => {
    if (showModal8 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal8]);



  const seePaquetes = (val) => { 
    setEditPaquete(true)
    setIdPaquete(val.Id_paquete)
    setNombrePromocion(val.nombre_promocion);
    setPrecioPaquete(val.precio_paquete);
}

  const limpiarCampos = () =>{
    setEditPaquete(false)
    setNombrePromocion("");
    setPrecioPaquete("");
  }



  const eliminarPaquete = (Id_paquete) =>{
    axios.put(`${URL}paquete/put/eliminar/${Id_paquete}`,{
      estadoPaquete: 2
    }).then(()=>{
      alert('Paquete eliminado con exito!')
      verTodosLosPaquetes()
    }).catch((error)=>{
      console.log('Error al eliminar el paquete', error)
    })
  }


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

  return (
    <>
      <Productos/><br /><br />
      <h2><strong>ADMINISTRACION DE PAQUETES</strong></h2>
      <h4>Gestiona todas las promos de tu negocio</h4> <br /> 

        <ContenedorBotones style={{marginTop: '50px'}}> 
                <Button variant="dark" onClick={handleShowModal8}>
                    <Badge badgeContent={listaCompras.length} color="secondary">
                   PRODUCTOS <img src={carritoImg} alt="carrito" style={{ width: '25px', height: 'auto', marginLeft: "7px" }}/>
                    </Badge>
                </Button>
        </ContenedorBotones> 

        
        <div className='container'>
          <br />

          <MDBInputGroup className="mb-3">
          <span className="input-group-text">
                  <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#6d4c41",}} />
          </span>
          <input className="form-control" type="text" placeholder="Nombre del paquete" value={nombre_promocion} onChange={(e)=> setNombrePromocion(e.target.value)}/>          
          </MDBInputGroup>
            
              <br />


              <MDBInputGroup className="mb-3">
    <span className="input-group-text">
            <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#6d4c41",}} />
    </span>
    <input className="form-control" type="number" placeholder="Precio del paquete" value={precio_paquete} onChange={(e)=> setPrecioPaquete(e.target.value)}/>  
    </MDBInputGroup>

              <br />
              {
                  editPaquete ? 
                  <div >
                  <Button className="btn btn-warning m-2" onClick={editarPaquete}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon> EDITAR PAQUETE</Button>
                
                  <Button className="btn btn-danger m-2" onClick={limpiarCampos}><FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
                  </div> 
                  :
                
                      <div > 
                      <Button className="btn btn-success m-2" onClick={crearPaquete} ><FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR </Button>
                      </div> 
              }
        </div>
            
           




      <Modal
              show={showModal8} onHide={handleCloseModal8} 
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                <input  onChange={buscador}  value={buscar}type="text" placeholder='Busca un producto...' className='form-control' ref={inputRef} />
                </Modal.Title>
              </Modal.Header>
          <Modal.Body>
            <div className='container table'>
              <Table striped bordered hover className='custom-table'>
              <thead className='custom-table-header'>
                <tr>
     
                  <th>NOMBRE</th>
                  <th>DESCRIPCIÓN</th>
                  <th>PRECIO</th>
                  <th>TIPO VENTA</th>
                  <th>VENDER</th>
                </tr>
              </thead>
              <tbody>
                {buscar.length > 0 ?(
                    resultado.map((producto, index) => (
                      <tr key={index}>
                        
                        <td>{producto.nombre_producto}</td>
                        <td>{producto.descripcion_producto}</td>
                        <td className='precio'><strong>{formatCurrency(producto.precioVenta)}</strong></td>
                        <td>{producto.tipo_venta}</td>
                        <td>
                            <Button className="btn btn-primary" onClick={() => handleAgregar(producto)}>AGREGAR</Button>
                        </td>
                        </tr>
                    ))
                ) :  (
                    <tr>
                      <td colSpan="6" className="text-center">Por favor, comience a buscar para ver los resultados</td>
                    </tr>
                  )}
              
              </tbody>
            </Table>  
            </div>           
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal8}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>
<br />

<div className='container table'>

  <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
  <thead className='custom-table-header'>
              <tr>
                <th scope="col">NOMBRE</th>
                <th scope="col">PRECIO</th>
                <th scope="col">TIPO VENTA</th>
                <th scope="col">CANTIDAD</th> 
                <th scope="col">ELIMINAR</th>
              </tr>
            </thead>
            <tbody>
              {listaCompras.map(producto => (
                <>
                  <tr key={producto.Id_producto}>

                  <td>{producto.nombre_producto}</td>
                  <td className='precio'>
                    <strong>{formatCurrency(producto.precioVenta)}</strong>
                    <strong>{producto.precio_paquete}</strong>
                  </td>
                  <td>{producto.tipo_venta}</td>
                  <td style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <input type="number" style={{width:'130px', backgroundColor:'#E3EEFF', color:'black', borderColor:'#17486C'}} className='form-control' onChange={(e) => setCantidadesVendidas({...cantidadesVendidas, [producto.Id_producto]: e.target.value})} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => eliminarCompra(producto.Id_producto)}
                    > ELIMINAR </button>
                  </td>
                </tr>
                </>
              ))}           
            </tbody>
          </table>
          </div>      
        

<br /><br />
          <h3>PAQUETES EXISTENETES</h3>
          <div className='container table'>
          <input value={buscar2} onChange={buscador2} type="text" placeholder='Busca una promocion...' className='form-control'/>
          <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
          <thead className='custom-table-header'>

        <tr className='custom-table-header'>
            <th>FOLIO</th>

            <th>NOMBRE PAQUETE</th>
            <th>PRECIO PAQUETE</th>
            <th>COSTO PAQUETE</th>
            <th>PRODUCTOS</th>
            <th>CANTIDAD</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
        </tr>
    </thead>
    {/* Cuerpo de la tabla */}
    <tbody>
        {resultado2.slice(primerIndex, ultimoIndex).map((val) => (
            <tr key={val.Id_paquete}>
                <td>{val.Id_paquete}</td>
                <td>{val.nombre_promocion}</td>
                <td className='precio'><strong>{formatCurrency(val.precio_paquete)}</strong></td>
                <td className='precio'><strong>{formatCurrency(val.precioCosto)}</strong></td>
                <td>
                    <ul style={{ padding: 0, margin: 0, marginLeft:'16px' ,display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {val.productos && val.productos.map((producto) => (
                            <li key={producto.Id_producto}>{producto.nombre_producto}</li>
                        ))}
                    </ul>
                </td>
                <td>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {val.productos && val.productos.map((producto) => (
                            <li key={producto.Id_producto}>Cantidad: {producto.cantidadProducto}</li>
                        ))}
                    </ul>
                </td>
                <td><button className='btn btn-primary' onClick={()=>seePaquetes(val)}>SELECCIONAR</button></td>
                <td><button className='btn btn-danger' onClick={()=>eliminarPaquete(val.Id_paquete)}>ELIMINAR</button></td>
            </tr>
        ))}
    </tbody>
  </table>
</div>

<div style={{display:'flex',justifyContent:'center'}}>
  <Paginacion productosPorPagina={productosPorPagina} 
  actualPagina={actualPagina} 
  setActualPagina={setActualPagina}
  total={total}
  />
  </div>
    </>
  )
}

export default Paquete


const ContenedorBotones = styled.div`
padding: 10px;
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 30px;
`;