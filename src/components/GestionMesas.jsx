import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { DataContext } from '../context/DataContext';
import App from '../App';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import logoticket from '../assets/fondo-varista.jpg'

const GestionMesas = () => {
  const { productos, URL } = useContext(DataContext);

  const [showModal, setShowModal] = useState(false);
  const [vuelto, setVuelto] = useState(0);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("")
  const [verMetodoPago, setVerMetodoPago] = useState([])
  const [intereses, setIntereses] = useState(0)
  const [verCliente, setVerCliente] = useState([])
  const [Id_Cliente, setId_Cliente] = useState(1);
  const [limiteCredito, setLimiteCredito] = useState(0)
  const [creditoActaul, setCreditoActual] = useState(0)
    const [efectivo, setEfectivo] = useState(null);
    const [tarjeta, setTarjeta] = useState(null);
    const [transferencia, setTransferencia] = useState(null);

  const [mesas, setMesas] = useState(() => {
    const guardadas = localStorage.getItem("mesas");
    return guardadas
      ? JSON.parse(guardadas)
      : [
          { id: 1, nombre: 'Mesa A1', estado: 'libre', productos: [] },
          { id: 2, nombre: 'Mesa A2', estado: 'libre', productos: [] },
          { id: 3, nombre: 'Mesa A3', estado: 'libre', productos: [] },
          { id: 4, nombre: 'Mesa A4', estado: 'libre', productos: [] },
          { id: 5, nombre: 'Mesa A5', estado: 'libre', productos: [] },
          { id: 6, nombre: 'Mesa A6', estado: 'libre', productos: [] },
          { id: 7, nombre: 'Mesa 7', estado: 'libre', productos: [] },
          { id: 8, nombre: 'Mesa 8', estado: 'libre', productos: [] },
          { id: 9, nombre: 'Mesa 9', estado: 'libre', productos: [] },
          { id: 10, nombre: 'Mesa 10', estado: 'libre', productos: [] },
          { id: 11, nombre: 'Mesa 11', estado: 'libre', productos: [] },
          { id: 12, nombre: 'Mesa 12', estado: 'libre', productos: [] },
          { id: 13, nombre: 'Mesa 13', estado: 'libre', productos: [] },
          { id: 14, nombre: 'Mesa 14', estado: 'libre', productos: [] },
          { id: 15, nombre: 'Mesa 15', estado: 'libre', productos: [] },
          { id: 16, nombre: 'Mesa 16', estado: 'libre', productos: [] },
          { id: 17, nombre: 'Mesa 17', estado: 'libre', productos: [] },
          { id: 18, nombre: 'Mesa 18', estado: 'libre', productos: [] },
          { id: 19, nombre: 'Mesa 19', estado: 'libre', productos: [] },
          { id: 20, nombre: 'Mesa 20', estado: 'libre', productos: [] },
          { id: 21, nombre: 'Mesa 21', estado: 'libre', productos: [] },
          { id: 22, nombre: 'Mesa 22', estado: 'libre', productos: [] },
          { id: 23, nombre: 'Mesa 23', estado: 'libre', productos: [] },
        ];
  });

  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const abrirMesa = (id) => setMesaSeleccionada(id);
  const cerrarModal = () => { 
    setMesaSeleccionada(null);
    setBusqueda("")
  }


const handleShowModal = () => {
  setShowModal(true);
  setVuelto(''); 
}
    const handleCloseModal = () => {
      setShowModal(false);
      setId_Cliente(1)
      setMetodoPagoSeleccionado("")
      
    }
  
//FUNCION PARA TRAER LOS METODOS DE PAGO
  const metodoPago = () => {
    axios.get(`${URL}metodoPago`).then(response => {
      setVerMetodoPago(response.data);
    }).catch((error) => {
      console.log("error al obtener los métodos de pago", error);
    })
  }  


  const agregarProductoAMesa = (idMesa, producto) => {
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id === idMesa) {
          const existente = mesa.productos.find((p) => p.id === producto.id);
          if (existente) {
            return {
              ...mesa,
              estado: 'ocupada',
              productos: mesa.productos.map((p) =>
                p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
              ),
            };
          } else {
            return {
              ...mesa,
              estado: 'ocupada',
              productos: [...mesa.productos, { ...producto, cantidad: 1 }],
            };
          }
        }
        return mesa;
      })
    );
  };

  const actualizarCantidadProducto = (idMesa, idProducto, nuevaCantidad) => {
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id === idMesa) {
          return {
            ...mesa,
            productos: mesa.productos.map((p) =>
              p.id === idProducto ? { ...p, cantidad: nuevaCantidad } : p
            ),
          };
        }
        return mesa;
      })
    );
  };

  const eliminarProductoDeMesa = (idMesa, idProducto) => {
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id === idMesa) {
          return {
            ...mesa,
            productos: mesa.productos.filter((p) => p.id !== idProducto),
          };
        }
        return mesa;
      })
    );
  };

  const productosAdaptados = productos.map((p) => ({
    id: p.Id_producto,
    nombre: p.nombre_producto,
    precio: p.precioVenta
  }));

  const calcularTotal = (productos) =>
    productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const cerrarMesa = (idMesa) => {
    const mesa = mesas.find((m) => m.id === idMesa);
    if (!mesa || mesa.productos.length === 0) return;

    console.log('Ticket:', mesa);

    setMesas((prev) =>
      prev.map((m) =>
        m.id === idMesa ? { ...m, productos: [], estado: 'libre' } : m
      )
    );
    cerrarModal();
  };

  const cancelarMesa = (idMesa) => {
    setMesas((prev) =>
      prev.map((m) =>
        m.id === idMesa ? { ...m, productos: [], estado: 'libre' } : m
      )
    );
    cerrarModal();
  };

const FinalizarVenta = async () => {
  const mesa = mesas.find((m) => m.id === mesaSeleccionada);
  if (!mesa || mesa.productos.length === 0) {
    alert("Debes cargar al menos 1 producto");
    return;
  }

  const total = calcularTotal(mesa.productos);
  const Id_metodoPago = parseInt(document.getElementById("metodoPago").value);
  const Id_cliente = parseInt(document.getElementById("cliente").value);
  const faltaPagar = Id_metodoPago === 5 ? total : 0;

  const cliente = verCliente.find(c => c.Id_cliente === Id_cliente);
  const metodoPago = verMetodoPago.find(m => m.Id_metodoPago === Id_metodoPago);
  const nombreCliente = cliente?.nombre_cliente || "Consumidor Final";
  const nombreMetodo = metodoPago?.tipo_metodoPago || "";

  try {
    const result = await Swal.fire({
      title: '¿Deseas imprimir el ticket?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
    });

    const ventaResponse = await axios.post(`${URL}ventas/crear`, {
      descripcion_venta: `Venta en ${mesa.nombre}`,
      precioTotal_venta: total,
      Id_metodoPago,
      Id_cliente,
      Id_sucursal: localStorage.getItem("sucursalId"),
      Id_usuario: localStorage.getItem("idUsuario"),
      Id_caja: localStorage.getItem("idCaja"),
      faltaPagar,
    });

    const Id_venta = ventaResponse.data.insertId;

    const detallePromises = mesa.productos.map((producto) =>
      axios.post(`${URL}detalleVenta/crear`, {
        descripcion_detalleVenta: producto.nombre,
        ventasTotales_detalleVenta: producto.precio * producto.cantidad,
        CantidadVendida: producto.cantidad,
        ganacia_detalleVenta: 0,
        Id_venta,
        Id_producto: producto.id,
        IdEstadoCredito: 1,
        IdEstadoVenta: 1,
        Id_paquete: null,
      }).then(() => {
        return axios.put(`${URL}ventas/descStock`, {
          Id_producto: producto.id,
          Id_sucursal: localStorage.getItem("sucursalId"),
          cantidad: producto.cantidad,
        });
      })
    );


    if (Id_metodoPago === 5 && cliente) {
      await axios.put(`${URL}ventas/aumentarCredito`, {
        Id_cliente: cliente.Id_cliente,
        montoCredito: total,
      });

      await axios.post(`${URL}creditos/movimientoClientes`, {
        Id_cliente: cliente.Id_cliente,
        montoCredito: total,
        montoDebito: 0,
        Saldo: parseFloat(total) + parseFloat(creditoActaul),
        Id_venta: Id_venta
      });
    }

    await Promise.all(detallePromises);

    if (result.isConfirmed) {
      const productosConCantidad = mesa.productos.map((p) => ({
        ...p,
        cantidadVendida: p.cantidad,
      }));
      imprimirTicket(productosConCantidad, total, nombreCliente, nombreMetodo);
    }

    // Limpiar mesa
    const nuevasMesas = mesas.map((m) =>
      m.id === mesaSeleccionada
        ? { ...m, productos: [], estado: "libre" }
        : m
    );
    setMesas(nuevasMesas);
    cerrarModal();
    handleCloseModal();

    Swal.fire({
      title: "<strong>Venta registrada</strong>",
      html: "<i>La venta se registró exitosamente</i>",
      icon: "success",
      timer: 2500,
    });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    Swal.fire("Error", "Hubo un problema al registrar la venta", "error");
  }
};



// const imprimirTicket = (productos, totalParaTodo, cliente, metodoPago) => {
//   let ticketWindow = window.open('', 'PRINT', 'height=600,width=400');

//   ticketWindow.document.write('<html><head><title>Ticket</title></head><body>');
// ticketWindow.document.write('<div style="text-align: center; font-family: monospace; line-height: 1.2;">');

// ticketWindow.document.write(`<h3 style="margin: 0; font-size: 14px;">${localStorage.getItem("nombreSucursal") || 'NOMBRE DEL BAR'}</h3>`);
// ticketWindow.document.write(`<p style="font-size: 9px; margin: 0;">Cel: 3812000296</p>`);
// ticketWindow.document.write(`<p style="font-size: 9px; margin: 0;">Usuario: ${localStorage.getItem("nombreUsuario") || 'Cajero'}</p>`);

// const fechaActual = new Date().toLocaleString();
// ticketWindow.document.write(`<p style="font-size: 9px; margin: 5px 0;">${fechaActual}</p>`);

// ticketWindow.document.write('<hr style="border-top: 1px dashed #000; margin: 5px 0;">');

// if (cliente) ticketWindow.document.write(`<p style="font-size: 9px; margin: 0;">Cliente: ${cliente}</p>`);
// if (metodoPago) ticketWindow.document.write(`<p style="font-size: 9px; margin: 0;">Pago: ${metodoPago}</p>`);

//   ticketWindow.document.write('<hr style="border-top: 1px dashed #000;">');

//   ticketWindow.document.write('<table style="width: 100%; font-size: 9px;">');
//   ticketWindow.document.write(`
//     <tr>
//       <th style="text-align: left;">CANT</th>
//       <th style="text-align: left;">ARTÍCULO</th>
//       <th style="text-align: right;">PRECIO</th>
//       <th style="text-align: right;">TOTAL</th>
//     </tr>
//   `);
//   ticketWindow.document.write('</table>');

//   productos.forEach((item) => {
//     const nombreItem = item.nombre || "Producto";
//     const cantidadVendida = item.cantidadVendida || item.cantidad || 1;
//     const precioUnitario = parseFloat(item.precio || 0).toFixed(2);
//     const precioTotal = (cantidadVendida * parseFloat(item.precio || 0)).toFixed(2);

//     ticketWindow.document.write('<table style="width: 100%; font-size: 9px;">');
//     ticketWindow.document.write(`
//       <tr>
//         <td style="text-align: left;">${cantidadVendida}</td>
//         <td style="text-align: left;">${nombreItem}</td>
//         <td style="text-align: right;">$${precioUnitario}</td>
//         <td style="text-align: right;">$${precioTotal}</td>
//       </tr>
//     `);
//     ticketWindow.document.write('</table>');
//   });

//   ticketWindow.document.write('<hr style="border-top: 1px dashed #000;">');
//   ticketWindow.document.write(`<p style="text-align: right; font-size: 10px;"><strong>TOTAL: $${parseFloat(totalParaTodo).toFixed(2)}</strong></p>`);
//   ticketWindow.document.write('<p style="text-align: center; font-size: 9px;">¡GRACIAS POR SU VISITA!</p>');
//   ticketWindow.document.write('<p style="font-size: 9px; text-align: center;">NO VALIDO COMO FACTURA</p>');

//   ticketWindow.document.write('</div></body></html>');
//   ticketWindow.document.close();

//   // Imprimir sin esperar logo
//   ticketWindow.print();
//   mostrarAlertaTicket();
// };
const imprimirTicket = (productos, totalParaTodo, cliente, metodoPago) => {
  const logoUrl = '/fondo-varista.jpg'
  let ticketWindow = window.open('', 'PRINT', 'height=600,width=400');

  ticketWindow.document.write(`
    <html>
      <head>
        <title>Ticket</title>
        <style>
          body {
            font-family: monospace;
            font-size: 12px;
            color: black;
            background: white;
            margin: 10px;
          }
          .ticket-container {
            text-align: center;
          }
          .logo {
            width: 80px;
            margin: 0 auto 10px;
            filter: grayscale(100%);
          }
          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
          }
          p {
            margin: 2px 0;
            font-size: 11px;
          }
          hr {
            border: none;
            border-top: 1px dashed black;
            margin: 8px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
          }
          th, td {
            padding: 3px 5px;
            font-size: 11px;
            text-align: left;
          }
          th {
            border-bottom: 1px dashed black;
            text-transform: uppercase;
          }
          td.qty {
            width: 10%;
          }
          td.product {
            width: 55%;
          }
          td.price, td.total {
            text-align: right;
            width: 17.5%;
          }
          td.total {
            font-weight: normal; /* Quitamos negrita en los totales por producto */
          }
          .total-final {
            font-size: 11px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
            padding-top: 5px;
          }
          .thank-you {
            margin-top: 15px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .disclaimer {
            font-size: 9px;
            margin-top: 5px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <img class="logo" src="${logoUrl}" alt="Logo Bar" />
          <h3>${localStorage.getItem("nombreSucursal") || 'NOMBRE DEL BAR'}</h3>
          <p>Cel: 3812000296</p>
          <p>Usuario: ${localStorage.getItem("nombreUsuario") || 'Cajero'}</p>
          <p>${new Date().toLocaleString()}</p>
          <hr />
          ${cliente ? `<p>Cliente: ${cliente}</p>` : ''}
          ${metodoPago ? `<p>Método de Pago: ${metodoPago}</p>` : ''}
          <hr />
          <table>
            <thead>
              <tr>
                <th class="qty">Cant</th>
                <th class="product">Artículo</th>
                <th class="price">Precio</th>
                <th class="total">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productos.map(item => {
                const nombreItem = item.nombre || "Producto";
                const cantidad = item.cantidadVendida || item.cantidad || 1;
                const precioUnitario = parseFloat(item.precio || 0);
                const precioTotal = cantidad * precioUnitario;
                return `
                  <tr>
                    <td class="qty">${cantidad}</td>
                    <td class="product">${nombreItem}</td>
                    <td class="price">${formatCurrency(precioUnitario)}</td>
                    <td class="total">${formatCurrency(precioTotal)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="total-final">TOTAL: ${formatCurrency(parseFloat(totalParaTodo))}</div>
          <div class="thank-you">¡Gracias por su visita!</div>
          <div class="disclaimer">NO VÁLIDO COMO FACTURA</div>
        </div>
      </body>
    </html>
  `);

  ticketWindow.document.close();
  ticketWindow.focus();

  ticketWindow.onload = () => {
    ticketWindow.print();
    ticketWindow.close();
    mostrarAlertaTicket();
  };
};






const mostrarAlertaTicket = () => {
  Swal.fire({
    title: "Ticket impreso",
    text: "El ticket fue enviado a la impresora.",
    icon: "success",
    timer: 1000,
    showConfirmButton: false
  });
};


const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};

  const verClienteFuncion = () => {
    const sucursalId = localStorage.getItem('sucursalId');
    axios.get(`${URL}clientes/${sucursalId}`)
    .then(response => {
      setVerCliente(response.data);
    });
  };


  const obtenerCreditoCliente = (Id_Cliente) => {
    setId_Cliente(Id_Cliente)
    let creditoActual = verCliente.find(c => c.Id_cliente === parseInt(Id_Cliente));
    return creditoActual ? setCreditoActual(creditoActual.montoCredito) & setLimiteCredito(creditoActual.LimiteCredito) : 'Cliente no encontrado';
  };

  const cambio = () => {
  if (!mesaSeleccionada) return 0;
  
  const productosMesa = mesas.find((m) => m.id === mesaSeleccionada)?.productos || [];
  const subtotal = calcularTotal(productosMesa) || 0;
  const interesesNum = Number(intereses) || 0;
  const totalConIntereses = subtotal + (subtotal * interesesNum / 100);

  const vueltoNum = Number(vuelto) || 0;

  return vueltoNum - totalConIntereses;
};

  const limpiarInput = () => {
    setBusqueda("")
  }

const productosMesa = mesas.find(m => m.id === mesaSeleccionada)?.productos || [];
const subtotal = calcularTotal(productosMesa) || 0;
const interesesNum = Number(intereses) || 0;
const totalConIntereses = subtotal + (subtotal * interesesNum / 100);


  useEffect(() => {
    metodoPago();
    verClienteFuncion()
  },[]);

  return (
    <>
     <App/>
    <div className='h3-ventas'>
        <h1>MESAS</h1>
    </div><br />

    <div className="container mt-3">
      <h2>Gestión de Mesas</h2>
      <div className="row">
  {mesas.map((mesa) => (
    <div key={mesa.id} className="col-6 col-sm-4 col-md-3 mb-4">
      <div
        className={`card text-center shadow mesa-card ${
          mesa.estado === 'libre' ? 'border-success' : 'border-warning'
        }`}
        style={{
          cursor: 'pointer',
          borderWidth: '2px',
          height: '130px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: mesa.estado === 'libre' ? '#e8f5e9' : '#fff3e0',
        }}
        onClick={() => abrirMesa(mesa.id)}
      >
        <div className="card-body">
          <h5 className="card-title">
            <i className="bi bi-cup-hot" style={{ marginRight: '8px' }}></i>
            {mesa.nombre}
          </h5>
          <p className="card-text">
            <i
              className={`bi ${
                mesa.estado === 'libre' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-warning'
              }`}
            ></i>{' '}
            {mesa.estado === 'libre' ? 'Disponible' : 'Ocupada'}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

      {mesaSeleccionada && (
        <Modal show onHide={cerrarModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{
              mesas.find((m) => m.id === mesaSeleccionada).nombre
            }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>BUSCAR PRODUCTOS</h5>
            <div className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Button style={{backgroundColor: '#6d4c41', border: 'none'}} onClick={limpiarInput}>
                LIMPIAR
              </Button>
            </div>
            <div
                className="mb-3"
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                }}
              >
            <div className="d-flex flex-wrap gap-2 mb-3">
              {busqueda.length > 0 && productosAdaptados
                .filter((p) =>
                  p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                  p.id.toString().includes(busqueda)
                )
                .slice(0, 50)
                .map((producto) => (
                  <Button
                    key={producto.id}
                    onClick={() => agregarProductoAMesa(mesaSeleccionada, producto)}
                    className='btn-producto-cafe'
                  >
                    {producto.nombre}
                  </Button>
                ))}
            </div>
</div>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>CANTIDAD</th>
                  <th>PRECIO</th>
                  <th>TOTAL</th>
                  <th>ACCION</th>
                </tr>
              </thead>
              <tbody>
                {mesas
                  .find((m) => m.id === mesaSeleccionada)
                  .productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={p.cantidad}
                          min={1}
                          onChange={(e) =>
                            actualizarCantidadProducto(
                              mesaSeleccionada,
                              p.id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td>{formatCurrency(p.precio)}</td>
                      <td>{formatCurrency(p.precio * p.cantidad)}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() =>
                            eliminarProductoDeMesa(mesaSeleccionada, p.id)
                          }
                        >
                          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <h5 className="text-end mt-3">
              <span className="total-destacado">
                TOTAL: {formatCurrency(calcularTotal(mesas.find((m) => m.id === mesaSeleccionada).productos))}
              </span>
            </h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={cerrarModal}>
              <i className="bi bi-x-circle me-1"></i> CERRAR
            </Button>
            <Button variant="danger" onClick={() => cancelarMesa(mesaSeleccionada)}>
              <i className="bi bi-trash-fill me-1"></i> CANCELAR MESA
            </Button>
            <Button variant="success" onClick={handleShowModal}>
              <i className="bi bi-receipt-cutoff me-1"></i> GENERAR TICKET Y CERRAR MESA
            </Button>
          </Modal.Footer>
        </Modal>
      )}








       <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>VER DETALLE VENTA</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <h6 className='subtotal'><b>SUBTOTAL:</b> {formatCurrency(subtotal)}</h6>
                 <h4 className='total'><b>TOTAL:</b> {formatCurrency(totalConIntereses)}</h4>

                <label><b>ABONA CON:</b></label>
                <input type="number" placeholder='$ 0.00' className='form-control'onChange={(e) => setVuelto(e.target.value)} />
                <br/>
                <label>Metodo de Pago:</label>
                <select id="metodoPago" className='form-select' onChange={(e)=>setMetodoPagoSeleccionado(e.target.value)}>
                  {verMetodoPago.map(metodo => (
                    <option key={metodo.Id_metodoPago} value={metodo.Id_metodoPago}>{metodo.tipo_metodoPago}</option>
                  ))}
                </select>
                <br/>
                <label>Intereses</label>
                <input type="number" placeholder='% 0.00' className='form-control' value={intereses} onChange={(e) => setIntereses(Number(e.target.value))} />
                <br/>
                <label><b>Cliente:</b></label>
                <select id="cliente" className='form-select'  onChange={(e) => obtenerCreditoCliente(e.target.value)}> 
                    {verCliente.map(cliente => (
                        <option key={cliente.Id_cliente} value={cliente.Id_cliente}>{cliente.nombre_cliente}</option>
                    ))}
                </select><br />
                  <hr />
                  {
                metodoPagoSeleccionado === 6 && (
                  <>
                    <label style={{marginTop: '20px'}}>EFECTIVO</label>
                    <input type="number" className='form-control' placeholder='$ 0.00' value={efectivo} onChange={(e) => setEfectivo(e.target.value)} />
                    <label style={{marginTop: '20px'}}>TARJETA</label>
                    <input  type="number" className='form-control' placeholder='$ 0.00' value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} />
                    <label style={{marginTop: '20px'}}>TRANSFERENCIA</label>
                    <input type="number" className='form-control' placeholder='$ 0.00' value={transferencia} onChange={(e) => setTransferencia(e.target.value)} />
                    <label style={{marginTop: '20px'}}><b>RESTANTE: ${restante()}</b></label> <br />
                  </>
                )
              }
              {
                metodoPagoSeleccionado !== 6 && (
                  <label>
                    <i className="bi bi-arrow-repeat me-1"></i>
                    <b>CAMBIO: </b>
                    {vuelto !== '' ? formatCurrency(cambio()) : '$ 0,00'}
                  </label>
                )
              }
              <br /><br />
              
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button 
                      className="btn btn-success" 
                      style={{ width: '400px', marginTop: '6px' }}  
                      onClick={FinalizarVenta}
                      >
                    FINALIZAR VENTA
                    </Button>
                  </div>
                  </Modal.Body>
               <Modal.Footer>
        <Button variant="danger" onClick={handleCloseModal}>
                      CERRAR
                    </Button>
                  </Modal.Footer>
     </Modal>
    </div>
    </>
  );
};

export default GestionMesas;
