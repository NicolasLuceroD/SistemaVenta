import  { useState, useEffect, useContext } from 'react'
import { Modal, Button, Table, Form} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { MDBInputGroup } from 'mdb-react-ui-kit';
import {faCheck, faDollar, faTrash, } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import App from '../App';
import { DataContext } from '../context/DataContext';
import Paginacion from './Paginacion';
import "../css/credito.css"
import jsPDF from "jspdf";
import "jspdf-autotable";
import logoticket from '../assets/logojuana.jpg'




const CreditoProveedores = () => {

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [detalleProveedor, setDetalleProveedor] = useState([]);
  const [metodosPagos, setMetodosPagos] = useState([]);
  const [montoCredito, setMontoCredito] = useState(0);
  const [aCuenta, setAcuenta] = useState(0);
  const [buscar, setBuscar] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [ProveedorEncontrado, setProveedorEncontrado] = useState(0)
  const [IdProveedor, setIdProveedor] = useState("");
  const [nombreProveedor, setNombreProveedor] = useState("")
  const [estadoCredito, setEstadoCredito] = useState()
  const [domicilioProveedor, setDomicilioProveedor] = useState("");
  const [cuitProveedor, setCuitProveedor] = useState("");
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
  const [monto, setMonto] = useState(0)
  const [IdPagoProveedor, setIdPagoProveedor] = useState(0)


  const { URL } = useContext(DataContext);
  const idusuario = localStorage.getItem("idUsuario")

const handleShowModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);


const handleShowModal1 = () => setShowModal1(true);
const handleCloseModal1 = () => setShowModal1(false);



const obtenerDetalleProveedorCompra = (Id_proveedor) => {
  axios.get(`${URL}creditos/verElCreditoCompletoProveedor/${Id_proveedor}`).then((response) => {
    if(response.data.length === 0 ){
      Swal.fire('No hay deudas pendientes', '','info')
    }
    setDetalleProveedor(response.data);
    setMontoCredito(response.data[0].proveedores.montoCredito);
    setTelefono(response.data[0].proveedores.numTel_proveedor);
    setIdProveedor(response.data[0].proveedores.Id_proveedor); 
    setNombreProveedor(response.data[0].proveedores.nombre_proveedor)
    setCuitProveedor(response.data[0].proveedores.cuit)
    setProveedorEncontrado(1);
    setEstadoCredito(0)
  }).catch((error) => {
    console.log('error al obtener el detalle', error);
  });
};




  const [datosCompletos,setDatosCompletos] = useState([])


const obtenerMoviminetosProveedor = (Id_proveedor) => {
  axios.get(`${URL}creditos/verMovimientosProveedor/${Id_proveedor}`).then((response) => {
    console.log("Movimientos proveedor: ", response.data)
    setDatosCompletos(response.data);
    setTotal(response.data.length)
    setEstadoCredito(1)
  }).catch((error)=>{
    console.log('error al obtener los movimientos proveedores', error)
  })
}


const obtenerProveedores = () => {
  axios.get(`${URL}proveedores`).then((response) => {
    setProveedores(response.data);
    setTotal(response.data.length)
  }).catch((error)=>{
    console.log('error al obtener los proveedores', error)
  })
}


const [pago, setPago ] = useState([])
const [showModalPagos,setShowModalPagos] = useState(false)

const handleShowModalPagos = ()=> setShowModalPagos(true)
const handleCloseModalPagos = ()=> setShowModalPagos(false)

const buscarPagosProveedores = (IdPago) => {
  axios.get(`${URL}pagos/buscarPagoProveedor/${IdPago}`).then((response) => {
    setPago(response.data);
    handleShowModalPagos()
  }).catch((error)=>{
    console.log('error al obtener los proveedores', error)
  })
}

const [ordenCobro, setOrdenCobro] = useState([])
const [Id_compra, setIdCompra] = useState();

const pagarCompra = (Id_compra) => {
  setIdCompra(Id_compra)
  setOrdenCobro((prevOrdenCobro) => {
    if (prevOrdenCobro.includes(Id_compra)) {
      Swal.fire("Error", "Esta compra ya está en la orden de cobro", "error");
      return prevOrdenCobro;
    }
    if(ordenCobro.length === 1){
      Swal.fire("Error", "Ya tiene una compra seleccionada para la orden de cobro", "error");
      return prevOrdenCobro;
    }
    return [...prevOrdenCobro, Id_compra]; 
  });
};


const removerCompra = (Id_compra) => {
  setOrdenCobro(ordenCobro.filter((compra) => compra !== Id_compra));
};



const buscador = (e)=>{
  setBuscar(e.target.value)
}

let resultado = []
 if(!buscar)
 {
   resultado = proveedores
}else{  
   resultado = proveedores.filter((dato) =>
   dato.nombre_proveedor.toLowerCase().includes(buscar.toLocaleLowerCase())) 
}


useEffect(() => {
  obtenerProveedores();
}, []); 


    //PAGINACION NUEVA
    const productosPorPagina = 5
    const [actualPagina, setActualPagina] = useState(1)
    const [total, setTotal] = useState(0)
    const ultimoIndex = actualPagina * productosPorPagina;
    const primerIndex = ultimoIndex - productosPorPagina;


     const generarPDFOrdenCobro = (totalPago) => {
          const doc = new jsPDF();
        
          // Fecha y hora actual
          const fechaActual = new Date();
          const fechaTexto = `FECHA: ${fechaActual.toLocaleDateString()}`;
          const horaTexto = `HORA DE PAGO: ${fechaActual.toLocaleTimeString()}`;
        
          // Datos de la empresa
          const empresaNombre = "PAULA";
          const empresaDireccion = "Batalla de Chacabuco 813 - San Miguel de Tucuman - C.P: (4000)";
        
          // Datos del proveedor
          const proveedorNombre = nombreProveedor || "Desconocido";
          const proveedorTelefono = Telefono || "No disponible";
        
          // Logo de la empresa
          try {
            doc.addImage(logoticket, "PNG", 10, 10, 35, 30);
          } catch (error) {
            console.warn(
              "No se pudo cargar el logo. Asegúrate de que la ruta es válida.",
              error
            );
          }
        
          // Datos de la empresa, a la derecha arriba
          doc.setFontSize(12);
          doc.text(empresaNombre, 190, 15, { align: "right" });
          doc.text(empresaDireccion, 190, 22, { align: "right" });
        
          // Fecha y hora, a la derecha, debajo de la dirección
          doc.setFontSize(10);
          doc.text(fechaTexto, 190, 30, { align: "right" });
          doc.text(horaTexto, 190, 36, { align: "right" });
        
          // Línea separadora
          doc.setLineWidth(0.5);
          doc.line(10, 45, 200, 45);
        
          // Datos del proveedor
          doc.setFontSize(14);
          doc.text("DATOS DEL PROVEEDOR", 10, 55);
          doc.setFontSize(12);
          doc.text(`NOMBRE: ${proveedorNombre}`, 10, 62);
          doc.text(`TELÉFONO: ${proveedorTelefono}`, 10, 68);
        
          //Tabla de órdenes de cobro
          const detalleOrdenes = detalleProveedor
          .filter((compra) => ordenCobro.includes(compra.Id_compra))
          .map((compra) => [
            compra.Id_compra.toString(),                                 
            compra.FechaRegistro
              ? new Date(compra.FechaRegistro).toLocaleDateString()
              : "-",                                                        
            compra.descripcion_compra || "-",                            
            `${formatCurrency(compra.totalCompra)}`                 
          ]);

        
          doc.autoTable({
            startY: 80,
            head: [["FOLIO", "FECHA", "DESCRIPCION", "TOTAL COMPRA"]],
            body: detalleOrdenes,
            theme: "grid",
            headStyles: {
              fillColor: [210, 180, 140], // azul claro
              textColor: 255, // blanco
              fontStyle: "bold",
            },
            bodyStyles: {
              textColor: 50,
            },
            alternateRowStyles: {
              fillColor: [240, 240, 240], // gris claro para filas alternas
            },
          });
        
          // Total a pagar y total pagado
          doc.setFontSize(14);
          doc.text(
            `SALDO TOTAL DEL PROVEEDOR: ${formatCurrency(montoCredito)}`,
            10,
            doc.lastAutoTable.finalY + 20
          );
          doc.text(
            `TOTAL PAGADO: ${formatCurrency(monto)}`,
            10,
            doc.lastAutoTable.finalY + 30
          );
        
          // Guardar el PDF
          doc.save(`OrdenCobro_${nombreProveedor}.pdf`);
        };
    // const generarPDFOrdenCobro = (totalPago) => {
    //   const doc = new jsPDF();
    
    //   // Datos de la empresa
    //   const empresaNombre = "Bunker Market";
    //   const empresaDireccion = "Av Avellaneda 99 - San Miguel de Tucuman - C.P: (4000)";
    
    //   // Datos del proveedor
    //   const proveedorNombre = nombreProveedor || "Desconocido";
    //   const proveedorTelefono = Telefono || "No disponible";
    //   // Logo de la empresa
    //   try {
    //     doc.addImage(logomarket, "PNG", 10, 10, 50, 20);
    //   } catch (error) {
    //     console.warn(
    //       "No se pudo cargar el logo. Asegúrate de que la ruta es válida.",
    //       error
    //     );
    //   }
    
    //   // Datos de la empresa
    //   doc.setFontSize(12);
    //   doc.text(empresaNombre, 150, 15, { align: "right" });
    //   doc.text(empresaDireccion, 190, 20, { align: "right" });
    
    //   // Línea separadora
    //   doc.setLineWidth(0.5);
    //   doc.line(10, 40, 200, 40);
    
    //   // Datos del proveedor
    //   doc.setFontSize(14);
    //   doc.text("Datos del Proveedor:", 10, 50);
    //   doc.setFontSize(12);
    //   doc.text(`Nombre: ${proveedorNombre}`, 10, 55);
    //   doc.text(`Teléfono: ${proveedorTelefono}`, 10, 60);
    
    //   // Tabla de órdenes de cobro
    //   const detalleOrdenes = detalleProveedor
    //     .filter((compra) => ordenCobro.includes(compra.Id_compra))
    //     .map((compra) => [
    //       compra.Id_compra.toString(),
    //       compra.FechaRegistro
    //         ? new Date(compra.FechaRegistro).toLocaleDateString()
    //         : "-",
    //       `$${parseFloat(compra.totalCompra).toFixed(2)}`, 
    //       compra.productos
    //     ]);
    //   doc.autoTable({
    //     startY: 80,
    //     head: [["Folio", "Fecha", "Total Compra",]],
    //     body: detalleOrdenes,
    //     theme: "grid",
    //     headStyles: {
    //       fillColor: [100, 150, 200], // Color tranquilo (azul claro)
    //       textColor: 255, // Blanco para el texto
    //       fontStyle: "bold",
    //     },
    //     bodyStyles: {
    //       textColor: 50,
    //     },
    //     alternateRowStyles: {
    //       fillColor: [240, 240, 240], // Color gris claro para las filas alternadas
    //     },
    //   });
    //   // Total a pagar
    //   doc.setFontSize(14);
    //   doc.text(
    //     `Total a pagar: $${parseFloat(totalPago).toFixed(2)}`, // Aseguramos formato correcto
    //     10,
    //     doc.lastAutoTable.finalY + 20,
    //   )
    //     doc.text(
    //       `Total a pagado: $${parseFloat(monto).toFixed(2)}`,
    //       10,
    //       doc.lastAutoTable.finalY + 30
    //   );
    //   // Fecha
    //   const fechaActual = new Date();
    //   const fechaTexto = `Fecha: ${fechaActual.toLocaleDateString()} ${fechaActual.toLocaleTimeString()}`;
    //   doc.text(fechaTexto, 10, doc.lastAutoTable.finalY + 40);
    //   // Guardar el PDF
    //   doc.save(`OrdenCobro_${proveedorNombre}.pdf`);
    // };


    const verMetodosPagos = () =>{
      axios.get(`${URL}metodoPago`).then((response)=>{
        setMetodosPagos(response.data)
      }).catch((error)=>{
        console.log('Error al obtener los metodos de pago', error)
      })
    }
    
    const generarOrdenCobro = async () => {
      if (!metodoPagoSeleccionado) {
        Swal.fire("Error", "Debe seleccionar un método de pago", "error");
        return;
      }
      if (monto <= 0) {
        Swal.fire("Error", "Debe poner un monto de pago valido", "error");
        return;
      }
      Swal.fire({
        title: "¿Está seguro?",
        text: "Está a punto de generar la orden de cobro.",
        input: 'textarea',
        inputLabel: 'Escribe alguna observacion...',
        inputPlaceholder: 'Observacion...',
        inputAttributes: {
          'aria-label': 'Observacion'
        },
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, generar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const observacion = result.value
          try {
            await Promise.all(
              ordenCobro.map(async () => {
                await axios.put(`${URL}creditos/restarTotalApagarProveedores`, {
                  Id_compra: Id_compra,  
                  faltaPagar: monto,
                });
              })
            );
            const totalPago = detalleProveedor
              .filter((compra) => ordenCobro.includes(compra.Id_compra))
              .reduce((total, compra) => parseFloat(total) + parseFloat(compra.totalCompra), 0);
              await axios.put(`${URL}creditos/restarDeudaProveedor`, {
              Id_proveedor: IdProveedor,
              montoCredito: monto,
            });
            await axios.post(`${URL}creditos/pagosProveedores`, {
              Id_proveedor: IdProveedor,
              Id_metodoPago: metodoPagoSeleccionado,
              monto: monto,
              Id_compra: Id_compra,
              montoCreditoActual:  montoCredito - monto,
              Id_usuario: idusuario,
              observaciones: observacion
            });
            await axios.post(`${URL}creditos/movimientoProveedores`, {
              Id_proveedor: IdProveedor,
              montoCredito: 0,
              montoDebito: monto,
              Saldo: montoCredito - monto
            });
            generarPDFOrdenCobro(totalPago);
            Swal.fire("Éxito", "Orden de cobro generada correctamente", "success").then(() => {
              window.location.reload();
            });
          } catch (error) {
            console.error("Error al generar la orden de cobro:", error);
            Swal.fire("Error", "No se pudo generar la orden de cobro", "error");
          }
        }
      });
    };

      const [compras,setCompras] = useState([])
      const [showModalCompras,setShowModalCompras] = useState(false)
      const handleShowModalCompras =()=> setShowModalCompras(true)
      const handleCloseModalCompras =()=> setShowModalCompras(false)

    const buscarComprasProveedor = (Id_proveedor) =>{
      axios.get(`${URL}creditos/buscarCompraProveedor/${Id_proveedor}`).then((response) => {
        setCompras(response.data)
        handleShowModalCompra()
      })
      .catch((error) => console.log("Error al obtener compras:", error));
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
      }).format(value);
    };

    useEffect(() => {
      verMetodosPagos()
    }, []);

  return (
  <>
  <App/>

  <div className='h3-ventas'>
  <h1>CUENTAS CREDITOS PROVEEDORES</h1>
  </div><br />
  <h2><strong>ADMINISTRACION DE CUENTAS CORRIENTES</strong></h2>
      <br />

      <Button onClick={handleShowModal} style={{backgroundColor:'#C7523D', border:'none'}} >MOSTRAR PROVEEDORES</Button><br /><br />
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>VER ESTADO DE CUENTA PROVEEDORES</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input value={buscar} onChange={buscador} type="text" placeholder='Busca un proveedor...' className='form-control' /><br />
        
         <div className='container table'>
          <Table striped bordered hover className='custom-table'>
            <thead className='custom-table-header'>
              <tr>
                <th>NOMBRE</th>
                <th>CREDITOS</th>  
                <th>MOVIMIENTOS</th>  
              </tr>
            </thead>
            <tbody>
              {resultado.slice(primerIndex, ultimoIndex).map((proveedor) => (
                <tr key={proveedor.Id_proveedor}>
                  <td>{proveedor.nombre_proveedor}</td>
                  <td>
                  <Button onClick={() => obtenerDetalleProveedorCompra(proveedor.Id_proveedor)} style={{ backgroundColor: '#FF914D', color: 'white', border: 'none' }}>
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  </td>
                  <td>
                  <Button variant="danger"  onClick={() => obtenerMoviminetosProveedor(proveedor.Id_proveedor)}><FontAwesomeIcon icon={faDollar} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
                <Paginacion 
                    productosPorPagina={productosPorPagina} 
                    actualPagina={actualPagina} 
                    setActualPagina={setActualPagina} 
                    total={total}
                  />
          </div>  
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            CERRAR
          </Button>
        </Modal.Footer>
      </Modal>
      
      
      <Modal show={showModal1} onHide={handleCloseModal1}>
        <Modal.Header closeButton>
          <Modal.Title>PAGO CUENTA PROVEEDORES</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h4>MONTO A ABONAR: ${montoCredito} </h4>
        <MDBInputGroup className="mb-3">
        <span className="input-group-text">
          <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#012541",}} />
        </span>
          <input className="form-control" type="number" placeholder="" value={aCuenta} onChange={(e) => setAcuenta(e.target.value)} />
        </MDBInputGroup>
          <Button>PAGAR</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal1}>
            CERRAR
          </Button>
        </Modal.Footer>
      </Modal>

            {ProveedorEncontrado === 1 ? 
              <div className="container deuda-container">
              <div className="row">
                <div className="col">PROVEEDOR: {nombreProveedor}</div>
                <div className="col"><span style={{color: 'red'}}>SALDO</span>: <strong>{formatCurrency(montoCredito)}</strong> </div>
              </div>
            </div>
            :
            <div> </div>
            }
            <div>
              <br />  <br /> 
              {estadoCredito === 0 ? 
               <div className='container table'>
               <h5>COMPRAS SIN PAGAR</h5>
               <Table striped bordered hover className='custom-table'>
                  <thead className='custom-table-header'>
                    <tr>
                      <th>Nº COMPRA</th>
                      <th>TOTAL COMPRA</th>
                      <th>TOTAL DEUDA</th>
                      <th>FECHA REGISTRO</th>
                      <th>PAGAR</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {detalleProveedor.map((dt) => (
                      <tr key={dt.Id_compra}>
                        <td>{dt.Id_compra}</td>
                        <td className='precio2'>{formatCurrency(dt.totalCompra)}</td>
                        <td className='precio2'>{formatCurrency(dt.faltaPagar)}</td>
                        <td>{new Date(dt.FechaRegistro).toLocaleString()}</td>
                        <td>
                          {!ordenCobro.includes(dt.Id_compra) && ( 
                            <Button onClick={() => pagarCompra(dt.Id_compra)}>
                              <FontAwesomeIcon icon={faCheck} size="lg" style={{ color: "#012541" }} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              : 
              <></>}

{estadoCredito === 0 ? 
      <>
             <div className="container mt-3">
      <h5>Seleccionar Método de Pago</h5>
      <Form.Select
        value={metodoPagoSeleccionado}
        onChange={(e) => setMetodoPagoSeleccionado(Number(e.target.value))}
      >
        <option value="">-- Seleccione un método de pago --</option>
        {metodosPagos.map((metodo) => (
          <option key={metodo.Id_metodoPago} value={metodo.Id_metodoPago}>
            {metodo.tipo_metodoPago}
          </option>
        ))}
      </Form.Select><br /><br />

      <div className="row mb-4">
      <h5>Datos del pago</h5>
    <div className="col-md-3">
      <label htmlFor="tipo-proveedor" className="form-label">Monto</label>
      <input
        id="tipo-proveedor"
        className="form-control"
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e)=>setMonto(e.target.value)}
      />
    </div>
      </div>
      <br />
            <h5>Órdenes de Pago Seleccionadas:</h5>
            {ordenCobro.length > 0 ? (
              <Table striped bordered hover className="custom-table">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleProveedor
                    .filter((compra) => ordenCobro.includes(compra.Id_compra))
                    .map((compra) => (
                      <tr key={compra.Id_compra}>
                        <td>{compra.Id_compra}</td>
                        <td>{formatCurrency(compra.faltaPagar)}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => removerCompra(compra.Id_compra)}
                          >
                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>

            ) : (
              <p>No se han agregado compras a la orden de cobro.</p>
            )}
          </div>
          <div className="container deuda-container mt-3">
          {ProveedorEncontrado === 1 && estadoCredito === 0 ? (
            <Button
              variant="success"
              onClick={generarOrdenCobro}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "10px 20px",
                border: "none",
              }}
            >
              Generar Orden de Pago
            </Button>   
          ) : null}
        </div>
        </>
: <></>}
             <div className='container table'>
              {estadoCredito === 1 ? 
            <Table striped bordered hover className='custom-table'>
                          <thead className='custom-table-header'>
                            <tr>
                              <th>Nº MOVIMIENTO</th>
                              <th>FECHA REGISTRO</th>
                              <th>DESCRIPCION</th>
                              <th>CREDITO</th>
                              <th>DEBITO</th>
                              <th>SALDO</th>
                            </tr>
                          </thead>
                          <tbody>
              {datosCompletos.map((dt, index) => (
                <tr key={`${dt.NroMovimiento}-${index}`}>
                  <td>{dt.NroMovimiento}</td>
                  <td>{new Date(dt.FechaMovimiento).toLocaleString()}</td>
                  <td>{dt.Credito !== "0.00" ? "COMPRA" : dt.Debito !== "0.00" ? "PAGO" : ""}</td>
                  <td>{dt.Credito === "0.00" ? "-" : ` ${formatCurrency(dt.Credito)}`}</td>
                  <td>{dt.Debito === "0.00" ? "-" : `${formatCurrency(dt.Debito)}`}</td>
                  <td>{formatCurrency(dt.Saldo)}</td>
                </tr>
              ))}
            </tbody>
            </Table>
            :
              <></>
            }
            </div>
            
            </div>




             <Modal size='xl' show={showModalPagos} onHide={handleCloseModalPagos}>
                  <Modal.Header closeButton>
                    <Modal.Title>VER DETALLE PAGO</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="container table">
                  <Table striped bordered hover className='custom-table'>
              <thead className='custom-table-header'>
                <tr>
                  <th>Nº PAGO</th>
                  <th>FECHA</th>
                  <th>METODO</th>
                  <th>Nº COMPROBANTE</th>
                  <th>BANCO</th>
                  <th>Nº CC</th>
                  <th>CUIT CC</th>
                  <th>VER</th>
                  <th>MONTO</th>
                </tr>
              </thead>
              <tbody>
                {pago.map((dt) => (
                  <tr key={dt.IdPago}>
                   <td>{dt.IdPago}</td>
                   <td>{new Date(dt.fechaEmision).toLocaleDateString()}</td>
                   <td>{dt.tipo_metodoPago || "-"}</td>
                   <td>{dt.nroCoprobante || "-"}</td>
                    <td>{dt.nombreBanco || "-"} </td>
                    <td>{dt.nroCuentaCorriente || "-"}</td>
                    <td>{dt.cuitCuentaCorriente || "-"}</td>
                    <td> 
                    <span
                    onClick={() => buscarComprasProveedor(dt.Id_compra)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    >
                    #{dt.Id_compra}
                    </span>
                    </td>
                    <td>${dt.monto || "0"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseModalPagos}>
                      Cerrar
                    </Button>
                  </Modal.Footer>
                </Modal>
            
                <Modal size='xl' show={showModalCompras} onHide={handleCloseModalCompras}>
                  <Modal.Header closeButton>
                    <Modal.Title>VER DETALLE COMPRA</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="container table">
        <table className="table table-striped table-hover mt-5 shadow-lg tabla-expedicion">
          <thead className="custom-table-header-expedicion">
            <tr className="table-success">
              <th>Nº COMPRA</th>
              <th>FECHA</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
              {compras.map((compra, index) => (
                <tr key={compra.Id_compra}>
                  <td>{compra.Id_compra}</td>
                  <td>{new Date(compra.fecha_registro).toLocaleString()}</td>
                  <td>${compra.totalCompra}</td>
                </tr>
              ))}
            </tbody>
                  </table>
                </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseModalCompras}>
                      Cerrar
                    </Button>
                  </Modal.Footer>
                </Modal>
  </>
  )
}

export default CreditoProveedores

