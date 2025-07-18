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
import logoticket from '../assets/fondo-varista.jpg'


const Credito = () => {

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModalDetalleEnCredito, setShowModalDetalleEnCredito] = useState(false)
  const [clientes, setClientes] = useState([]);
  const [detalleCliente, setDetalleCliente] = useState([]);
  const [metodosPagos, setMetodosPagos] = useState([]);
  const [montoCredito, setMontoCredito] = useState('');
  const [aCuenta, setAcuenta] = useState(0);
  const [buscar, setBuscar] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [ClienteEncontrado, setClienteEncontrado] = useState(0)
  const [idCliente, setIdCliente] = useState("");
  const [nombreCliente, setNombreCliente] = useState("")
  const [estadoCredito, setEstadoCredito] = useState()
  const [domicilioCliente, setDomicilioCliente] = useState("");
  const [cuitCliente, setCuitCliente] = useState("");
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
  const [monto, setMonto] = useState(0)

  const [detalleventaencredito, setDetalleVentaEnCredito] = useState([])
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  // const [modaldetalleencredito, setModalDetalleEnCredito] = useState(false);

  const { URL } = useContext(DataContext);

const handleShowModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);


const handleShowModal1 = () => setShowModal1(true);
const handleCloseModal1 = () => setShowModal1(false);

const handleShowModalDetalleEnCredito = () => setShowModalDetalleEnCredito(true)
const handleCloseModalDetalleEnCredito = () => setShowModalDetalleEnCredito(false)


const obtenerDetalleClienteVenta = (Id_cliente) => {
  axios.get(`${URL}creditos/${Id_cliente}`, {
    params: {
      Id_cliente: Id_cliente,
    }
  }).then((response) => {
    if(response.data.length === 0 ){
      Swal.fire('No hay deudas pendientes', '','info')
    }
    setDetalleCliente(response.data);
    setMontoCredito(response.data[0].cliente.montoCredito);
    setTelefono(response.data[0].cliente.telefono_cliente);
    setIdCliente(response.data[0].cliente.Id_cliente); 
    setNombreCliente(response.data[0].cliente.nombre_cliente)
    setDomicilioCliente(response.data[0].cliente.domicilio_cliente)
    setCuitCliente(response.data[0].cliente.cuit)
    setClienteEncontrado(1);
    setEstadoCredito(0)
  }).catch((error) => {
    console.log('error al obtener el detalle', error);
  });
};


const sucursalId = localStorage.getItem("sucursalId")
const [datosCompletos,setDatosCompletos] = useState([])


const obtenerMoviminetosCliente = (Id_cliente) => {
  axios.get(`${URL}creditos/verMovimientosCliente/${Id_cliente}`).then((response) => {
    setDatosCompletos(response.data);
    setTotal(response.data.length)
    setEstadoCredito(1)
  }).catch((error)=>{
    console.log('error al obtener los clientes', error)
  })
}


const obtenerClientes = () => {
  axios.get(`${URL}clientes/${sucursalId}`).then((response) => {
    console.log("clientes: ", response.data)
    setClientes(response.data);
    setTotal(response.data.length)
  }).catch((error)=>{
    console.log('error al obtener los clientes', error)
  })
}


const [pago, setPago ] = useState([])
const [showModalPagos,setShowModalPagos] = useState(false)

const handleShowModalPagos = ()=> setShowModalPagos(true)
const handleCloseModalPagos = ()=> setShowModalPagos(false)

const buscarPagosCliente = (IdPago) => {
  axios.get(`${URL}pagos/buscarPagoCliente/${IdPago}`).then((response) => {
    setPago(response.data);
    handleShowModalPagos()
  }).catch((error)=>{
    console.log('error al obtener los clientes', error)
  })
}

const [ordenCobro, setOrdenCobro] = useState([])
const [IdVenta, setIdVenta] = useState();

const pagarVenta = (Id_venta) => {
  setIdVenta(Id_venta)
  setOrdenCobro((prevOrdenCobro) => {
    if (prevOrdenCobro.includes(Id_venta)) {
      Swal.fire("Error", "Esta venta ya está en la orden de cobro", "error");
      return prevOrdenCobro;
    }
    if(ordenCobro.length === 1){
      Swal.fire("Error", "Ya tiene una venta seleccionada para la orden de cobro", "error");
      return prevOrdenCobro;
    }
    return [...prevOrdenCobro, Id_venta]; 
  });
};


const removerVenta = (Id_venta) => {
  setOrdenCobro(ordenCobro.filter((venta) => venta !== Id_venta));
};



const buscador = (e)=>{
  setBuscar(e.target.value)
}

let resultado = []
 if(!buscar)
 {
   resultado = clientes
}else{  
   resultado = clientes.filter((dato) =>
   dato.nombre_cliente.toLowerCase().includes(buscar.toLocaleLowerCase())) 
}

const obtenerDetalleMovimiento = (idMovimiento) => {
  axios.get(`${URL}creditos/verDetalleVentaEnCredito/${idMovimiento}`).then((response) => {
    console.log("Detalle de la venta en credito: ", response.data)
    setDetalleVentaEnCredito(response.data)
    setVentaSeleccionada(idMovimiento);
  }).catch((err) => {
    console.error('Error al obtener el detalle de la venta en credito', err)
  })
}


useEffect(() => {
  obtenerClientes();
  obtenerDetalleMovimiento()
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
      const empresaNombre = "El Varista";
      const empresaDireccion = "Av. Alem 224 - Tafí Viejo - C.P: (4103)";
    
      // Datos del proveedor
      const clienteNombre = nombreCliente || "Desconocido";
      const clienteTelefono = Telefono || "No disponible";
    
      // Logo de la empresa
      try {
        doc.addImage(logoticket, "PNG", 10, 10, 50, 30);
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
      doc.text("DATOS DEL CLIENTE", 10, 55);
      doc.setFontSize(12);
      doc.text(`NOMBRE: ${clienteNombre}`, 10, 62);
      doc.text(`TELÉFONO: ${clienteTelefono}`, 10, 68);
    
      // Tabla de órdenes de cobro
      const detalleOrdenes = detalleCliente
        .filter((venta) => ordenCobro.includes(venta.Id_venta))
        .map((venta) => [
          venta.Id_venta.toString(),
          venta.fecha_registro
            ? new Date(venta.fecha_registro).toLocaleDateString()
            : "-",
            venta.productos
              ? venta.productos.map((p) => p.nombre_producto).join(", ")
              : "-",
          `${formatCurrency(venta.precioTotal_venta)}`,
        ]);
    
      doc.autoTable({
        startY: 80,
        head: [["FOLIO", "FECHA", "PRODUCTOS", "TOTAL VENTA"]],
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
        `SALDO TOTAL DEL CLIENTE: ${formatCurrency(montoCredito)}`,
        10,
        doc.lastAutoTable.finalY + 20
      );
      doc.text(
        `TOTAL PAGADO: ${formatCurrency(monto)}`,
        10,
        doc.lastAutoTable.finalY + 30
      );
    
      // Guardar el PDF
      doc.save(`OrdenCobro_${clienteNombre}.pdf`);
    };
    // const generarPDFOrdenCobro = (totalPago) => {
    //   const doc = new jsPDF();
    
    //   // Datos de la empresa
    //   const empresaNombre = "Bunker Market";
    //   const empresaDireccion = "Av Avellaneda 99 - San Miguel de Tucuman - C.P: (4000)";
    
    //   // Datos del cliente
    //   const clienteNombre = nombreCliente || "Desconocido";
    //   const clienteTelefono = Telefono || "No disponible";
    //   const DomicilioCliente = domicilioCliente || "No disponible";
    
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
    
    //   // Datos del cliente
    //   doc.setFontSize(14);
    //   doc.text("Datos del Cliente:", 10, 50);
    //   doc.setFontSize(12);
    //   doc.text(`Nombre: ${clienteNombre}`, 10, 55);
    //   doc.text(`Teléfono: ${clienteTelefono}`, 10, 60);
    //   doc.text(`Domicilio: ${DomicilioCliente}`, 10, 65);
    //   // doc.text(`CUIT: ${CuitCliente}`, 10, 70);
    
    //   // Tabla de órdenes de cobro
    //   const detalleOrdenes = detalleCliente
    //     .filter((venta) => ordenCobro.includes(venta.Id_venta))
    //     .map((venta) => [
    //       venta.Id_venta.toString(),
    //       venta.fecha_registro
    //         ? new Date(venta.fecha_registro).toLocaleDateString()
    //         : "-",
    //       `$${parseFloat(venta.precioTotal_venta).toFixed(2)}`, 
    //       venta.productos
    //         ? venta.productos.map((p) => p.nombre_producto).join(", ")
    //         : "-",
    //     ]);
    
    //   doc.autoTable({
    //     startY: 80,
    //     head: [["Folio", "Fecha", "Total Venta", "Productos"]],
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
    //       `Total a pagado: $${parseFloat(monto).toFixed(2)}`, // Aseguramos formato correcto
    //       10,
    //       doc.lastAutoTable.finalY + 30
    //   );
    
    //   // Fecha
    //   const fechaActual = new Date();
    //   const fechaTexto = `Fecha: ${fechaActual.toLocaleDateString()} ${fechaActual.toLocaleTimeString()}`;
    //   doc.text(fechaTexto, 10, doc.lastAutoTable.finalY + 40);
    
    //   // Guardar el PDF
    //   doc.save(`OrdenCobro_${clienteNombre}.pdf`);
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
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, generar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await Promise.all(
              ordenCobro.map(async () => {
                await axios.put(`${URL}creditos/restarTotalApagar`, {
                  Id_venta: IdVenta,  
                  faltaPagar: monto,
                });
              })
            );
            const totalPago = detalleCliente
              .filter((venta) => ordenCobro.includes(venta.Id_venta))
              .reduce((total, venta) => parseFloat(total) + parseFloat(venta.precioTotal_venta), 0);
              await axios.put(`${URL}creditos/restarCredito`, {
              Id_cliente: detalleCliente[0]?.cliente.Id_cliente,
              montoCredito: monto,
            });
            await axios.post(`${URL}creditos/pagosClientes`, {
              Id_cliente: detalleCliente[0]?.cliente.Id_cliente,
              Id_metodoPago: metodoPagoSeleccionado,
              monto: monto,
              Id_venta: IdVenta,
              montoCreditoActual:  montoCredito - monto,
            });
            await axios.post(`${URL}creditos/movimientoClientes`, {
              Id_cliente: detalleCliente[0]?.cliente.Id_cliente,
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
                   


      const [ventas,setVentas] = useState([])
      const [showModalVenta,setShowModalVenta] = useState(false)
      const handleShowModalVenta =()=> setShowModalVenta(true)
      const handleCloseModalVenta =()=> setShowModalVenta(false)

    const buscarVentasCliente = (Id_venta) =>{
      axios.get(`${URL}creditos/buscarVentaCliente/${Id_venta}`).then((response) => {
        setVentas(response.data)
        handleShowModalVenta()
      })
      .catch((error) => console.log("Error al obtener ventas:", error));
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
  <h1>CUENTAS CREDITOS CLIENTES</h1>
  </div><br />
  <h2><strong>ADMINISTRACION DE CUENTAS CORRIENTES</strong></h2>
      <br />

      <Button onClick={handleShowModal} style={{backgroundColor:'#C7523D', border:'none'}} >MOSTRAR CLIENTES</Button><br /><br />
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>VER ESTADO DE CUENTA CLIENTES</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input value={buscar} onChange={buscador} type="text" placeholder='Busca un cliente...' className='form-control' /><br />
        
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
              {resultado.slice(primerIndex, ultimoIndex).map((cliente) => (
                <tr key={cliente.Id_cliente}>
                  <td>{cliente.nombre_cliente}</td>
                  <td>
                  <Button onClick={() => obtenerDetalleClienteVenta(cliente.Id_cliente)} style={{ backgroundColor: '#6d4c41', color: 'white', border: 'none' }}>
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  </td>
                  <td>
                  <Button variant="danger"  onClick={() => obtenerMoviminetosCliente(cliente.Id_cliente)}><FontAwesomeIcon icon={faDollar} /></Button>
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
          <Modal.Title>PAGO CUENTA CLIENTES</Modal.Title>
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

            {ClienteEncontrado === 1 ? 
              <div className="container deuda-container">
              <div className="row">
                <div className="col">CLIENTE: {nombreCliente}</div>
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
               <h5>VENTAS SIN PAGAR</h5>
               <Table striped bordered hover className='custom-table'>
                  <thead className='custom-table-header'>
                    <tr>
                      <th>Nº VENTA</th>
                      <th>PRODUCTO / PROMOCIÓN</th>
                      <th>CANTIDAD</th>
                      <th>PRECIO UNITARIO</th>
                      <th>TOTAL PEDIDO</th>
                      <th>TOTAL DEUDA</th>
                      <th>FECHA REGISTRO</th>
                      <th>COBRAR</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {detalleCliente.map((dt) => (
                      <tr key={dt.Id_venta}>
                        <td>{dt.Id_venta}</td>
                        <td>
                          {dt.productos && dt.productos.length > 0 ? (
                            <ul>
                              {dt.productos.map((producto) => (
                                <li key={`P-${producto.Id_producto}`} style={{ marginLeft: '20px' }}>
                                  {producto.nombre_producto}
                                </li>
                              ))}
                            </ul>
                          ) : <span>Sin productos</span>}
                          {dt.paquetes && dt.paquetes.length > 0 ? (
                            <ul>
                              {dt.paquetes.map((promo) => (
                                <li key={`PR-${promo.Id_paquete}`} style={{ marginLeft: '20px' }}>
                                  {promo.nombre_paquete}
                                </li>
                              ))}
                            </ul>
                          ) : ""}
                        </td>
                        <td>
                          {dt.productos && dt.productos.length > 0 ? (
                            <ul>
                              {dt.productos.map((producto) => (
                                <li key={`Q-P-${producto.Id_producto}`} style={{ marginLeft: '20px' }}>
                                  {Math.round(parseFloat(producto.CantidadVendida))}
                                </li>
                              ))}
                            </ul>
                          ) : <span>0</span>}
                          {/* {dt.promociones && dt.promociones.length > 0 ? (
                            <ul>
                              {dt.promociones.map((promo) => (
                                <li key={`Q-PR-${promo.IdPromocion}`} style={{ marginLeft: '20px' }}>
                                  {Math.round(parseFloat(promo.CantidadVendida))}
                                </li>
                              ))}
                            </ul>
                          ) : ""} */}
                        </td>
                        <td className='precio'>
                          {dt.productos && dt.productos.length > 0 ? (
                            <ul>
                              {dt.productos.map((producto) => (
                                <li key={`P-Price-${producto.Id_producto}`} style={{ marginLeft: '20px' }}>
                                  {formatCurrency(producto.precioVenta)}
                                </li>
                              ))}
                            </ul>
                          ) : <span>No disponible</span>}
                          {/* {dt.promociones && dt.promociones.length > 0 ? (
                            <ul>
                              {dt.promociones.map((promo) => (
                                <li key={`PR-Price-${promo.IdPromocion}`} style={{ marginLeft: '20px' }}>
                                  $ {parseFloat(promo.precioVentaPromocion).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          ) : ""} */}
                        </td>
                        <td className='precio2'>{formatCurrency(dt.precioTotal_venta)}</td>
                        <td className='precio2'>{formatCurrency(dt.faltaPagar)}</td>
                        <td>{new Date(dt.fecha_registro).toLocaleString()}</td>
                        <td>
                          {!ordenCobro.includes(dt.Id_venta) && ( 
                            <Button onClick={() => pagarVenta(dt.Id_venta)}>
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
      <label htmlFor="tipo-cliente" className="form-label">Monto</label>
      <input
        id="tipo-cliente"
        className="form-control"
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e)=>setMonto(e.target.value)}
      />
    </div>
      </div>
      <br />
            <h5>Órdenes de Cobro Seleccionadas:</h5>
            {ordenCobro.length > 0 ? (
              <Table striped bordered hover className="custom-table">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleCliente
                    .filter((venta) => ordenCobro.includes(venta.Id_venta))
                    .map((venta) => (
                      <tr key={venta.Id_venta}>
                        <td>{venta.Id_venta}</td>
                        <td>{venta.productos &&
                        venta.productos.map((producto) => producto.nombre_producto).join(", ")}
                        </td>
                        <td>{formatCurrency(venta.faltaPagar)}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => removerVenta(venta.Id_venta)}
                          >
                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>

            ) : (
              <p>No se han agregado ventas a la orden de cobro.</p>
            )}
          </div>
          <div className="container deuda-container mt-3">
          {ClienteEncontrado === 1 && estadoCredito === 0 ? (
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
              Generar Orden de Cobro
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
                  <th>DETALLE</th>
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
      <td>{dt.Credito !== "0.00" ? "VENTA" : dt.Debito !== "0.00" ? "PAGO" : ""}</td>
      <td>
        {dt.Credito !== "0.00" ? (
          <Button size="sm" onClick={() => {
              obtenerDetalleMovimiento(dt.NroMovimiento);
              handleShowModalDetalleEnCredito(); 
            }}
          >
            VER
</Button>
        ) : (
          "-"
        )}
      </td>
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
                    onClick={() => buscarVentasCliente(dt.Id_venta)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    >
                    #{dt.Id_venta}
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
            


                <Modal size='xl' show={showModalVenta} onHide={handleCloseModalVenta}>
                  <Modal.Header closeButton>
                    <Modal.Title>VER DETALLE VENTA</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="container table">
        <table className="table table-striped table-hover mt-5 shadow-lg tabla-expedicion">
          <thead className="custom-table-header-expedicion">
            <tr className="table-success">
              <th>Nº VENTA</th>
              <th>FECHA</th>
              <th>PRODUCTOS</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
              {ventas.map((venta, index) => (
                <tr key={venta.Id_venta}>
                  <td>{venta.Id_venta}</td>
                  <td>{new Date(venta.fecha_registro).toLocaleString()}</td>
                  <td>
                    {venta.productoterminado.length > 0 ? (
                      <ul>
                        {venta.productoterminado.map((producto) => (
                          <li key={producto.IdProductoTerminado}>{producto.Nombre}</li>
                        ))}
                      </ul>
                    ) : "Sin productos"}
                    {venta.promociones.length > 0 ? (
                      <ul>
                        {venta.promociones.map((promo) => (
                          <li key={promo.IdPromocion}>{promo.Nombre}</li>
                        ))}
                      </ul>
                    ) : ""}
                  </td>
                  <td>${venta.precioTotal_venta}</td>
                </tr>
              ))}
            </tbody>

                  </table>
                </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseModalVenta}>
                      Cerrar
                    </Button>
                  </Modal.Footer>
                </Modal>


               <Modal show={showModalDetalleEnCredito} onHide={handleCloseModalDetalleEnCredito} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Detalle de Venta - Movimiento #{ventaSeleccionada}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
      <Table striped bordered hover>
  <thead className='custom-table-header'>
    <tr>
      <th>PRODUCTO</th>
      <th>CANTIDAD</th>
    </tr>
  </thead>
  <tbody>
    {detalleventaencredito.map((prod, i) => (
      <tr key={i}>
        <td>{prod.nombre_producto}</td>
        <td>{parseInt(prod.CantidadVendida)}</td>
      </tr>
    ))}
    <tr>
      <td style={{ fontWeight: 'bold', textAlign: 'right' }}>TOTAL DE LA VENTA</td>
      <td style={{ fontWeight: 'bold' }}>
        {formatCurrency(detalleventaencredito[0]?.precioTotal_venta || 0)}
      </td>
    </tr>
  </tbody>
</Table>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="warning" onClick={handleCloseModalDetalleEnCredito}>
      CERRAR
    </Button>
  </Modal.Footer>
</Modal>


  </>
  )
}

export default Credito



