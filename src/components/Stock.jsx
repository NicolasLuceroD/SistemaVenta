/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import  { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { MDBInputGroup } from 'mdb-react-ui-kit';
import { DataContext } from '../context/DataContext.jsx';
import App from '../App.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faBarcode, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faShop } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import Paginacion from './Paginacion.jsx';
import { Modal, Table} from 'react-bootstrap';
import Swal from 'sweetalert2';
import ScrollToTopButton, { scrollToTop } from "../components/utils/ScrollToTopButton.jsx"


const Stock = ({ filename, sheetname }) => {

    const { URL, productos } = useContext(DataContext);
    const inputRef = useRef(null);
    
    const [stock,setStock] = useState([])
    const [stock2,setStock2] = useState([])
    const [buscar,setBuscar] = useState();
    const [buscar2,setBuscar2] = useState();
    const [cantidad, setCantidad] = useState('');
    const [Id_producto, setId_producto] = useState('');
    const [Id_sucursal, setId_sucursal] = useState('');
    const [editarStock, setEditarStock] = useState(false)
    const [Id_stock, setId_stock] = useState("")
    const [invMinimo, setInvMinimo] = useState("");
    const [sucursal,setSucursal] = useState()
    const [totalProductos, setTotalProductos] = useState(0);
    const [productosPaginados, setProductosPaginados] = useState(productos)
    const [buscarProductos, setBuscarProductos] = useState('');
    const [stockProducto, setStockProducto] = useState([])


     const [showModal8, setShowModal8] = useState(false);
     const handleShowModal8 = () => {
        setShowModal8(true);
      }

      const handleCloseModal8 = () => {
        setShowModal8(false);
      }

      const buscadorProductos = (e) => {
        const valor = e.target.value.toLowerCase();
        setBuscarProductos(valor); 
        const codBarrasLocas = valor.length >= 6; 
        let productosFiltrados = [];
        if (codBarrasLocas) {
            productosFiltrados = productos.filter(prod => prod.codProducto.toLowerCase().includes(valor));
        } else {
            productosFiltrados = productos.filter(prod => 
                prod.nombre_producto.toLowerCase().includes(valor) || 
                prod.descripcion_producto.toLowerCase().includes(valor)
            );
        }
        setProductosPaginados(productosFiltrados)
    };
  
  let resultadoProductos = [];
  if (!buscar2) {
    resultadoProductos = productos;
  } else {
    resultadoProductos = productos.filter((dato) => {
      const nombreProductoIncluye = dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase());
      const codProductoIncluye = dato.codProducto && dato.codProducto.toString().includes(buscar.toLowerCase());
      return nombreProductoIncluye || codProductoIncluye;
    });
  }



  

const limpiarInput = () => {
  setBuscarProductos('');
  setProductosPaginados([]);  
  setActualPaginaProduct3(1); 
};

  
    const crearStock = async () => {
      const idProducto = parseInt(Id_producto);
      const cant = parseInt(cantidad);
      const idSuc = parseInt(document.getElementById("suc").value);
  
      if (isNaN(cant) || isNaN(idProducto)) {
          Swal.fire("¡Debes ingresar una cantidad mayor a 0 y un ID de producto!", "", "error");
          return;
      }
  
      if (idSuc === 0) {
          Swal.fire("Debe elegir una sucursal", "", "error");
          return;
      }
  
      try {
          const response = await axios.get(`${URL}stock/validarStock/${idProducto}/${idSuc}`);
  
          if (response.data.length > 0) {
              Swal.fire("Este producto ya tiene stock en esta sucursal", "", "error");
              return;
          }
  
          await axios.post(`${URL}stock/post`, {
              cantidad: cant,
              Id_sucursal: idSuc,
              Id_producto: idProducto,
              InventarioMinimo: invMinimo
          });
  
          Swal.fire("Stock creado con éxito", "", "success");
          limpiarCampos();
          verStock();
          verStock2();
      } catch (error) {
          console.error("Error al validar o crear el stock:", error);
          Swal.fire("Hubo un error al procesar la solicitud", "", "error");
      }
  };
  


    const verStock = () =>{
        axios.get(`${URL}stock/sucursal1`).then((response)=>{
            setStock(response.data)
            setTotal(response.data.length)

        }).catch((error)=>{
            console.log('Error al traer el stock' , error)
        })
    }


    
    const verStock2 = () =>{
        axios.get(`${URL}stock/sucursal2`).then((response)=>{
            setStock2(response.data)
            setTotal2(response.data.length)
        }).catch((error)=>{
            console.log('Error al traer el stock' , error)
        })
    }



    useEffect(()=>{
        verStock()
        verStock2()
    },[])


    const seeStock = (val) =>{
        setNombreProducto(val.nombre_producto)
        setEditarStock(true)
        setSucursal(val.nombre_sucursal)
        setId_stock(val.Id_stock)
        setCantidad(val.cantidad)
        setId_producto(val.Id_producto)
        setId_sucursal(val.Id_sucursal)
        setInvMinimo(val.InventarioMinimo)
        scrollToTop()
    }

    const limpiarCampos = () =>{
        setEditarStock(false)
        setNombreProducto("")
        setId_stock("")
        setCantidad("")
        setId_producto("")
        setId_sucursal("")
        setInvMinimo("")
        setSucursal(0)
    }



    const updateStock = () =>{
        const idSuc = parseInt(document.getElementById("suc").value)
        if(idSuc === 0){
            alert("Debe elegir una sucursal")
        }else{
            axios.put(`${URL}stock/put/${Id_stock}`,{
                Id_stock: Id_stock,
                cantidad: cantidad,
                Id_producto: Id_producto,
                InventarioMinimo: invMinimo
            }).then(()=>{
                alert("Stock editado con exito")
                verStock()
                verStock2()
                limpiarCampos()
            }).catch((error)=>{
                console.log("Error al editar el stock ", error)
            })
        }  
      
    }

    useEffect(() => {
        if (showModal8 && inputRef.current) {
          inputRef.current.focus();
        }
      }, [showModal8]);


    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(stock);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, `${filename}.xlsx`);
    };
    const exportToExcel2 = () => {
        const ws = XLSX.utils.json_to_sheet(stock2);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, `${filename}.xlsx`);
    };



    const buscador = (e) => {
        setBuscar(e.target.value)
    }
    let resultado = []
    if (!buscar) {
      resultado = stock
    } else {
      resultado = stock.filter((dato) =>
        dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase())
      )
    }


    const buscador2 = (e) => {
        setBuscar2(e.target.value)
    }
    let resultado2 = []
    if (!buscar2) {
      resultado2 = stock2
    } else {
      resultado2 = stock2.filter((dato) =>
        dato.nombre_producto.toLowerCase().includes(buscar2.toLowerCase())
      )
    }




//PAGINACION NUEVA
const productosPorPagina = 10
const [actualPagina,setActualPagina] = useState(1)
const [total, setTotal]=useState(0)
const ultimoIndex = actualPagina * productosPorPagina;
const primerIndex = ultimoIndex - productosPorPagina;


//PAGINACION NUEVA
const productosPorPagina2 = 10
const [actualPagina2,setActualPagina2] = useState(1)
const [total2, setTotal2]=useState(0)
const ultimoIndex2 = actualPagina2 * productosPorPagina2;
const primerIndex2 = ultimoIndex2 - productosPorPagina2;




const productPorPagina3 = 10;
const [actualPaginaProduct3, setActualPaginaProduct3] = useState(1);

const ultimoIndexProduc3 = actualPaginaProduct3 * productPorPagina3;
const primerIndexProduc3 = ultimoIndexProduc3 - productPorPagina3;

useEffect(() => {
  const productosFiltrados = buscarProductos
    ? productos.filter(dato =>
        dato.nombre_producto.toLowerCase().includes(buscarProductos.toLowerCase()) ||
        (dato.codProducto && dato.codProducto.toString().includes(buscarProductos.toLowerCase()))
      )
    : productos;

  setProductosPaginados(productosFiltrados.slice(primerIndexProduc3, ultimoIndexProduc3));
  setTotalProductos(productosFiltrados.length);
}, [buscarProductos, productos, primerIndexProduc3, ultimoIndexProduc3]);






const [nombreProducto,setNombreProducto] = useState("")
const seleccionarProducto = (producto) =>{
  setId_producto(producto.Id_producto)
  setNombreProducto(producto.nombre_producto)
  handleCloseModal8()
  setBuscarProductos("")
}


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
        <h1>STOCK</h1>
    </div><br />
           <div className="container-fluid">
           <h2><strong>ADMINISTRACION DE STOCK</strong></h2>
            <h4>Gestiona la cantidad de todos tus productos en tus sucursales</h4> <br /> 
            <div className='container'>
                <div className="row">
                    <div className="col">
                        
                        <MDBInputGroup className="mb-3">
                        <span className="input-group-text">
                        <FontAwesomeIcon icon={faBarcode} size="lg" style={{color: "#01992f",}} />
                        </span>
                            <input className="form-control" type="text" placeholder="Nombre Producto" value={nombreProducto}  readOnly  />
                        </MDBInputGroup>

                        <MDBInputGroup className="mb-3">
                        <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                        </span>
                        <input className="form-control" type="number" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                        </MDBInputGroup>


                        <h4 style={{display:'flex', flexDirection:'flex-start', marginTop:'50px'}} >SUCURSAL</h4>
                        <MDBInputGroup>
                        <span className="input-group-text">
                            <FontAwesomeIcon icon={faShop} size="lg" style={{color: "#01992f",}} />
                        </span>
                        <Form.Select key={Id_sucursal} value={sucursal} onChange={(e)=> setSucursal(e.target.value)} aria-label="Nombre Categoria" id="suc">
                        <option value="0" disabled selected>--Seleccione una sucursal--</option>
                        <option value="1" >Lavalle 87</option>
                        <option value="2" >Lavalle Guillermina </option>
                        </Form.Select>
                        </MDBInputGroup>
                        <br />
                    </div>
                </div>
            </div>

            <div className='card-footer text-muted'>
                  {
                  editarStock ? 
                  <div >
                  <Button className="btn btn-warning m-2" onClick={updateStock}><FontAwesomeIcon icon={faFloppyDisk} size="lg" style={{color: "#AB8512"}}></FontAwesomeIcon>  EDITAR STOCK</Button> 
                  <Button className="btn btn-danger m-2" onClick={limpiarCampos}><FontAwesomeIcon icon={faBan} size="lg" style={{color: "#970c0c"}}></FontAwesomeIcon> CANCELAR</Button>
                  </div> 
                  :
                      <div > 
                      <Button className="btn btn-success m-2" onClick={crearStock}> <FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR STOCK</Button>
                      <Button className="btn btn-primary m-2" onClick={handleShowModal8}> BUSCAR PRODUCTOS</Button>
                      </div> 
                  }

                    
                   
                </div>
                <div className='container'>
            <h2 style={{marginTop: '60px'}}>STOCK DE PRODUCTOS SUCURSAL - Lavalle 87</h2>
            <MDBInputGroup>
            <span className="input-group-text">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" style={{color: "#01992f",}} />
                    </span>
            <input value={buscar} onChange={buscador} type="text" placeholder='Busca un producto...' className='form-control'/><br />
            </MDBInputGroup>
            <div className='container table'><br />
                <table className="table table-striped table-hover mt-5 shadow-lg">
                    <thead className='custom-table-header'>
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>DESCRIPCION</th>
                            <th>TIPO VENTA</th>
                            <th>CANTIDAD </th>
                            <th>SUCURSAL</th>
                            <th>EDITAR</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {resultado.slice(primerIndex, ultimoIndex).map((val) => (
                            <tr key={val.Id_stock}>
                                <td>{val.Id_producto}</td>
                                <td>{val.nombre_producto}</td>
                                <td>{val.descripcion_producto}</td>
                                <td>{val.tipo_venta}</td>
                                <td>{val.tipo_venta === 'granel' ? parseFloat(val.cantidad).toFixed(2) : val.cantidad}</td>
                                <td>{val.nombre_sucursal}</td>
                                <td className="text-center">
                                  <Button
                                    variant="warning"
                                    size="md"
                                    onClick={() => seeStock(val)}
                                    title="Editar stock"
                                  >
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                  </Button>
                                </td>
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
            <button onClick={exportToExcel} className='btn btn-secondary'>Exportar a Excel</button>

<hr />
            </div>
            </div>



                <div className='container'>
            <h2 style={{marginTop: '60px'}}>STOCK DE PRODUCTOS SUCURSAL - GUILLERMINA</h2>
            <MDBInputGroup>
            <span className="input-group-text">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" style={{color: "#01992f",}} />
                    </span>
            <input value={buscar} onChange={buscador} type="text" placeholder='Busca un producto...' className='form-control'/><br />
            </MDBInputGroup>
            <div className='container table'><br />
                <table className="table table-striped table-hover mt-5 shadow-lg">
                    <thead className='custom-table-header'>
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>DESCRIPCION</th>
                            <th>TIPO VENTA</th>
                            <th>CANTIDAD </th>
                            <th>SUCURSAL</th>
                            <th>EDITAR</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {resultado2.slice(primerIndex, ultimoIndex).map((val) => (
                            <tr key={val.Id_stock}>
                                <td>{val.Id_producto}</td>
                                <td>{val.nombre_producto}</td>
                                <td>{val.descripcion_producto}</td>
                                <td>{val.tipo_venta}</td>
                                <td>{val.tipo_venta === 'granel' ? parseFloat(val.cantidad).toFixed(2) : val.cantidad}</td>
                                <td>{val.nombre_sucursal}</td>
                               <td className="text-center">
                                <Button
                                  variant="warning"
                                  size="md"
                                  onClick={() => seeStock(val)}
                                  title="Editar stock"
                                >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                </Button>
                              </td>
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
            <button onClick={exportToExcel} className='btn btn-secondary'>Exportar a Excel</button>

<hr />
            </div>

            
          <Modal show={showModal8} onHide={handleCloseModal8} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>PRODUCTOS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col"><input className='form-control' type="text" placeholder="Buscar un producto..." onChange={buscadorProductos} ref={inputRef}  value={buscarProductos} /><br /></div>
              <div className="col"><Button onClick={limpiarInput} style={{color: '#fff'}} variant='warning'>LIMPIAR</Button></div>
            </div>
          </div>
          
          <div className="container-fluid table">
          <Table striped bordered hover className='custom-table'>
          <thead className='custom-table-header'>
              <tr>
                <th>COD PRODUCTO</th>
                <th>NOMBRE</th>
                <th>PRECIO VENTA</th>
                <th>PRECIO MAYOREO</th>
                <th>TIPO VENTA</th>
                <th>SELECCIONAR</th>
              </tr>
            </thead>
            <tbody>
              {buscarProductos && productosPaginados.length > 0 ? (
                productosPaginados.map((item, index) => (
                <tr key={item.Id_producto || index}>
                    <td>{item.codProducto}</td>
                    <td>{item.nombre_producto}</td>
                    <td className='precio-venta-nuevo'><strong>{formatCurrency(item.precioVenta)}</strong></td>
                    <td className='precio'><strong>{formatCurrency(item.PrecioMayoreo)}</strong></td>
                    <td>{item.tipo_venta}</td> 
                    <td>
                      <button onClick={()=>seleccionarProducto(item)}>
                       <FontAwesomeIcon icon={faCheck} size="lg" style={{color: "#01992f",}} />
                      </button>
                    </td> 
                  </tr>
                ))
              ) : buscar && productosPaginados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No se encontraron resultados para la búsqueda</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">Por favor, comience a buscar para ver los resultados</td>
                </tr>
              )}
            </tbody>
          </Table>
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          {buscarProductos && (
            <Paginacion 
              productosPorPagina={productPorPagina3} 
              actualPagina={actualPaginaProduct3} 
              setActualPagina={setActualPaginaProduct3} 
              total={totalProductos}
            />
          )}
          <Button variant="danger" onClick={handleCloseModal8}>CERRAR</Button>
        </Modal.Footer>
      </Modal>
      <ScrollToTopButton/>
    </>

  )
}

export default Stock
