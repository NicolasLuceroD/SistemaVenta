/* eslint-disable no-unused-vars */
import Productos from "../components/Productos.jsx"
import { Button } from "react-bootstrap"
import  { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {
    MDBInputGroup,
  } from 'mdb-react-ui-kit';
  import Form from 'react-bootstrap/Form';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import { Modal, Table} from 'react-bootstrap';
import { DataContext } from '../context/DataContext.jsx';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import Paginacion from '../components/Paginacion.jsx';

const Editar = () => {

    const [ver, setVer] = useState([]);
    const [Id_producto, setId_Producto] = useState('');
    const [nombre_producto, setnombre_Producto] = useState('');
    const [descripcion_producto, setdescripcion_Producto] = useState('');
    const [precioCompra, setPrecioCompra] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [Id_categoria, setId_categoria] = useState('0');
    const [tipo_venta, setTipoVenta] = useState('0');
    const [categorias, setCategorias] = useState([]);
    const [productoXCat, setProductoXCat] = useState([]);
    const [precioNuevo, setPrecioNuevo] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [fechaVencimiento, setFechaVencimineto] = useState("")
    const [codProducto, setCodProducto] = useState("")
    const [depto,setDepto] = useState("0")
    const [precioMayoreo, setPrecioMayoreo] = useState("");

    const {  URL } = useContext(DataContext);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setProductoXCat([])
        setShowModal(false);  
    }
    
    
    // Función para convertir la fecha al formato "yyyy-MM-dd"
const formatFecha = (fecha) => {
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


    const verProductoXCategoria = () =>{
        const idCat = document.getElementById("categoria2").value
        axios.get(`${URL}productos/${idCat}`).then((response)=>{
            setProductoXCat(response.data)
            setTota2(response.data.length)
        }).catch((error)=>{
            console.log('Error al crear el producto', error)
        })
    }




    useEffect(()=>{
        axios.get(`${URL}productos`)
        .then((response) => {
            setVer(response.data);
            setTotal(response.data.length)
        })
        .catch((error) => {
            console.log('Error al obtener los productos:', error);
        });
    },[URL,ver])


    const editarProductoXCategoria = () =>{
        const idCat = document.getElementById("categoria2").value
        const precioNuevo = document.getElementById("precioNuevo").value
        if (!precioNuevo){
          alert("Por favor, ingrese un nuevo precio antes de modificar")
          return
        }
        axios.put(`${URL}productos/put/preciosXCategoria/${idCat}`,
        {    
            precioVenta: precioNuevo,
        }).then(()=>{
            alert('Productos editado')
            setPrecioNuevo("")
            handleCloseModal()
        }).catch((error)=>{
            console.log('casi pero no', error)      
        })
    }
    function refreshPage() {
      window.location.reload();
    }

    const editarProducto = () =>{
      const catXproducto = parseInt(document.getElementById("categoria").value) 
      if(catXproducto === 0){
        alert("Debe elegir la categoria del producto")
      }else{
        axios.put(`${URL}productos/put/${Id_producto}`,
        {    
            Id_producto: Id_producto,
            nombre_producto: nombre_producto,
            descripcion_producto: descripcion_producto,
            precioCompra: precioCompra,
            precioVenta: precioVenta,
            Id_categoria: catXproducto,
            FechaVencimiento: fechaVencimiento,
            tipo_venta: tipo_venta,
            codProducto: codProducto,
            PrecioMayoreo: precioMayoreo
        }).then(()=>{
            alert('Producto editado con exito!')
            limpiarCampos()
            refreshPage()
        }).catch((error)=>{
          console.log('Error al editar el producto', error)
        })
      }
        
    }

    const verCategorias = () =>{
        axios.get(`${URL}categorias`).then((response)=>{
            setCategorias(response.data)
        }).catch((error)=>{
          console.log('Error al obtener las categorias', error)
        })

    }


    const seeProductos = (val) =>{
        setId_Producto(val.Id_producto)
        setnombre_Producto(val.nombre_producto)
        setdescripcion_Producto(val.descripcion_producto)
        setPrecioCompra(val.precioCompra)
        setPrecioVenta(val.precioVenta)
        setId_categoria(val.Id_categoria)
        setTipoVenta(val.tipo_venta)
        setCodProducto(val.codProducto)
        setPrecioMayoreo(val.PrecioMayoreo)
        setFechaVencimineto(formatFecha(val.FechaVencimiento)); 
    }
    const limpiarCampos = () =>{

        setId_Producto('')
        setnombre_Producto('')
        setdescripcion_Producto('')
        setPrecioCompra('')
        setPrecioVenta('')
        setId_categoria('')
        setTipoVenta(0)
        setDepto(0)
        setCodProducto('')
        setFechaVencimineto('')
        setPrecioMayoreo('')
    }

    useEffect(()=>{
        verCategorias()
    },[URL])




//PAGINACION NUEVA
const productosPorPagina = 10
const [actualPagina,setActualPagina] = useState(1)
const [total, setTotal]=useState(0)
const ultimoIndex = actualPagina * productosPorPagina;
const primerIndex = ultimoIndex - productosPorPagina;



//PAGINACION 2
const productosPorPagina2 = 5
const [actualPagina2,setActualPagina2] = useState(1)
const [total2, setTota2]=useState(0)
const ultimoIndex2 = actualPagina2 * productosPorPagina2;
const primerIndex2 = ultimoIndex2 - productosPorPagina2;


const [buscar, setBuscar] = useState('');


const buscador = (e) => {
    setBuscar(e.target.value);
  }

  let resultado = [];
  if (!buscar) {
    resultado = ver;
  } else {
    resultado = ver.filter((dato) => {
      const nombreProductoIncluye = dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase());
      const codProductoIncluye = dato.codProducto && dato.codProducto.toString().includes(buscar.toLowerCase());
      return nombreProductoIncluye || codProductoIncluye;
    });
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };


  return (
<>

<Productos/><br />
<div className="container"><br />
<h2><strong>MODIFICACIÓN DE PRODUCTOS</strong></h2>
            <h4>Modifica y gestiona todos los productos de tu negocio</h4><br /> 
    <div className="row">
        <div className="col">
            <MDBInputGroup className='mb-3'>
            <span className="input-group-text">
                    <FontAwesomeIcon icon={faBarcode} size="lg" style={{color: "#6d4c41",}} />
            </span>
            <input type="text" className="form-control" style={{width: '500px', margin: 'auto'}}placeholder="Escanea el codigo de barras"  value={codProducto} onChange={(e) => setCodProducto(e.target.value)}/>
            </MDBInputGroup>
        </div>
    </div>
</div>

<div className="container-fluid">
<div className="container">
<MDBInputGroup className='mb-3'>
<span className="input-group-text">
                    <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#6d4c41",}} />
            </span>
        <input className='form-control' type='text' placeholder="Nombre"  value={nombre_producto} onChange={(e) => setnombre_Producto(e.target.value)}/>
      </MDBInputGroup>

      <MDBInputGroup className='mb-3' >
      <span className="input-group-text">
                    <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#6d4c41",}} />
            </span>
        <input className='form-control' type='text' placeholder="Descripcion" value={descripcion_producto} onChange={(e) => setdescripcion_Producto(e.target.value)} />
      </MDBInputGroup>

      <MDBInputGroup className='mb-3' >
      <span className="input-group-text">
                    <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#6d4c41",}} />
            </span>
        <input className='form-control' type='number' placeholder="Precio costo" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} />
      </MDBInputGroup>
      
      <MDBInputGroup className='mb-3' >
      <span className="input-group-text">
                    <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#6d4c41",}} />
            </span>
        <input className='form-control' type='email' placeholder="Precio venta" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)}/>
      </MDBInputGroup>

      <MDBInputGroup className='mb-3' >
      <span className="input-group-text">
                    <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#6d4c41",}} />
            </span>
        <input className='form-control' type='email' placeholder="Precio mayoreo" value={precioMayoreo} onChange={(e) => setPrecioMayoreo(e.target.value)}/>
      </MDBInputGroup>
    
      <MDBInputGroup className="mb-3">
    <span className="input-group-text">
            <FontAwesomeIcon icon={faCalendar} size="lg" style={{color: "#6d4c41",}} />
    </span>
    <input 
    className="form-control" 
    type="date" 
    placeholder="Fecha de vencimiento" 
    value={fechaVencimiento} 
    onChange={(e) => {
        // Parsea la fecha al formato aaaa-mm-dd
        const fecha = e.target.value.split('/').reverse().join('-');
        setFechaVencimineto(fecha);
    }} 
    />
    </MDBInputGroup>
  
     <h4 style={{display:'flex', flexDirection:'flex-start', marginTop:'50px'}}> TIPO DE VENTA</h4>
     <MDBInputGroup>
    <span className="input-group-text">
            <FontAwesomeIcon icon={faScaleBalanced} size="lg" style={{color: "#6d4c41",}} />
    </span>
    <Form.Select aria-label="Tipo de venta" value={tipo_venta} onChange={(e)=>setTipoVenta(e.target.value)}>
    <option value="0" disabled selected>--Seleccione un tipo de venta--</option>
        <option value="unidad">Unidad</option>
        <option value="granel">Granel Kg</option>
    </Form.Select>
    </MDBInputGroup>

    <br />
    
    <h4 style={{display:'flex', flexDirection:'flex-start', marginTop:'50px'}}> CATEGORIA</h4>
    <MDBInputGroup>
    <span className="input-group-text">
            <FontAwesomeIcon icon={faTags} size="lg" style={{color: "#6d4c41",}} />
    </span>
    <Form.Select  aria-label="Nombre Categoria" id="categoria" value={Id_categoria} onChange={(e)=> setId_categoria(e.target.value)}>
    <option value="0" disabled selected>--Seleccione una categoria--</option>
        {categorias.map((cat) => (     
            <option key={cat.Id_categoria} value={cat.Id_categoria}>{cat.nombre_categoria}</option>
        ))}
    </Form.Select>
    </MDBInputGroup>
    
    </div>
    </div> 


    <Modal
              show={showModal} onHide={handleCloseModal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  MODIFICAR PRODUCTOS POR DEPARTAMENTO
                </Modal.Title>
              </Modal.Header>
          <Modal.Body>
            <h5>DEPARTAMENTOS:</h5>
            <MDBInputGroup> 
              <span className="input-group-text">
                   <FontAwesomeIcon icon={faTags} size="lg" style={{color: "#012541",}} />
                </span>
            <Form.Select  key={Id_categoria} aria-label="Nombre Categoria" id="categoria2">
                        {categorias.map((cat)=>   
                            <option key={cat.Id_categoria}  value={cat.Id_categoria}>{cat.nombre_categoria}</option>   
                        )}
            </Form.Select>
            </MDBInputGroup>
            <br/>        
            <h5>MONTO DE RECARGO:</h5>
            <MDBInputGroup>
            <span className="input-group-text">
                  <FontAwesomeIcon icon={faDollar} size="lg" style={{ color: "#012541" }} />
            </span>
          <input type="number" id="precioNuevo" placeholder="Ingrese un porcentaje de recargo (%)"  onChange={(e)=> setPrecioNuevo(e.target.value)} className='form-control'/>
          </MDBInputGroup>
          <br />   <br />
          <div className="container table">
              <Table striped bordered hover>
              <thead className='custom-table-header'>
                <tr>
                  <th>NOMBRE</th>
                  <th>DESCRIPCIÓN</th>
                  <th>TIPO VENTA</th>
                  <th>PRECIO DE VENTA ACTUAL</th>
                  <th>PRECIO DE VENTA NUEVO</th>
                  <th>DEPARTAMENTO</th>
                </tr>
              </thead>
              <tbody>
                {productoXCat.length > 0 ?(
                    productoXCat.slice(primerIndex2, ultimoIndex2).map((producto, index) => (
                      <tr key={index}>
                        
                        <td>{producto.nombre_producto}</td>
                        <td>{producto.descripcion_producto}</td>
                        <td>{producto.tipo_venta}</td>
                        <td className="precio-venta-actual"><strong>{formatCurrency(producto.precioVenta)}</strong></td>
                        <td className="precio-venta-nuevo"><strong>${(parseFloat(producto.precioVenta) + parseFloat(producto.precioVenta * (precioNuevo / 100))).toFixed(2)}</strong></td>
                        <td>{producto.nombre_categoria}</td>
                        </tr>
                    ))
                ) :  (
                    <tr>
                      <td colSpan="6" className="text-center">Por favor, comience a buscar para ver los resultados</td>
                    </tr>
                  )}
              
              </tbody>
            </Table>
           <div style={{display:'flex', justifyContent:'center'}}>
            <Paginacion productosPorPagina={productosPorPagina2} 
            actualPagina={actualPagina2} 
            setActualPagina={setActualPagina2}
            total={total2}
            />
            </div>
            </div>             
            </Modal.Body>
            <Modal.Footer>
            {productoXCat.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => editarProductoXCategoria()} 
                  >
                    MODIFICAR
                  </button>
                )}
              <Button variant="success" onClick={verProductoXCategoria}>BUSCAR</Button>
              <Button variant="danger" onClick={handleCloseModal}>CERRAR</Button>
             
            </Modal.Footer>
           
          </Modal>

    <div className="container">
        <div className="row">
            <div className="col">
            <br />
            <Button className="btn btn-success" style={{margin: '15px',}} onClick={editarProducto}><FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR PRODUCTO</Button>        
            <Button onClick={handleShowModal}className='btn btn-primary' style={{margin: '15px', color:'#ffff'}}>MODIFICAR POR CATEGORIA</Button>
            </div>
        </div>

        <br />
        <input value={buscar} onChange={buscador} type="text" placeholder='Busca un producto...' className='form-control'/>
        </div>
        
        <div className="container-fluid table">
         <table className='table table-striped table-hover mt-5 shadow-lg'>
            <thead className='custom-table-header'>
                <tr className='table-info'>
                    <th>CODIGO</th>
                    <th>NOMBRE</th>
                    <th>DESCRIPCION</th>
                    <th>PRECIO COSTO</th>
                    <th>PRECIO VENTA</th>    
                    <th>PRECIO MAYOREO</th>
                    <th>TIPO DE VENTA</th>
                    <th>DEPARTAMENTO</th>
                    <th>FECHA VENCIMIENTO</th>
                    <th>GANANCIA</th>
                    <th>EDITAR</th>
                </tr>
            </thead>
            <tbody>
            {
                    resultado.slice(primerIndex, ultimoIndex).map((val) => (
                        <tr key={val.Id_producto}>
          
                            <td>{val.codProducto}</td>
                            <td>{val.nombre_producto}</td>
                            <td>{val.descripcion_producto}</td>
                            <td className="precio-costo"><strong>{formatCurrency(val.precioCompra)}</strong></td>
                            <td className="precio-venta"><strong>{formatCurrency(val.precioVenta)}</strong></td>
                            <td className="precio-mayoreo"><strong>{formatCurrency(val.PrecioMayoreo)}</strong></td>
                            <td>{val.tipo_venta}</td>
                            <td>{val.nombre_categoria}</td>
                            <td>{new Date(val.FechaVencimiento).toISOString().slice(0, 10)}</td>
                            <td>${parseFloat( val.precioVenta - val.precioCompra ).toFixed(2) }</td>
                            <td><Button className="btn btn-primary" onClick={()=>seeProductos(val)}> SELECCIONAR</Button></td>
                        </tr>
                    ))
                }
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

export default Editar