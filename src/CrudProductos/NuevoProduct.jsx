/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { MDBInputGroup } from 'mdb-react-ui-kit';
import Productos from '../components/Productos.jsx'
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faBalanceScale, faDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../context/DataContext.jsx';
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import Paginacion from '../components/Paginacion.jsx';
import Swal from 'sweetalert2';
import { icon } from '@fortawesome/fontawesome-svg-core';

const NuevoProduct = ({ filename, sheetname }) => {

    const [nombre_producto, setNombre_Producto] = useState('');
    const [descripcion_producto, setDescripcion_Producto] = useState('');
    const [precioCompra, setPrecioCompra] = useState('');

    const [precioMayoreo, setPrecioMayoreo] = useState('');
    const [Id_categoria, setId_categoria] = useState('');
    const [tipo_venta, setTipoVenta] = useState('0');
    const [categorias, setCategorias] = useState([]);
    const [producto,  setProducto] = useState([]);
    const [catalogo,  setCatalogo] = useState([]);
    const [fechaVencimiento, setFechaVencimineto] = useState("")
    const [stockPlata, setStockPlata] = useState([])
    const [codProducto, setCodProducto] = useState("")
    const [depto, setDepto] = useState('0');
    const [interesXGanancia, setInteresXGanacia] = useState()
    const [precioConGanancia, setPrecioConGanancia] = useState(0)
    const [precioVenta, setPrecioVenta] = useState(precioConGanancia);
    const [inventarioMinimo,setInventarioMinimo] = useState("")


    const {  URL } = useContext(DataContext);

    const LimpiarCampos = () => {
        setNombre_Producto('')
        setDescripcion_Producto('')
        setPrecioCompra('')
        setPrecioVenta('')
        setId_categoria('')
        setTipoVenta(0)
        setDepto(0)
        setCodProducto('')
        setFechaVencimineto('')
        setPrecioMayoreo('')
        setInteresXGanacia('')
    }


    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(producto);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, `Excel_productos.xlsx`);
    };

    const exportToExcel2 = () => {
        const ws = XLSX.utils.json_to_sheet(catalogo);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, `Excel_catalogo.xlsx`);
    };

    const traerCatalogo = () => {
        axios.get(`${URL}productos/ver/catalogo`).then((response) => {
            setCatalogo(response.data)
        }).catch((error) => {
            console.log('Error al obtener el catalogo', error)
        })
    }

    const verificarCodigoProducto = (codigobarras) =>{
        const existe = producto.some((p)=>p.codProducto === codigobarras)
        if(existe){
            Swal.fire({
                icon: 'error',
                title: 'Codigo duplicado',
                text: 'Este producto ya existe en el sistema'
            })
            return true
        }
        return false
    }


    const handleCodigoChange = (e) => {
        const codigobarras = e.target.value
        setCodProducto(codigobarras)
        if(codigobarras.length === 13){
            const existe = verificarCodigoProducto(codigobarras)
            if(existe){
                setCodProducto("")
            }
        }
    }

    const crearProductos = () => {
        console.log(depto);
        console.log('nombre', nombre_producto.length, 'descripcion', descripcion_producto.length, 'precioC', precioCompra.length, 'categoria', Id_categoria.length, 'tipo venta', tipo_venta.length, 'fechaV', fechaVencimiento.length, 'codigo', codProducto.length, 'precioM', precioMayoreo.length);
        if (!nombre_producto || depto === '0' || !descripcion_producto || !precioCompra || tipo_venta === '0' || !codProducto || !precioMayoreo) {
            Swal.fire({
                icon: 'warning',
                title: 'Atencion',
                text: 'Por favor, debe completar todos los campos',
                timerProgressBar: true,
                timer: 2500
            })
            return;
        } else {
            axios.post(`${URL}productos/post/producs`, {
                nombre_producto,
                descripcion_producto,
                precioCompra: parseFloat(precioCompra),
                precioVenta: parseFloat(precioConGanancia),
                Id_categoria: depto,
                tipo_venta,
                codProducto: codProducto,
                Id_sucursal: 1,
                PrecioMayoreo: precioMayoreo,
                inventarioMinimo: inventarioMinimo
            })
            .then(() => {
                Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'Producto creado con exito',
                timerProgressBar: true,
                timer: 2500
            })
                LimpiarCampos();
                trearLosProductos();
            })
            .catch((error) => {
                console.log('Error al crear el producto:', error);
            });
        }
    };

    const trearLosProductos = () => {
        axios.get(`${URL}productos`).then((response) => {
            setProducto(response.data)
            setTotal(response.data.length);
        }).catch((error) => {
            console.log('Error al traer los productos', error)
        })
    }

    const verCategorias = () => {
        axios.get(`${URL}categorias`)
            .then((response) => {
                setCategorias(response.data);
            })
            .catch((error) => {
                console.log('Error al obtener las categorías:', error);
            });
    };

    const verStockEnPlata = () => {
        axios.get(`${URL}productos/verPlataStock`).then((response) => {
            setStockPlata(response.data)
        }).catch((error) => {
            console.log('Error al obtener el stock plata', error)
        })
    }

    const Eliminar = (val) =>{
        console.log(val.Id_producto)
        axios.put(`${URL}productos/delete/${val.Id_producto}`).then(()=>{
            alert("Producto Eliminado con Exito")
            console.log('Producto', val.Id_producto, 'eliminado')
            trearLosProductos()
        }).catch((error)=>{
            console.log('Error al eliminar el producto', error)
        })
    }


    useEffect(() => {
        verStockEnPlata()
        verCategorias();
        trearLosProductos()
        traerCatalogo()
    }, [URL]); // Agregar dependencias para evitar llamadas repetitivas

    const [buscar, setBuscar] = useState('');

    const buscador = (e) => {
        setBuscar(e.target.value);
    }

    let resultado = [];
    if (!buscar) {
        resultado = producto;
    } else {
        resultado = producto.filter((dato) => {
            const nombreProductoIncluye = dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase());
            const codProductoIncluye = dato.codProducto && dato.codProducto.toString().includes(buscar.toLowerCase());
            return nombreProductoIncluye || codProductoIncluye;
        });
    }

    //PAGINACION NUEVA
    const productosPorPagina = 10
    const [actualPagina, setActualPagina] = useState(1)
    const [total, setTotal] = useState(0)
    const ultimoIndex = actualPagina * productosPorPagina;
    const primerIndex = ultimoIndex - productosPorPagina;


    const calcularGanancia = () =>{
     let precioIdeal = parseFloat(precioCompra) + parseFloat((precioCompra * interesXGanancia /100))
     setPrecioConGanancia(precioIdeal)
    }



    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
        }).format(value);
      };


    useEffect(()=>{
        calcularGanancia()
    },[precioCompra,interesXGanancia])



    return (
        <>
            <Productos /><br /><br />
            <h2><strong>ADMINISTRACION DE PRODUCTOS</strong></h2>
            <h4>Gestiona todos los productos de tu negocio</h4> <br />

            {stockPlata.map((val) => (
                <h4 key={val.precioCompra}><strong>CANTIDAD DE PRODUCTOS: {val.cantidad_productos}</strong> - <strong>VALOR DE STOCK: {formatCurrency(val.total_valor)}</strong> </h4>
            ))}  <br />

            <div className="container">
                 <p style={{ textAlign: 'left', fontSize:'14px'}}>CODIGO DE BARRAS</p>
                <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faBarcode} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input type="text" className="form-control" value={codProducto} onChange={handleCodigoChange} placeholder="Escanea el codigo de barras"  />
                </MDBInputGroup>

                <p style={{ textAlign: 'left', fontSize:'14px'}}>NOMBRE PRODUCTO</p>
                <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input className="form-control" type="text" placeholder="Nombre" value={nombre_producto} onChange={(e) => setNombre_Producto(e.target.value)} />
                </MDBInputGroup>

                <p style={{ textAlign: 'left', fontSize:'14px'}}>DESCRIPCION PRODUCTO</p>
                <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input className="form-control" type="text" placeholder="Descripcion" value={descripcion_producto} onChange={(e) => setDescripcion_Producto(e.target.value)} />
                </MDBInputGroup>

                <p style={{ textAlign: 'left', fontSize:'14px'}}>PRECIO COSTO</p>
                <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input className="form-control" type="number" placeholder="Precio costo" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} />
                </MDBInputGroup>

                
                <p style={{ textAlign: 'left', fontSize:'14px' }}>PORCENTAJE DE GANANCIA</p>
                <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input className="form-control" type="number" placeholder="Ganancia %" value={interesXGanancia} onChange={(e) => setInteresXGanacia(e.target.value)} />
                </MDBInputGroup>

                <p style={{ textAlign: 'left', fontSize:'14px' }}>PRECIO VENTA</p>
                <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input className="form-control" type="number" placeholder="Precio venta" value={precioConGanancia} onChange={(e) => setPrecioConGanancia(e.target.value)} />
                </MDBInputGroup>

                <p style={{ textAlign: 'left', fontSize:'14px'}}>PRECIO HASTA 23HS</p>
                <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input className="form-control" type="number" placeholder="Precio mayoreo" value={precioMayoreo} onChange={(e) => setPrecioMayoreo(e.target.value)} />
                </MDBInputGroup>

                <p style={{ textAlign: 'left', fontSize:'14px'}}>INV MINIMO</p>
               <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faBalanceScale} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <input className="form-control" type="number" placeholder="Inventario Minimo" value={inventarioMinimo} onChange={(e) => setInventarioMinimo(e.target.value)} />
                </MDBInputGroup>


                {/* <MDBInputGroup className="mb-3">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faCalendar} size="lg" style={{ color: "#01992f", }} />
                    </span>
                    <input
                        className="form-control"
                        type="date"
                        placeholder="Fecha de vencimiento"
                        value={fechaVencimiento}
                        onChange={(e) => {
                            const fecha = e.target.value.split('/').reverse().join('-');
                            setFechaVencimineto(fecha);
                        }}
                    />
                </MDBInputGroup> */}

                <h4 style={{display:'flex', flexDirection:'flex-start', marginTop:'50px'}}> TIPO DE VENTA</h4>

                <MDBInputGroup>
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faScaleBalanced} size="lg" style={{color: "#01992f",}} />
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
                        <FontAwesomeIcon icon={faTags} size="lg" style={{color: "#01992f",}} />
                    </span>
                    <Form.Select key={Id_categoria} aria-label="Nombre Categoria" id="categoria" value={depto} onChange={(e) => setDepto(e.target.value)}>
                        <option value="0" disabled>--Seleccione una categoria--</option>
                        {categorias.map((cat) => (
                            <option key={cat.Id_categoria} value={cat.Id_categoria}>{cat.nombre_categoria}</option>
                        ))}
                    </Form.Select>
                </MDBInputGroup>
                <br />
                <div className="row">
                    <div className="col">
                        <Button className="btn btn-success" onClick={crearProductos}>
                            <FontAwesomeIcon icon={faFloppyDisk} style={{color: '#2fd11a'}} size="lg"></FontAwesomeIcon> GUARDAR PRODUCTO
                        </Button>
                    </div>
                </div>
            </div>
            <br />
            <div className='container'>
                <input value={buscar} onChange={buscador} type="text" placeholder='Busca un producto...' className='form-control'/>
            </div>
            <br />

            <div className="container-fluid table">
                <table className="table table-striped table-hover mt-5 shadow-lg">
                    <thead className='custom-table-header'>
                        <tr>
                            <th>ID PRODUCTO</th>
                            <th>COD PRODUCTO</th>
                            <th>NOMBRE</th>
                            <th>PRECIO COSTO</th>
                            <th>PRECIO VENTA</th>
                            <th>PRECIO MAYOREO</th>
                            <th>TIPO VENTA</th>
                            <th>DEPARTAMENTO</th>
                            <th>FECHA DE CREACION</th>
                            <th>GANANCIA</th>
                            <th>ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultado.slice(primerIndex, ultimoIndex).map((val) => (
                            <tr key={val.Id_producto}>
                                <td>{val.Id_producto}</td>
                                <td>{val.codProducto}</td>
                                <td>{val.nombre_producto}</td>
                                <td className='precio-costo'><strong>{formatCurrency(val.precioCompra)}</strong></td>
                                <td className='precio-venta'><strong>{formatCurrency(val.precioVenta)}</strong></td>
                                <td className='precio-mayoreo'><strong>{formatCurrency(val.PrecioMayoreo)}</strong></td>
                                <td>{val.tipo_venta}</td>
                                <td>{val.nombre_categoria}</td>
                                <td>{new Date(val.FechaRegistro).toISOString().slice(0, 10)}</td>
                                <td>${parseFloat(val.precioVenta - val.precioCompra).toFixed(2)}</td>
                                <td><Button variant='danger' onClick={()=>{Eliminar(val)}}>ELIMINAR</Button></td>

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

            <hr />
            <button onClick={exportToExcel} style={{margin:'10px'}} className='btn btn-secondary'>Exportar a Excel</button>
            <button onClick={exportToExcel2} style={{margin:'10px'}} className='btn btn-secondary'>Exportar Catalogo</button>
        </>
    );
};

export default NuevoProduct;
