/* eslint-disable no-unused-vars */
import App from '../App'
import { Modal, Button, Table, ButtonGroup} from 'react-bootstrap';
import axios from 'axios';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { CarritoContext } from '../context/CarritoContext';
import Swal from 'sweetalert2';
import Badge from '@mui/material/Badge';
import styled from "styled-components";
import { VentaContext } from '../context/VentaContext';
import { MDBInputGroup } from 'mdb-react-ui-kit';
import carritoImg from '../assets/logo-carrito.png'
import { IoMdCloseCircle } from "react-icons/io";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import Pagination from "react-bootstrap/Pagination";
import '../css/venta.css'
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollar, faPencil, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import Paginacion from './Paginacion.jsx';
import logoticket from '../assets/fondo-varista.jpg'

const TestVenta = () => {
    

  const inputRef = useRef(null);
    //VUELTO Y TOTAL
    const [vuelto, setVuelto] = useState(0);
    const [intereses, setIntereses] = useState(0)
    const [buscar3,setBuscar3] = useState('')
    const [ver,setVer] = useState([])

    //ARRAY PARA APIS
    const [verCliente, setVerCliente] = useState([])
    const [verMetodoPago, setVerMetodoPago] = useState([])
    const [ultimoDetalle, setUltimoDetalle] = useState([])

    //TALBA PARA CARGAR PORDUCTOS
    const [productoSeleccionado,setProductoSeleccionado] = useState([])
    const [mostrarTablaProducto, setMostrarTablaProducto] = useState(false);
    const [Id_Cliente, setId_Cliente] = useState(1);
   
   
    //CREDITO 
    const [limiteCredito, setLimiteCredito] = useState(0)
    const [creditoActaul, setCreditoActual] = useState(0)

    //VENTAcreditoActual
    const [Id_venta, setId_venta] = useState();
    const [IdVentaEliminada, setIdVentaEliminada] = useState();
    const [cantidadesVendidas, setCantidadesVendidas] = useState(0);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [ultimaVenta, setUltimaVenta] = useState("")
    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("")
    const [precioProducto, setPrecioProducto] = useState([])
    const [IdProducto_precio, setIdProducto_precio] = useState('')
    const [nombreProductoNuevo, setNombreProductoNuevo] = useState('')
    const [precioProductoNuevo, setPrecioProductoNuevo] = useState(0)
    const [descUnidad, setDescUnidad] = useState(0)
    const [incrementoUnidad, setIncrementoUnidad] = useState(0)
    const [precioFinal, setPrecioFinal] = useState({})

    //EGRESOS E INGRESOS 
    const [montoTotalEgreso, setMontoTotalEgreso] = useState(0)
    const [montoTotalIngreso, setMontoTotalIngreso] = useState(0)
    const [descripcionEgreso, setDescripcionEgreso] = useState('')
    const [descripcionIngreso, setDescripcionIgreso] = useState('')
    const [codigoMov,setCodigoMov] = useState('')
    const [preciosSeleccionados, setPreciosSeleccionados] = useState({});


    //METODOS PAGO MIXTO
    const [efectivo, setEfectivo] = useState(null);
    const [tarjeta, setTarjeta] = useState(null);
    const [transferencia, setTransferencia] = useState(null);
    const [credito, setCredito] = useState(null);


    //FILTROS
    const [buscar, setBuscar] = useState("");
    const [buscar2, setBuscar2] = useState("");
    const [totalProductos, setTotalProductos] = useState(0);
    //PARA FILTRAR X FECHA
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

    //ESTADO DE PRUEBA PARA PRECIO MAYOREO
    const [usarMayoreo, setUsarMayoreo] = useState({});
    const [productoActivo, setProductoActivo] = useState(null);


    //MODALES
    const [estadoModal1, setEstadoModal1] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [showModal5, setShowModal5] = useState(false);
    const [showModal6, setShowModal6] = useState(false);
    const [showModal7, setShowModal7] = useState(false);
    const [showModal8, setShowModal8] = useState(false);
    const [showModal9, setShowModal9] = useState(false);
    const [showModal10, setShowModal10] = useState(false);
    const [showModal11, setShowModal11] = useState(false);
    const [showModal12, setShowModal12] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
      setShowModal(false);
      setId_Cliente(1)
      setMetodoPagoSeleccionado("")
    }
  
    const handleShowModal1 = () => setEstadoModal1(true);
    const handleCloseModal1 = () => setEstadoModal1(false);

    const handleShowModal2 = () => {
      setShowModal2(true)
      fetchUltimoDetalle()
    };
    const handleCloseModal2 = () => setShowModal2(false);

    const handleShowModal3 = () => setShowModal3(true);
    const handleCloseModal3 = () => setShowModal3(false);
    
    const handleShowModal4 = () => setShowModal4(true);
    const handleCloseModal4 = () => setShowModal4(false);

    const handleShowModal5 = () => setShowModal5(true);
    const handleCloseModal5 = () => setShowModal5(false);

    const handleShowModal6 = () => setShowModal6(true);
    const handleCloseModal6 = () => setShowModal6(false);

    const handleShowModal7 = () => setShowModal7(true);
    const handleCloseModal7 = () => {
      setShowModal7(false);
      setDescripcionParaEgreso(0);          
      setIdMotivoEgreso(0);               
      setEgresoSeleccionado(0);           
      setMotivoEgreso("");               
      setMontoTotalEgreso("");          
    }

    const handleShowModal8 = () => {
      setShowModal8(true);
    }
    const handleCloseModal8 = () => {
      setShowModal8(false);
    }

    const handleShowModal9 = () => setShowModal9(true);
    const handleCloseModal9 = () => {
      setShowModal9(false)
      setCodigoMov("")
    }

    const handleShowModal10 = () => setShowModal10(true);
    const handleCloseModal10 = () => setShowModal10(false);

    const handleShowModal11 = () => setShowModal11(true);
    const handleCloseModal11 = () => setShowModal11(false);

    const handleShowModal12 = () => setShowModal12(true);
    const handleCloseModal12 = () => {
      setShowModal12(false)
      setNombreProductoNuevo("")
      setPrecioProductoNuevo("")
    };


    const [verVentaSeleccionada, setVerVentaSeleccionada] = useState([])
    const [showModalVerProductosVenta, setShowModalVerProductosVenta] = useState(false);
    const handleShowModalVerProductosVenta = () => 
      {
      setShowModalVerProductosVenta(true)
      handleCloseModal2()
    };
    const handleCloseModalVerProductosVenta= () => setShowModalVerProductosVenta(false);


    const seleccionarVenta = (Id_venta) =>{
      axios.get(`${URL}ventas/verVentaSeleccionada/${Id_venta}`).then((response)=>{
        setVerVentaSeleccionada(response.data)
        console.log('response data venta', response.data)
        handleShowModalVerProductosVenta()
      }).catch((error)=>{
        console.log('Error al seleccionar la venta',error)
      })
    }


    //CONTEXT
    const { listaCompras, eliminarCompra, agregarCompra,agregarCompras, eliminarVentas } = useContext(CarritoContext);
    const {listaVentas,agregarVenta,eliminarVenta} = useContext(VentaContext)
    const { productos,URL } = useContext(DataContext);
    //STORAGE
    const id_sucursal = localStorage.getItem('sucursalId');
    const IdCaja = localStorage.getItem('idCaja')
    const Id_caja = localStorage.getItem('idCaja')
    const id_usuario = localStorage.getItem('idUsuario')
    const rolUsuario = localStorage.getItem('rolUsuario')

    //PARA FILTRAR X FECHA LA VENTA
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;


    };

    
    const calcularTotal = () => {
      return listaCompras.reduce((total, item) => {
        const cantidadVendida = parseFloat(cantidadesVendidas[item.Id_producto]) || parseFloat(cantidadesVendidas[item.Id_paquete] || 0);
        const precioFinalProducto = parseFloat(precioFinal[item.Id_producto]) || 0;
        const precioPaquete = parseFloat(item.precio_paquete) || 0;
        const esPaquete = precioPaquete > 0;
    
        if (item.tipo_venta === 'granel') {
          return total + precioFinalProducto;
        }
    
        if (esPaquete) {
          return total + (precioPaquete * cantidadVendida);
        }
    
        return total + (precioFinalProducto * cantidadVendida);
      }, 0);
    };
    
    
    
    const SumarIntereses = () => {
      const total = parseFloat(calcularTotal());
      const interesesAplicados = total + (total * (parseFloat(intereses) || 0) / 100);
      return interesesAplicados.toFixed(2);
    };

  //FUNCION RESTANTE
  const restante = () =>{
    const total = calcularTotal();
    const restanteEfectivo = total - efectivo -  credito - transferencia;
    const restanteTarjeta = restanteEfectivo - tarjeta;
    return restanteTarjeta >= 0 ? restanteTarjeta : 0;
  }
  
  //FUNCION CAMBIOX
  const cambio = () => {
    const total = SumarIntereses()
    return vuelto - total
  };

  

  
  const [productosPaginados, setProductosPaginados] = useState(productos); // Inicializa con todos los productos

// Inicializa productosPaginados solo cuando productos cambie
useEffect(() => {
  setProductosPaginados(productos);
}, [productos]);


  const TestMeto = (e) =>{
    setMetodoPagoSeleccionado(parseInt(e.target.value))
  }

  // FUNCION PARA SUMAR EL CREDITO TOTAL
  const totalConCredito  = () =>{
    return  parseFloat(creditoActaul)  + parseFloat(SumarIntereses())
  }




const guardarVenta = () => {
    const venta = {
      productos: listaCompras,
    };
    if(listaCompras.length === 0){
      alert ("Debes cargar al menos cargar 1 producto para guardar el ticket")
    }else{
      agregarVenta(venta);
      alert('Venta guardada');
      venta.productos.forEach(producto => eliminarCompra(producto.Id_producto));
   
  } 
  };

// FUNCION PARA AGREGAR UN PRODUCTO A LA LISTA DE COMPRA

const handleAgregar = (compra) => {
  setCantidadesVendidas(prevCantidades => ({
    ...prevCantidades,
    [compra.Id_paquete || compra.Id_producto]: (prevCantidades[compra.Id_paquete || compra.Id_producto] || 0) + 1
  }));

  setPreciosSeleccionados(prevPrecios => ({
    ...prevPrecios,
    [compra.Id_paquete || compra.Id_producto]: 'Unitario'
  }));

  const listaActual = listaCompras;
  const itemExistente = listaActual.find(item => (item.Id_producto || item.Id_paquete) === (compra.Id_producto || compra.Id_paquete));

  if (itemExistente) {
    itemExistente.cantidad += 1; 
  } else {
    agregarCompra({ ...compra, cantidad: 1 });
  }



  handleCloseModal1(true);
  setBuscar("");
};





  
  const handleAgregar3 = (nombre_promocion, precioProductoNuevo) => {
    if (nombre_promocion.length === 0 || precioProductoNuevo.length === 0) {
      alert("Debe cargar los datos");
    } else {
      const precioVenta = parseFloat(precioProductoNuevo) || 0;
      const Id_producto = Math.random().toString(36).substr(2, 9);
  
      if (!cantidadesVendidas[Id_producto]) {
        setCantidadesVendidas(prev => ({ ...prev, [Id_producto]: 1 }));
      }
  
      setNombreProductoNuevo("");
      setPrecioProductoNuevo("");
  
      const data = { Id_producto, nombre_promocion, precioVenta, cantidad: cantidadesVendidas }; 
      agregarCompra(data);
  
      setProductoSeleccionado(productos);
      setMostrarTablaProducto(true);
      handleCloseModal1(true);
      setBuscar("");
      handleCloseModal12(true);
  
      setPreciosSeleccionados(prev => ({ ...prev, [Id_producto]: 'PrecioNuevoProducto' }));
      setPrecioFinal(prev => ({ ...prev, [Id_producto]: precioVenta })); 
    }
  };
  
  
  //FUNCION  PARA AGREGAR UN PRODUCTO A LA LISTACOMPRA DESDE EL MODDAL VERIFICADOR 
  const handleAgregar2 = (compra) => {
    const cantidadActual = cantidadesVendidas[compra.Id_producto];
    if (cantidadActual === undefined) {
      setCantidadesVendidas({ ...cantidadesVendidas, [compra.Id_producto]: 1 });
    }
    agregarCompra(compra);
    setProductoSeleccionado(productos);
    setMostrarTablaProducto(true);
    handleCloseModal1(true);
    setBuscar("")
    setPreciosSeleccionados(prev => ({ ...prev, [compra.Id_producto]: 'PrecioNuevoProducto' }));

  };
  






  //FUNCION PARA GUARDAR LA VENTA
  const [ventaGuardada, setVentaGuardada] = useState(0)
  //FUNCION  PARA AGREGAR UN PRODUCTO A LA LISTVENTAS
  const agregarProductosAVentas = (venta) => {
    if(ventaGuardada === 1){
      alert('Esta venta ya esta en la lista')
    }else{
      setVentaGuardada(1)
      setVentaSeleccionada(venta);
      const nuevosProductos = venta.productos.map(producto => ({ ...producto }));
      agregarCompras(nuevosProductos);
    }
    
  };
  

const verPrecioProducto = () =>{
  axios.get(`${URL}ventas/precioProducto/${IdProducto_precio}/${IdProducto_precio}`).then((response)=>{
    setPrecioProducto(response.data)
  }).catch((error)=>{
    console.log('Error al traer el precio', error)
  })
}



    
  
  
//FUNCION PARA TRAER LOS METODOS DE PAGO
  const metodoPago = () => {
    axios.get(`${URL}metodoPago`).then(response => {
      setVerMetodoPago(response.data);
    }).catch((error) => {
      console.log("error al obtener los métodos de pago", error);
    })
  }  
//FUNCION PARA TRAER LOS CLIENTES
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

 




//FUNCION PARA BUSCAR EL CREDITO DEL CLIENTE


//FUNCION PARA TRAER LA ULTIMA VENTA
   const traerUltimaVenta = async() =>{
     await axios.get(`${URL}ventas/UltimaVenta`).then((response)=>{
      setUltimaVenta( response.data[0].ultimoIdVenta)
    }).catch((error)=>{
    })
   }



  const fetchUltimoDetalle = async () => {
    try {
      const formattedDate = formatDate(fechaSeleccionada);
      const response = await axios.get(`${URL}detalleVenta/ultimoDetalle/${id_sucursal}/${formattedDate}`);
      setUltimoDetalle(response.data);
      setTotalPaginasVentas(response.data.length);
    } catch (error) {
      console.error("Error al obtener los detalles de la venta:", error);
    }
  };


useEffect(()=>{
  fetchUltimoDetalle()
},[fechaSeleccionada])


// FUNCION PARA TRAER LA PROXIMA VENTA  
const traerVentaCorrelativa = async () => {
  await axios.get(`${URL}ventas/ventacorrelativa`).then((response) => {
    setId_venta(response.data.ultimoIdVenta);
  }).catch((error) => {
    console.log('error en traer id_venta', error);
  });
};







const testID = () =>{
  setId_venta(Id_venta + 1)
}

const validarCodigo = () =>{
  if(codigoMov === '1812'){
    handleShowModal5()
    handleCloseModal9()
    setCodigoMov("")
  }else(     
    setCodigoMov(""),
    alert('Codigo Incorrecto') 
  )
}


//FUNCION PARA CARGAR UN INRGESO
  const RegistrarIngreso = () =>{
    axios.post(`${URL}movimientos/Ingreso/post`,{
      DescripcionIngreso: descripcionIngreso,
      montoTotalIngreso: montoTotalIngreso,
      Id_sucursal: id_sucursal,
      Id_usuario: id_usuario,
      Id_caja: Id_caja,
    }).then(()=>{
      Swal.fire({
        title: " <strong>Registro de ingreso exitoso!</strong>",
        html: "<strong> Verifique el monto en corte</strong>",
        icon: 'success',
        timer:3000
      })     
      setShowModal6(false);
    }).catch((error)=>{
      alert('Ingreso no registrado')
      console.log(error)
    })

  }





//FUNCION PARA CARGAR UN EGRESO
const RegistrarEngreso = () => {
  if (!montoTotalEgreso) {
    alert('Debe ingresar un monto para registrar el egreso');
    return;
  }
  axios.post(`${URL}movimientos/Egreso/post`, {
    DescripcionEgreso: descripcionEgreso,
    montoTotalEgreso: montoTotalEgreso,
    Id_sucursal: id_sucursal,
    Id_usuario: id_usuario,
    Id_caja: Id_caja,
  }).then(() => {
    Swal.fire({
      title: " <strong>Registro de egreso exitoso!</strong>",
      html: "<strong> Verifique el monto en corte</strong>",
      icon: 'success',
      timer: 3000
    });
    setDescripcionParaEgreso("");
    setMontoTotalEgreso("");
    setMotivoEgreso(""); 
    handleCloseModal7(); 
  }).catch((error) => {
    alert('Egreso no registrado');
    console.log(error);
  });
};



// FUNCION PARA SELECCIONAR UN CLIENTE PARA LA VENTA
const FinalizarVenta = () => {
  if (listaCompras.length === 0) {
    alert("Debes cargar al menos 1 producto");
    return;
  }
  const Id_metodoPago = parseInt(document.getElementById("metodoPago").value); 
  const Id_Cliente = document.getElementById("cliente").value;
  const totalParaTodo = SumarIntereses();
  
  const tieneCantidadInvalida = listaCompras.some(producto => {
    const cantidad = cantidadesVendidas[producto.Id_producto] || cantidadesVendidas[producto.Id_paquete];
    if (!cantidad || cantidad <= 0) {
      Swal.fire("Debe ingresar una cantidad válida para todos los productos", "", "error");
      return true; 
    }
    return false;
  });

  const faltaPagar = Id_metodoPago === 5 ? totalParaTodo : 0;

  if (tieneCantidadInvalida) return;

  if (Id_metodoPago === 5 && totalConCredito()  > limiteCredito) {
    alert('No se puede vender a este cliente porque superó su límite de crédito');
    return;
  }


  Swal.fire({
    title: '¿Deseas imprimir el ticket?',
    showDenyButton: true,
    confirmButtonText: 'Sí',
    denyButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // Pasamos la cantidad vendida correctamente
      const productosConCantidad = listaCompras.map((producto) => ({
        ...producto,
        cantidadVendida: cantidadesVendidas[producto.Id_producto] || cantidadesVendidas[producto.Id_paquete] || 1
      }));

      imprimirTicket(productosConCantidad, totalParaTodo);
    }

    axios.post(`${URL}ventas/crear`, {
      descripcion_venta: 'XDD',
      precioTotal_venta: totalParaTodo,  
      Id_metodoPago: Id_metodoPago,
      Id_cliente: Id_Cliente,
      Id_sucursal: id_sucursal,
      Id_usuario: id_usuario,
      Id_caja: IdCaja,
      faltaPagar: faltaPagar
    })
    .then(() => {
      const promesas = listaCompras.map((producto) => {
        return axios.post(`${URL}detalleVenta/crear`, {
          descripcion_detalleVenta: 'test',
          ventasTotales_detalleVenta: totalParaTodo,  
          CantidadVendida: cantidadesVendidas[producto.Id_producto] || cantidadesVendidas[producto.Id_paquete],
          ganacia_detalleVenta: 0.0,
          Id_venta: Id_venta,
          Id_producto: producto.Id_producto,
          Id_caja: IdCaja,
          IdEstadoCredito: 1,
          IdEstadoVenta: 1,
          Id_paquete: producto.Id_paquete
        }).then(() => {
          return axios.put(`${URL}ventas/descStock`, {
            Id_producto: producto.Id_producto,
            Id_sucursal: id_sucursal,
            cantidad: cantidadesVendidas[producto.Id_producto]
          })
          .then(() => {
            if (Id_metodoPago === 5 || credito.length >= 0) {
              return axios.put(`${URL}ventas/aumentarCredito`, {
                Id_cliente: Id_Cliente,
                montoCredito: credito || totalParaTodo
              }).then(()=>{
                axios.post(`${URL}creditos/movimientoClientes`, {
                  Id_cliente: Id_Cliente,
                  montoCredito: totalParaTodo,
                  montoDebito: 0,
                  Id_venta: Id_venta,
                  Saldo:  parseFloat(totalParaTodo) + parseFloat(creditoActaul)
                });
              }).then(() => {
                console.log("todo bien en crédito", totalParaTodo);
              }).catch((error) => {
                console.log('Error al actualizar el crédito:', error);
              });
            }
          })
        }).then(() => {
          if (producto.Id_paquete && producto.productos) {
            const promesasPaquete = producto.productos.map(productoIndividual => {
              return axios.put(`${URL}paquete/editar/descPaquete`, {
                Id_sucursal: id_sucursal, 
                Id_producto: productoIndividual.Id_producto,
                cantidad: (cantidadesVendidas[producto.Id_paquete] || 1) * productoIndividual.cantidadProducto
              });
            });
            return Promise.all(promesasPaquete);
          }
        });
      })
      return Promise.all(promesas);
    })
    .finally(() => {
      listaCompras.length = 0;
      setCantidadesVendidas({});
      setPreciosSeleccionados({});
      setPrecioFinal({});
      setUsarMayoreo({})
      setDescUnidad({})
      setIncrementoUnidad({})
      Swal.fire({
        title: "<strong>Venta exitosa!</strong>",
        html: "<i>La venta fue agregada con éxito</i>",
        icon: 'success',
        timer: 3000
      });
      setEstadoModal1(false);
      handleCloseModal(true);
      testID();
      setIntereses(0);
    });
  });
};




const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};





// FUNCION PARA FINALIZAR VENTA SIN TICKET
const FinalizarVentaSinTicket = () => {
  const Id_metodoPago = parseInt(document.getElementById("metodoPago").value);

  if (listaCompras.length === 0) {
    alert("Debes cargar al menos 1 producto");
    return;
  }

  if (Id_metodoPago === 5 && totalConCredito() > limiteCredito) {
    alert('No se puede vender a este cliente porque superó su límite de crédito');
    return;
  }

  const Id_Cliente = document.getElementById("cliente").value;


  const totalParaTodo = SumarIntereses();
  const faltaPagar = Id_metodoPago === 5 ? totalParaTodo : 0;

  const tieneCantidadInvalida = listaCompras.some(producto => {
    const cantidad = cantidadesVendidas[producto.Id_producto] || cantidadesVendidas[producto.Id_paquete];
    if (!cantidad || cantidad <= 0) {
      Swal.fire("Debe ingresar una cantidad válida para todos los productos","","error");
      return true; 
    }
    return false;
  });
  
  if (tieneCantidadInvalida) return;

  axios.post(`${URL}ventas/crear`, {
    descripcion_venta: 'XDD',
    precioTotal_venta: totalParaTodo,
    Id_metodoPago: Id_metodoPago,
    Id_cliente: Id_Cliente,
    Id_sucursal: id_sucursal,
    Id_usuario: id_usuario,
    Id_caja: IdCaja,
    faltaPagar: faltaPagar
  })
  .then(() => {
    const promesasProductos = listaCompras.map((producto) => {
      return axios.post(`${URL}detalleVenta/crear`, {
        descripcion_detalleVenta: 'test',
        ventasTotales_detalleVenta: totalParaTodo,
        CantidadVendida: cantidadesVendidas[producto.Id_producto] || cantidadesVendidas[producto.Id_paquete],
        ganacia_detalleVenta: 0.0,
        Id_venta: Id_venta, 
        Id_producto: producto.Id_producto,
        Id_caja: IdCaja,
        IdEstadoCredito: 1,
        IdEstadoVenta: 1,
        Id_paquete: producto.Id_paquete,
      }).then(() => {
        return axios.put(`${URL}ventas/descStock`, {
          Id_sucursal: id_sucursal,
          Id_producto: producto.Id_producto,
          cantidad: cantidadesVendidas[producto.Id_producto]
        });
      }).then(() => {
        if (producto.Id_paquete && producto.productos) {
          const promesasPaquete = producto.productos.map(productoIndividual => {
            return axios.put(`${URL}paquete/editar/descPaquete`, {
              Id_sucursal: id_sucursal, 
              Id_producto: productoIndividual.Id_producto,
              cantidad: (cantidadesVendidas[producto.Id_paquete] || 1) * productoIndividual.cantidadProducto
            });
          });
          return Promise.all(promesasPaquete);
        }
      });
    });

    return Promise.all(promesasProductos);
  })
  .then(() => {
    if (Id_metodoPago === 5 || credito.length >= 0) {
      return axios.put(`${URL}ventas/aumentarCredito`, {
        Id_cliente: Id_Cliente,
        montoCredito: credito || totalParaTodo
      }).then(()=>{
        axios.post(`${URL}creditos/movimientoClientes`, {
          Id_cliente: Id_Cliente,
          montoCredito: totalParaTodo,
          montoDebito: 0,
          Id_venta: Id_venta,
          Saldo:  parseFloat(totalParaTodo) + parseFloat(creditoActaul)
        });
      }).then(() => {
        console.log("todo bien en crédito", totalParaTodo);
      }).catch((error) => {
        console.log('Error al actualizar el crédito:', error);
      });
    }
  })
  .catch((error) => {
    console.log('Hubo un error:', error);
  })
  .finally(() => {
    listaCompras.length = 0;
    setCantidadesVendidas({});
    setPreciosSeleccionados({});
    setPrecioFinal({})
    setUsarMayoreo({});
    setDescUnidad({})
    setIncrementoUnidad({})
    Swal.fire({
      title: "<strong>Venta exitosa!</strong>",
      html: "<i>La venta <strong> </strong> fue agregada con éxito</i>",
      icon: 'success',
      timer: 3000
    });
    setEstadoModal1(false);
    handleCloseModal(true);
    testID();
    setIntereses(0);
  });
};


const nombreCompleto = localStorage.getItem("nombreUsuario")
const nombreSucursal = localStorage.getItem('nombreSucursal')

const imprimirTicket = (productos, totalParaTodo) => {
  let ticketWindow = window.open('', 'PRINT', 'height=600,width=400');

  ticketWindow.document.write('<html><head><title>Ticket</title></head><body>');
  ticketWindow.document.write('<div style="text-align: center; font-family: Arial, sans-serif;">');

  // Insertar la imagen con un ID
  ticketWindow.document.write(`
    <img id="logoTicket" src="${logoticket}" style="max-height: 50px; margin-top: 20px;" alt="Logo"/>
  `);

  const fechaActual = new Date().toLocaleString();
  ticketWindow.document.write(`<p style="text-align: center; font-size: 9px;">${fechaActual}</p>`);
  ticketWindow.document.write(`<p style="font-size: 9px;">${nombreSucursal}</p>`);
  ticketWindow.document.write('<p style="font-size: 9px;">Cel: 3812000296</p>');
  ticketWindow.document.write(`<p style="font-size: 9px;">Usuario: ${nombreCompleto}</p>`);

  ticketWindow.document.write('<hr style="border-top: 1px dashed #000;">');

  ticketWindow.document.write('<table style="width: 100%; font-size: 9px; text-align: left;">');
  ticketWindow.document.write('<tr><th style="text-align: left;">CANT</th> <th style="text-align: left;">ARTÍCULO</th> <th style="text-align: right;">PRECIO</th> <th style="text-align: right;">TOTAL</th></tr>');
  ticketWindow.document.write('</table>');

  productos.forEach((item) => {
    let nombreItem = item.nombre_promocion || item.nombreProductoNuevo || item.nombre_producto || 'Nombre no disponible';
    let cantidadVendida = item.cantidadVendida || 1;
    let precioUnitario = parseFloat(item.precioVenta || item.precio_paquete || item.precioProductoNuevo || 0).toFixed(2);
    let precioTotal = (precioUnitario * cantidadVendida).toFixed(2);

    ticketWindow.document.write('<table style="width: 100%; font-size: 9px; text-align: left;">');
    ticketWindow.document.write(`<tr>
      <td style="text-align: left;">${cantidadVendida}</td>
      <td style="text-align: left;">${nombreItem}</td>
      <td style="text-align: right;">${formatCurrency(precioUnitario)}</td>
      <td style="text-align: right;">${formatCurrency(precioTotal)}</td>
    </tr>`);
    ticketWindow.document.write('</table>');
  });

  ticketWindow.document.write('<hr style="border-top: 1px dashed #000;">');
  ticketWindow.document.write(`<p style="text-align: right; font-size: 10px;"><strong>TOTAL: ${formatCurrency(totalParaTodo)}</strong></p>`);
  ticketWindow.document.write('<p style="text-align: center; font-size: 9px;">¡GRACIAS POR TU COMPRA!</p>');

  ticketWindow.document.write('</div></body></html>');

  ticketWindow.document.close();

  // Asegurar que la imagen cargue antes de imprimir
  const logo = ticketWindow.document.getElementById('logoTicket');

  if (logo.complete) {
    ticketWindow.print();
    mostrarAlertaTicket(); // Llamamos a la alerta después de imprimir
  } else {
    logo.onload = () => {
      ticketWindow.print();
      mostrarAlertaTicket(); // Llamamos a la alerta después de imprimir
    };
  }
};

// Función para mostrar la alerta después de imprimir el ticket
const mostrarAlertaTicket = () => {
  Swal.fire({
    title: "Ticket impreso",
    text: "El ticket de la venta ha sido enviado a la impresora.",
    icon: "success",
    timer: 3000
  });
};



const eliminarProductoVenta = (Id_detalleVenta, dv) => {
  const motivo = prompt("Escriba el motivo de la eliminación:");
  if (!motivo) {
    alert("Debes ingresar un motivo");
    return;
  }
      axios.delete(`${URL}ventas/EliminarProductoVenta/${Id_detalleVenta}`)
        .then(() => {
          return axios.put(`${URL}ventas/aumentarCantidad`, {
            Id_producto: dv.Id_producto,
            cantidad: dv.CantidadVendida,
            Id_sucursal: id_sucursal,
          });
        })
        .then(() => {
          return axios.put(`${URL}ventas/actualizarPrecioVenta`, {
            Id_venta: dv.Id_venta,
            precioVenta: dv.precioVenta * dv.CantidadVendida
          });
        })
        .then(() => {
          return axios.post(`${URL}ventas/guardarProductoEliminado`, {
            Id_venta: dv.Id_venta,
            precioVentaProducto: dv.precioVenta,
            Id_producto: dv.Id_producto,
            Id_usuario: id_usuario,
            Motivo: motivo
          });
        })
        .then(() => {
          seleccionarVenta(dv.Id_venta);
          Swal.fire('Producto eliminado con éxito de la venta!', '', 'success');
        })
        .catch((error) => {
          console.log('Error al eliminar el producto de la venta', error);
          Swal.fire('Error', 'Ocurrió un problema al eliminar el producto', 'error');
        });
};

  
const eliminarUltimaVenta = async (productos, Id_venta, detalle,usuario) => {
  try {
    const formattedDate = new Date(detalle.fecha_registro).toISOString().slice(0, 19).replace('T', ' ');

    await Promise.all(productos.map(producto => {
      return axios.post(`${URL}ventas/guardarVentaEliminada`, {
        NumeroVenta: Id_venta,
        MontoTotal: detalle.precioTotal_venta,
        cantidad: producto.cantidadVendida,
        Id_producto: producto.Id_producto,
        Producto: producto.nombre_producto,
        FechaVenta: formattedDate,
        Empleado: usuario
      });
    }));
    await Promise.all(productos.map(producto => {
      return axios.put(`${URL}ventas/aumentarCantidad`, {
        Id_producto: producto.Id_producto,
        Id_sucursal: id_sucursal,
        cantidad: producto.cantidadVendida
      });
    }));

    await axios.delete(`${URL}detalleVenta/delete/${Id_venta}`);
    await axios.delete(`${URL}ventas/delete/${Id_venta}`);

    handleCloseModal2()
    alert('Venta eliminada con éxito');

  } catch (error) {
    console.error('Error al eliminar la venta:', error);
  }
};

const limpiarInput = () =>{
  setBuscar("")
}




//FUNCION PARA ATAJO DE TECLADO
  useEffect(() => {
    const manejarKeyDown = (event) => {
      if (event.target.closest('input, textarea, [contenteditable="true"]')) return;

      if (event.key === 'F10') {
        event.preventDefault();
        handleShowModal8()
      }
      if (event.key === 'Escape') {
        handleCloseModal8();
      }
      if (event.key === 'F12') {
        event.preventDefault();
        handleShowModal();
      }
      if (event.key === 'F4') {
        event.preventDefault();
        FinalizarVenta()
      }
      if (event.key === 'F2') {
        event.preventDefault();
        FinalizarVentaSinTicket()
      }
      if (event.key === 'F6') {
        event.preventDefault();
        guardarVenta()
      }
      if (event.key === 'F8') {
        event.preventDefault();
        if(rolUsuario === 'empleado'){
          handleShowModal9()
        }else{
          handleShowModal5()
        }
      }
      if (event.key === 'F9') {
        event.preventDefault();
        handleShowModal10()
      }
      if (event.key === 'F1') {
        event.preventDefault();
        handleShowModal11()
      }
      if (event.key === 'F11') {
        event.preventDefault();
        handleShowModal12();
      }
      if (event.key === 'F3') {
        event.preventDefault();
        limpiarTabla()
      }
    }
  document.addEventListener('keydown', manejarKeyDown);
  return () => {
    document.removeEventListener('keydown', manejarKeyDown);
  };
}, [listaCompras, cantidadesVendidas, SumarIntereses]);



//EJECUTAMOS TODAS LAS FUNCIONES
  useEffect(() => {
    traerUltimaVenta()
    totalConCredito()
    traerVentaCorrelativa()
    metodoPago();
    verClienteFuncion();

  },[]);
 
  useEffect(() => {
    if (showModal8 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal8, handleAgregar]);

  useEffect(() => {
    if (showModal11 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal11]);

  useEffect(() => {
    if (showModal10 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal10]);

  useEffect(() => {
    if (showModal12 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal12]);



 //FUNCION PARA ELIMINAR PRODUCTO DE LA VENTA
 const eliminarVentaDeLaTabla = (producto) => {
  const identificador = producto.Id_paquete || producto.Id_producto;
  eliminarCompra(producto.Id_producto);

  setDescUnidad(prev => {
    const newState = { ...prev };
    delete newState[identificador];
    return newState;
  });

  setIncrementoUnidad(prev => {
    const newState = { ...prev };
    delete newState[identificador];
    return newState;
  });

  setVentaGuardada(0);

  setCantidadesVendidas(prev => {
    const newState = { ...prev };
    delete newState[identificador];
    return newState;
  });

  setPrecioFinal(prev => {
    const newState = { ...prev };
    delete newState[identificador];
    return newState;
  });
};



 //FUNCION PARA ELIMINAR LOS TICKETS 
  const eliminarVentaYProductos = (venta) => {
     eliminarVenta(venta);
 
     venta.productos.forEach(producto => eliminarCompra(producto.Id_producto));
     setVentaGuardada(0)
};









  

   //FUNCION PARA TRAER LOS PAQUETES
   const [paquetes, setPaquetes] = useState([])

   const verTodosLosPaquetes = () =>{
    axios.get(`${URL}paquete/paqueteCompleto`).then((response)=>{
        setPaquetes(response.data)
    }).catch((error)=>{
        console.log('Error al obtener los paquetes', error)
    })
  }

  useEffect(()=>{
    verTodosLosPaquetes()
  })


//FILTRO PARA BUSCAR PAQUETES
const buscador2 = (e) => {
  setBuscar2(e.target.value);
} 
let resultado2 = [];
if (!buscar2) {
  resultado2 = paquetes;
} else {
resultado2 = paquetes.filter((dato) =>
  (dato.nombre_promocion.toLowerCase().includes(buscar2.toLowerCase()))
);
}


const buscador = (e) => {
  const valor = e.target.value.toLowerCase();
  setBuscar(valor);
  const codBarrasLocas = valor.length >= 6;
  if (codBarrasLocas) {
    const productoEncontrado = productos.find(prod => prod.codProducto === valor);
    if (productoEncontrado) {
      handleAgregar(productoEncontrado);
      setBuscar(""); 
    }
  }
};

let resultado = [];
if (!buscar) {
  resultado = productos;
} else {
  resultado = productos.filter((dato) => {
    const nombreProductoIncluye = dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase());
    const codProductoIncluye = dato.codProducto && dato.codProducto.toString().includes(buscar.toLowerCase());
    return nombreProductoIncluye || codProductoIncluye;
  });
}



// Paginación para productos
const productPorPagina = 10;
const [actualPaginaProduct, setActualPaginaProduct] = useState(1);

const ultimoIndexProduc = actualPaginaProduct * productPorPagina;
const primerIndexProduc = ultimoIndexProduc - productPorPagina;

useEffect(() => {
  const productosFiltrados = buscar
    ? productos.filter(dato =>
        dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase()) ||
        (dato.codProducto && dato.codProducto.toString().includes(buscar.toLowerCase()))
      )
    : productos;

  setProductosPaginados(productosFiltrados.slice(primerIndexProduc, ultimoIndexProduc));
  setTotalProductos(productosFiltrados.length);  // Actualiza el total de productos filtrados
}, [buscar, productos, primerIndexProduc, ultimoIndexProduc]);


const  limpiarTabla = () =>{
  eliminarVentas()
}


useEffect(() => {
  setPrecioFinal((prevPrecioFinal) => {
    const nuevosPreciosFinales = { ...prevPrecioFinal };

    listaCompras.forEach((producto) => {
      const idProducto = producto.Id_producto || producto.Id_paquete;

      // Mantener el precio final si el producto ya existía en prevPrecioFinal
      if (!(idProducto in nuevosPreciosFinales)) {
        nuevosPreciosFinales[idProducto] = prevPrecioFinal[idProducto] ?? producto.precioVenta;
      }
    });

    listaCompras.forEach((producto) => {
      const idProducto = producto.Id_producto || producto.Id_paquete;
      const tipoPrecioSeleccionado = preciosSeleccionados[idProducto] || 'Unitario';
      
      let precioBase = parseFloat(producto.precioVenta) || 0;
      const incremento = parseFloat(incrementoUnidad[idProducto]) || 0;
      const descuento = parseFloat(descUnidad[idProducto]) || 0;

      if (producto.tipo_venta === 'granel' && prevPrecioFinal[idProducto]) {
        return;
      }

      if (tipoPrecioSeleccionado === 'Unitario') {
        precioBase = parseFloat(producto.precioVenta) || precioBase;
      } else if (tipoPrecioSeleccionado === 'Mayoreo') {
        precioBase = parseFloat(producto.PrecioMayoreo) || precioBase;
      } else if (tipoPrecioSeleccionado === 'PrecioNuevoProducto') {
        precioBase = parseFloat(producto.precioVenta) || precioBase;
      } else if (producto.precio_paquete > 0) {
        precioBase = parseFloat(producto.precio_paquete) || precioBase;
      }

      // Aquí aplicamos correctamente el incremento y descuento
      const precioCalculado = (precioBase + incremento - descuento).toFixed(2);

      if (
        prevPrecioFinal[idProducto] !== undefined &&
        (incremento !== 0 || descuento !== 0)
      ) {
        nuevosPreciosFinales[idProducto] = precioCalculado;
      } else {
        nuevosPreciosFinales[idProducto] = prevPrecioFinal[idProducto] ?? precioCalculado;
      }
    });

    return nuevosPreciosFinales;
  });
}, [listaCompras, preciosSeleccionados, incrementoUnidad, descUnidad]);







const handleCantidadChange = (e, producto) => {
  const nuevaCantidad = parseFloat(e.target.value);
  const identificador = producto.Id_paquete || producto.Id_producto;

  if (producto.tipo_venta === 'granel') {
    const precioPorKilo = parseFloat(producto.precioVenta) || 1; // Evitar división por 0
    const precioTotal = nuevaCantidad * precioPorKilo; 

    setCantidadesVendidas((prev) => ({
      ...prev,
      [identificador]: nuevaCantidad, 
    }));

    setPrecioFinal((prev) => ({
      ...prev,
      [identificador]: precioTotal.toFixed(2), 
    }));
  } else {
    setCantidadesVendidas((prev) => ({
      ...prev,
      [identificador]: nuevaCantidad, 
    }));
  }
};





const calcularCantidadGramos = (precioActual, precioPorKilo) => {
  return ((precioActual * 1000) / precioPorKilo / 1000).toFixed(3);
};



const handlePrecioChange = (e, producto) => {
  const nuevoPrecio = parseFloat(e.target.value);
  const idProducto = producto.Id_producto || producto.Id_paquete;

  setPrecioFinal(prev => ({
    ...prev,
    [idProducto]: nuevoPrecio
  }));


  if (producto.tipo_venta === 'granel') {
    const precioPorKilo = parseFloat(producto.precioVenta) || 1; 
    const cantidadGramos = calcularCantidadGramos(nuevoPrecio, precioPorKilo);

    setCantidadesVendidas(prev => ({
      ...prev,
      [producto.Id_producto]: cantidadGramos,
    }));
  }
};










  //FUNCIONES PARA LOS EGRESOS 

  const [showModalMotivoEgresos, setShowModalMotivoEgresos] = useState(false);
  const handleShowModalMotivosEgresos = () => setShowModalMotivoEgresos(true);
  const handleCloseModalMotivosEgesos= () => setShowModalMotivoEgresos(false);

  const [DescripcionParaEgreso, setDescripcionParaEgreso] = useState(0)
  const [MotivosEgresos, setMotivosEgresos] = useState([])
  const [IdMotivoEgreso, setIdMotivoEgreso] = useState(0)
  const [EgresoSeleccionado, setEgresoSeleccionado] = useState(0)
  const [motivoEgreso, setMotivoEgreso] = useState("")

  const crearMotivoEgreso = () =>{
    axios.post(`${URL}movimientos/retistrarMotivosEgresos/post`,{
      Motivo: motivoEgreso
    }).then(()=>{
      Swal.fire('Motivo guardado con exito!', '', 'success');
      setMotivoEgreso("")
      handleCloseModalMotivosEgesos()
      verMotivoEgresos()
    }).catch((error)=>{
      console.log('Erro al crear el motivo de egreso', error)
    })
  }

  const verMotivoEgresos = () =>{
    axios.get(`${URL}movimientos/verMotivosEgresos`).then((response)=>{
      setMotivosEgresos(response.data)
    }).catch((error)=>{
      console.log('Error al obtener los motivos de egresos', error)
    })
  }

  const seleccionarMotivo = (m) =>{
    setIdMotivoEgreso(m.IdMotivoEgreso)
    setMotivoEgreso(m.motivo)
    setEgresoSeleccionado(1)
  }


  const editarMotivoEgreso = () =>{
    axios.put(`${URL}movimientos/editarMotivosEgresos`,{
      IdMotivoEgreso : IdMotivoEgreso,
      Motivo: motivoEgreso
    }).then(()=>{
      Swal.fire('Motivo editado con exito!', '', 'success');
      setMotivoEgreso("")
      verMotivoEgresos()
      setEgresoSeleccionado(0)
    }).catch((error)=>{
      console.log('Error al editar el motivo del egreso', error)
    })
  }

  const cancelarEditarMotivo = () =>{
    setEgresoSeleccionado(0)
    setMotivoEgreso("")
  }

  const EliminarMotivoEgreso = (IdMotivoEgreso) =>{
    axios.put(`${URL}movimientos/eliminarMotivosEgresos/${IdMotivoEgreso}`).then(()=>{
      Swal.fire('Motivo eliminado con exito!', '', 'success');
      verMotivoEgresos()
    }).catch((error)=>{
      console.log('Error al eliminar el motivo del egreso', error)
    })
  }


    const ventasPorPagina =5
    const [actualPaginaVentas, setActualPaginaVentas] = useState(1)
    const [totalPaginasVentas, setTotalPaginasVentas] = useState(0)
    const ultimoIndexVentas = actualPaginaVentas * ventasPorPagina;
    const primerIndexVentas = ultimoIndexVentas - ventasPorPagina;



   

  useEffect(()=>{
    verMotivoEgresos()
  },[])

  const buscadorusuario = (e) => {
    setBuscar(e.target.value)
  }

  let resultadousuario = []
  if (!buscar) {
    resultado = ver
  } else {
    resultado = ver.filter((dato) =>
      dato.nombre_usuario.toLowerCase().includes(buscar.toLowerCase())
    )
  }
  

return (
      <>
      <App/>
      <div className='h3-ventas'>
        <h1>VENTAS</h1>
      </div>

      
      <div className='container-fluid'>
            <div className='row'>
            <div className='col'>
                <h1 style={{marginTop: '40px'}}>A&L SOFTWARE</h1>
                <ContenedorBotones style={{marginTop: '50px'}}> 
                <Button variant="dark" onClick={handleShowModal8}>
                    <Badge badgeContent={listaCompras.length} color="secondary">
                    F10-PRODUCTOS <img src={carritoImg} alt="carrito" style={{ width: '25px', height: 'auto', marginLeft: "7px" }}/>
                    </Badge>
                </Button>
                <Button variant="dark" onClick={handleShowModal11}>
                    <Badge badgeContent={listaCompras.length} color="secondary">
                    F-1 PROMOS <img src={carritoImg} alt="carrito" style={{ width: '25px', height: 'auto', marginLeft: "7px" }}/>
                    </Badge>
                </Button>
                 </ContenedorBotones> 
            </div>
            </div>
        </div>

        <div className='container-fluid'>
          <div className='horizontal-list'>
          {listaVentas.map((venta, index) => (
              <div key={venta.Id_venta || index}> 
                <Button onClick={() => agregarProductosAVentas(venta, index)}>TICKET {index + 1}</Button> 
                <Button className="btn btn-danger" onClick={() => eliminarVentaYProductos(venta, index)}><IoMdCloseCircle /></Button>
              </div> 
            ))}        
          </div>
        </div> 
        

       <br />
    
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>VER DETALLE VENTA</Modal.Title>
            </Modal.Header>

    
            <Modal.Body>
            <h3><b>SUBTOTAL: </b></h3>
            <h4><b>{formatCurrency(calcularTotal())}</b></h4>
            <h3><b>TOTAL: </b></h3>
            <h4><b>{formatCurrency(SumarIntereses())}</b></h4>
          <label><b>ABONA CON:</b></label>
          <input type="number" placeholder='$ 0.00' className='form-control'onChange={(e) => setVuelto(e.target.value)} />
          <br/>
          <label>Metodo de Pago:</label>
          <select id="metodoPago" className='form-select' onChange={TestMeto}>
            {verMetodoPago.map(metodo => (
              <option key={metodo.Id_metodoPago} value={metodo.Id_metodoPago}>{metodo.tipo_metodoPago}</option>
            ))}
          </select>
          <br/>
          <label>Intereses</label>
          <input type="number" placeholder='% 0.00' className='form-control' onChange={(e) => setIntereses(e.target.value)} />
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
    <label><b>CAMBIO: {formatCurrency(cambio())}</b></label>
  )
}
<br /><br />

    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
        className="btn btn-success" 
        style={{ width: '400px', marginTop: '6px' }}  
        onClick={FinalizarVenta}
        >
       F4-FINALIZAR VENTA CON TICKET
      </Button>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
        className="btn btn-primary" 
        style={{ width: '400px', marginTop: '6px' }}  
        onClick={FinalizarVentaSinTicket}
        >
       F2-FINALIZAR VENTA SIN TICKET
      </Button>
    </div>
       



            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal}>
                CERRAR
              </Button>
            </Modal.Footer>
          </Modal>


          <Modal show={showModal2} onHide={handleCloseModal2} dialogClassName="custom-modal" >
            <Modal.Header closeButton>
              <Modal.Title>ULTIMA VENTA</Modal.Title>
            </Modal.Header>   
            <Modal.Body>
            <label className='lbl-corte'>Reporte iniciado de la fecha: {formatDate(fechaSeleccionada)}</label><br />
              
              <DatePicker
                selected={fechaSeleccionada}
                onChange={(date) => {
                    setFechaSeleccionada(date)
                }}
                className='form-control custom-date-picker custom-datepicker-wrapper'
                dateFormat="yyyy/MM/d"
                locale={es}
                placeholderText='Ingrese una fecha'
              />
              <br /> <br />
            
            <div className='container table'>
            <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
            <thead className='custom-table-header'>
            <tr>
                <th>FOLIO</th>
                <th>PRODUCTO</th>
                <th>CANTIDAD VENDIDA</th>
                <th>PRECIO UNITARIO</th>
                <th>PRECIO TOTAL</th>
                <th>USUARIO</th>
                <th>FECHA </th>
                <th>ACCIONES</th>
                <th>ELIMINAR PRODUCTOS</th>
              </tr>
            </thead>
            <tbody>
              {ultimoDetalle.slice(primerIndexVentas,ultimoIndexVentas).map((detalle) => (
                <tr key={detalle.Id_detalleVenta}>
                  <td>{detalle.Id_venta}</td> 

                  <td>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {detalle.paquetes && detalle.paquetes.length > 0 && detalle.paquetes.map(paquete => (
                        <li key={paquete.Id_paquete} style={{ marginLeft: '20px', fontWeight: 'bold' }}>
                          {paquete.nombre_promocion}
                        </li>
                      ))}
                      {detalle.productos && detalle.productos.length > 0 && detalle.productos.map(producto => (
                        <li key={producto.Id_producto} style={{ marginLeft: '20px' }}>
                          {producto.nombre_producto}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {detalle.paquetes && detalle.paquetes.length > 0 && detalle.paquetes.map(paquete => (
                        <li key={paquete.Id_paquete} style={{ marginLeft: '20px' }}>
                          {paquete.cantidadVendida}
                        </li>
                      ))}
                      {detalle.productos && detalle.productos.length > 0 && detalle.productos.map(producto => (
                        <li key={producto.Id_producto} style={{ marginLeft: '20px' }}>
                        <strong>{producto.cantidadVendida}</strong> 
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className='precio'>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {detalle.paquetes && detalle.paquetes.length > 0 && detalle.paquetes.map(paquete => (
                        <li key={paquete.Id_paquete} style={{ marginLeft: '20px', fontWeight: 'bold' }}>
                          {formatCurrency(paquete.precio_paquete ? paquete.precio_paquete : '')}
                        </li>
                      ))}
                      {detalle.productos && detalle.productos.length > 0 && detalle.productos.map((producto) => (
                        <li key={producto.Id_producto} style={{ marginLeft: '20px' }}>
                          <strong>{formatCurrency(producto.precioVenta ? producto.precioVenta : '')}</strong>
                        </li>
                      ))}
                    </ul>
                  </td>       
                  <td>{formatCurrency(detalle.precioTotal_venta)}</td>
                  <td>{detalle.usuarios.nombre_usuario}</td>
                  <td>{new Date(detalle.fecha_registro).toLocaleString()}</td>
                  <td>
                    <ButtonGroup>
                    <Button className="btn btn-danger" onClick={() => eliminarUltimaVenta(detalle.productos, detalle.Id_venta, detalle,detalle.usuarios.nombre_usuario )}>
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </Button>
                    <Button
                      className="btn btn-success"
                      onClick={(e) => {
                        e.target.disabled = true;
                        const productosParaTicket = [...detalle.productos, ...detalle.paquetes];
                        imprimirTicket(productosParaTicket, detalle.precioTotal_venta);
                        setTimeout(() => { e.target.disabled = false; }, 2000); // ✅ Evita bloqueo permanente
                      }}
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </Button>
                    </ButtonGroup>
                
                  </td>               
                  <td>
                  <Button className="btn btn-warning"
                    onClick={()=>seleccionarVenta(detalle.Id_venta)}
                  >
                    <FontAwesomeIcon icon={faTrash}/>
                  </Button>
                    </td>         
                </tr>            
              ))}
            </tbody>
 
          </table>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          {totalPaginasVentas > 1 && (
            <Paginacion 
              productosPorPagina={ventasPorPagina}
              actualPagina={actualPaginaVentas}
              setActualPagina={setActualPaginaVentas}
              total={totalPaginasVentas}
            />
          )}
        </div>

         
          
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal2}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>
    
    
          <Modal show={showModal3} onHide={handleCloseModal3}>
            <Modal.Header closeButton>
              <Modal.Title>GUARDAR VENTA</Modal.Title>
            </Modal.Header>   
            <Modal.Body>
         
            <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th scope="col">NOMBRE</th>
                      <th scope="col">PRECIO</th>
                      <th scope="col">TIPO VENTA</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {listaCompras.map(producto => (
                      <tr key={producto.Id_producto}>
                        <td>{producto.nombre_producto}</td>
                        <td className='precio'>${producto.precioVenta}</td>
                        <td>{producto.tipo_venta}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              
                {listaCompras.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => guardarVenta()} 
                  >
                    GUARDAR
                  </button>
                )}
            </>

             
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal3}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>
        

          <div className='container-fluid table'>
  <Table striped bordered hover className='custom-table'>
    <thead className='custom-table-header'>
      <tr>
        <th scope="col">NOMBRE PRODUCTOS</th>
        <th scope="col">PRECIO</th>
        <th scope="col">PRECIO MAYOREO</th>
        <th scope="col">TIPO VENTA</th>
        <th scope="col">CANTIDAD</th>
        {rolUsuario !== 'empleado' && (
          <>
            <th scope="col">DESCUENTO UNIDAD</th>
            <th scope="col">INCREMENTO UNIDAD</th>
          </>
        )}
        <th>SUBTOTAL X PRODUCTO</th>
        <th scope="col">ELIMINAR</th>
      </tr>
    </thead>
    <tbody>
      {listaCompras.map(producto => (
        <tr key={producto.Id_producto}>
          <td>{producto.nombre_promocion || producto.nombre_producto}</td>
          <td>
            {producto.precio_paquete > 0 ? (
              producto.precio_paquete
            ) : (
              <input
                type="number"
                style={{ width: '130px', backgroundColor: '#E3EEFF', color: 'black', borderColor: '#17486C' }}
                className='form-control'
                value={precioFinal[producto.Id_producto] || '0.00'}
                onChange={(e) => handlePrecioChange(e, producto)}
              />
            )}
          </td>
          <td>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={usarMayoreo[producto.Id_producto] || false}
                  onChange={(e) => {
                    const checked = e.target.checked; // esto me sirve para saber si esta marcado el check o no
                    const nuevoPrecio = checked
                      ? producto.PrecioMayoreo //ternario basico
                      : producto.precioVenta;

                    setUsarMayoreo({
                      ...usarMayoreo,
                      [producto.Id_producto]: checked
                    });

                    setPrecioFinal({
                      ...precioFinal,
                      [producto.Id_producto]: nuevoPrecio
                    });
                  }}
                />
                <label className="form-check-label">
                {formatCurrency(producto.PrecioMayoreo)}
                </label>
              </div>
            </td>

          <td>{producto.tipo_venta || "Promo"}</td>
          <td>
            <input
              type="number"
              style={{ width: '130px', backgroundColor: '#E3EEFF', color: 'black', borderColor: '#17486C' }}
              className='form-control'
              value={cantidadesVendidas[producto.Id_producto] || cantidadesVendidas[producto.Id_paquete]}
              onChange={(e) => handleCantidadChange(e, producto)}
              min={0}
            />
          </td>

          {rolUsuario !== 'empleado' && (
            <>
             <td>
                <input
                  type="number"
                  style={{ width: '130px', backgroundColor: '#E3EEFF', color: 'black', borderColor: '#17486C' }}
                  className='form-control'
                  value={descUnidad[producto.Id_producto] || ''}
                  min={0}
                  onChange={(e) => setDescUnidad({
                    ...descUnidad,
                    [producto.Id_producto]: e.target.value
                  })}
                />
              </td>
              <td>
                <input
                  type="number"
                  style={{ width: '130px', backgroundColor: '#E3EEFF', color: 'black', borderColor: '#17486C' }}
                  className='form-control'
                  value={incrementoUnidad[producto.Id_producto] || ''}
                  min={0}
                  onChange={(e) => setIncrementoUnidad({
                    ...incrementoUnidad,
                    [producto.Id_producto]: e.target.value
                  })}
                />
              </td>

            </>
          )}
          <td>
            {(() => {
              const identificador = producto.Id_paquete || producto.Id_producto; 
              const precioBase =
                parseFloat(precioFinal[identificador]) ||
                parseFloat(producto.precio_paquete) || 
                0;

              const cantidad = parseFloat(cantidadesVendidas[identificador]) || 0;

              const subtotal = producto.tipo_venta === 'granel'
                ? precioBase
                : precioBase * cantidad;

              return <strong>{formatCurrency(subtotal)}</strong>;
            })()}
          </td>



          <td>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => eliminarVentaDeLaTabla(producto)}
            >
              ELIMINAR
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>
<h3 style ={{color: '#6d4c41', textAlign: 'end', marginRight: '100px' }}><strong>SUBTOTAL: {formatCurrency(calcularTotal())}</strong></h3>
          <Modal show={showModal8} onHide={handleCloseModal8} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>PRODUCTOS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col"><input className='form-control' type="text" placeholder="Buscar un producto..." onChange={buscador} ref={inputRef}   value={buscar} /><br /></div>
              <div className="col"><Button onClick={limpiarInput} style={{color: '#fff'}} variant='warning'>LIMPIAR</Button></div>
            </div>
          </div>
          
          <div className="container-fluid table">
          <Table striped bordered hover className='custom-table'>
          <thead className='custom-table-header'>
              <tr>
                <th>NOMBRE</th>
                <th>DESCRIPCIÓN</th>
                <th>PRECIO</th>
                <th>PRECIO MAYOREO</th>
                <th>TIPO VENTA</th>
                <th>VENDER</th>
              </tr>
            </thead>
            <tbody>
              {buscar && productosPaginados.length > 0 ? (
                productosPaginados.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nombre_producto}</td>
                    <td>{item.descripcion_producto}</td>
                    <td  className='precio-venta-nuevo'><strong>{formatCurrency(item.precioVenta)}</strong></td>
                    <td className='precio'><strong>{formatCurrency(item.PrecioMayoreo)}</strong></td>
                    <td>{item.tipo_venta}</td>
                    <td>
                      <Button className="btn btn-success" onClick={() => handleAgregar(item)}>VENDER</Button>
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
          {buscar && (
            <Paginacion 
              productosPorPagina={productPorPagina} 
              actualPagina={actualPaginaProduct} 
              setActualPagina={setActualPaginaProduct} 
              total={totalProductos}
            />
          )}
          <Button variant="danger" onClick={handleCloseModal8}>CERRAR</Button>
        </Modal.Footer>
      </Modal>


      
      
      

            {/* MODOL PAQUETES */}

          <Modal
              show={showModal11} onHide={handleCloseModal11} 
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                <h4>PROMOS</h4>
                 <input  onChange={buscador2}  type="text" placeholder='Busca un paquete...' className='form-control' ref={inputRef} /> 
                </Modal.Title>
              </Modal.Header>
          <Modal.Body>
          <div className='container table'>
              <Table striped bordered hover className='custom-table'>
                  <thead className='custom-table-header'>
                      <tr>
                          <th>NOMBRE</th>
                          <th>PRECIO</th>
                          <th>VENDER</th>
                      </tr>
                  </thead>
                  <tbody>
                      {buscar2.length > 0 ? (
                          resultado2.map((item, index) => (
                              <tr key={index}>
                                      <>
                                          <td>{item.nombre_promocion}</td>
                                          <td className='precio'>{formatCurrency(item.precio_paquete)}</td>
                                          <td>
                                              <Button className="btn btn-primary" onClick={() => handleAgregar(item)}>VENDER</Button>
                                          </td>
                                      </>
                              
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan="6" className="text-center">Por favor, comience a buscar para ver los resultados</td>
                          </tr>
                      )}
                  </tbody>
              </Table>
          </div>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal11}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>
      
      
      
      
      <Modal show={showModal4} onHide={handleCloseModal4}>
            <Modal.Header closeButton>
              <Modal.Title> VENTA GUARDADA</Modal.Title>
            </Modal.Header>   
            <Modal.Body>
         
            <>
  <Table striped bordered hover className='custom-table'>
          <thead>
                <tr>
                  <th scope="col">NOMBRE</th>
                  <th scope="col">PRECIO</th>
                  <th scope="col">TIPO VENTA</th>
                  <th scope="col">CONTINUAR CON LA VENTA</th>
                </tr>
              </thead>
              <tbody>
                {listaVentas.map((venta, index) => (
                  venta.productos.map((productoVendido, i) => (
                    <tr key={`${index}-${i}`}>
                      <td>{productoVendido.nombre_producto}</td>
                      <td className='precio'>${productoVendido.precioVenta}</td>
                      <td>{productoVendido.tipo_venta}</td>
                    </tr>
                  ))
                ))}
              </tbody>
 
                </Table>
            </>


             
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal4}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>


          <Modal show={showModal9} onHide={handleCloseModal9}>
            <Modal.Header closeButton>
              <Modal.Title>INGRESOS Y EGRESOS </Modal.Title>
            </Modal.Header>   
            <Modal.Body >    
              <MDBInputGroup>
              <span className="input-group-text">
                    <FontAwesomeIcon icon={faBarcode} size="lg" style={{color: "#012541"}} />
              </span>
              <input className="form-control" ref={inputRef} type="password" placeholder="Ingrese el codigo" value={codigoMov} onChange={(e) => setCodigoMov(e.target.value)} />  
              </MDBInputGroup>
              <br />
              <Button variant="success" onClick={validarCodigo}>
                ENVIAR
              </Button>
            </Modal.Body>
            <Modal.Footer>
              
              <Button variant="danger" onClick={handleCloseModal9}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>

          <Modal show={showModal10} onHide={handleCloseModal10}>
            <Modal.Header closeButton>
              <Modal.Title>BUSCAR PRODUCTO </Modal.Title>
            </Modal.Header>   
            <Modal.Body >    
              <MDBInputGroup>
              <span className="input-group-text">
                    <FontAwesomeIcon icon={faBarcode} size="lg" style={{color: "#012541",}} />
            </span>
              <input className="form-control" ref={inputRef} type="text" placeholder="Ingrese el codigo del producto" value={IdProducto_precio} onChange={(e) => setIdProducto_precio(e.target.value)} />  
              </MDBInputGroup>
              <br />

                {
                  precioProducto.map(produc=>((
                    <>
                    <h4><strong>Nombre:</strong> {produc.nombre_producto}</h4>
                    <h4><strong>Precio:</strong> ${produc.precioVenta}</h4><br />
                    <Button variant="secondary" onClick={() => handleAgregar2(produc)}>
                      AGREGAR AL CARITO
                    </Button>
                    </>
                  )))
                   
                
                }
              <br /><br />
             
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" onClick={verPrecioProducto}>
                      BUSCAR
            </Button> 
              <Button variant="danger" onClick={handleCloseModal10}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>




          <Modal show={showModal5} onHide={handleCloseModal5}>
            <Modal.Header closeButton>
              <Modal.Title>INGRESOS Y EGRESOS </Modal.Title>
            </Modal.Header>   
            <Modal.Body >    
                <Button className='btn btn-success m-2' onClick={handleShowModal6}>REGISTRAR INGRESO</Button>
                <Button className='btn btn-danger m-2' onClick={handleShowModal7}>REGISTRA EGRESO </Button>         
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal5}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>
          <Modal show={showModal6} onHide={handleCloseModal6}>
            <Modal.Header closeButton>
              <Modal.Title >REGISTRAR INGRESO</Modal.Title>
            </Modal.Header>   
            <Modal.Body>       
              <MDBInputGroup className="mb-3">
              <span className="input-group-text">
            <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#012541",}} />
            </span>
                <input className="form-control" type="text" placeholder="Ingrese el motivo" value={descripcionIngreso} onChange={(e) => setDescripcionIgreso(e.target.value)} />
              </MDBInputGroup>
              <MDBInputGroup  className="mb-3">
              <span className="input-group-text">
            <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#012541",}} />
            </span>
                <input className="form-control" type="number" placeholder="Ingrese el monto total" value={montoTotalIngreso} onChange={(e) => setMontoTotalIngreso(e.target.value)} />
              </MDBInputGroup>


              <Button className='btn btn-success m-2' onClick={RegistrarIngreso}>REGISTRAR </Button>   
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal6}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>

          <Modal show={showModal7} onHide={handleCloseModal7}>
  <Modal.Header closeButton>
    <Modal.Title>REGISTRAR EGRESO </Modal.Title>
  </Modal.Header>
  <Modal.Body>    

    <MDBInputGroup className="mb-3">
    <span className="input-group-text">
        <FontAwesomeIcon icon={faClipboard}size="lg" style={{color: "#012541"}} />
      </span>
        <input
          placeholder="Ingrese el motivo"
          className='form-control'
          value={descripcionEgreso}
          onChange={(e) => setDescripcionEgreso(e.target.value)}
          type='text'
        />
    </MDBInputGroup>

    <MDBInputGroup className="mb-3">
      <span className="input-group-text">
        <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#012541"}} />
      </span>
      <input 
        className="form-control" 
        type="number" 
        placeholder="Ingrese el monto total" 
        value={montoTotalEgreso} 
        onChange={(e) => setMontoTotalEgreso(e.target.value)} 
      />
    </MDBInputGroup>

    <Button className='btn btn-success m-2' onClick={RegistrarEngreso}>REGISTRAR</Button> 
  </Modal.Body>
  <Modal.Footer>
    <Button variant="danger" onClick={handleCloseModal7}>
      CERRAR
    </Button>
  </Modal.Footer>
</Modal>


          


          <div className='container'>
      <div className='row'>
        <div className='col'><Button onClick={handleShowModal2} className='btn btn-danger'style={{width: '200px', marginTop:'10px', color: '#fff'}}>VENTAS DEL DIA</Button></div>
        <div className='col'><Button onClick={handleShowModal} className='btn btn-success' style={{width: '200px', marginTop:'10px', color: '#fff'}}>F12-COBRAR</Button></div>  
        
        {rolUsuario === 'admin' | rolUsuario === 'encargado' ? (
            <div className='col'><Button onClick={handleShowModal5}className='btn btn-primary' style={{width: '200px', marginTop:'10px', color: '#fff'}}>F8-MOVIMIENTOS</Button></div>
           ) :  
           <div className='col'><Button onClick={handleShowModal9}className='btn btn-primary' style={{width: '200px', marginTop:'10px', color: '#fff'}}>F8-MOVIMIENTOS</Button></div>
        }  
      
        <div className='col'><Button onClick={handleShowModal10} className='btn btn-secondary'style={{width: '200px', marginTop:'10px', color: '#fff'}}>F9-VERIFICADOR</Button></div>

      </div>
    </div>
    
    <div className='container'>
      <div className='row'>
      
      <div className='col'><Button onClick={handleShowModal3} className='btn btn-dark'style={{width: '200px', marginTop:'10px', color: '#fff'}}>F6-GUARDAR VENTA</Button></div>
        <div className='col'><Button onClick={handleShowModal12} variant='dark' style={{width: '190px', marginTop:'10px', color: '#fff'}}>F11-AGREGAR</Button></div>
        <div className='col'><Button onClick={limpiarTabla} variant='danger' style={{width: '190px', marginTop:'10px', color: '#fff'}}>F3-LIMPIAR TABLA</Button></div>
      </div>
    </div>





    <Modal show={showModal12} onHide={handleCloseModal12}>
            <Modal.Header closeButton>
              <Modal.Title >CREAR PRODUCTO</Modal.Title>
            </Modal.Header>   
            <Modal.Body>       
              <MDBInputGroup className="mb-3">
              <span className="input-group-text">
            <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#012541",}} />
            </span>
                <input className="form-control" ref={inputRef} type="text" placeholder="Ingrese el nombre del producto" value={nombreProductoNuevo} onChange={(e) => setNombreProductoNuevo(e.target.value)} />
              </MDBInputGroup>
              <MDBInputGroup  className="mb-3">
              <span className="input-group-text">
            <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#012541",}} />
            </span>
                <input className="form-control" type="number" placeholder="Ingrese el precio del producto" value={precioProductoNuevo} onChange={(e) => setPrecioProductoNuevo(e.target.value)} />
              </MDBInputGroup>


              <Button className='btn btn-success m-2' onClick={()=>handleAgregar3(nombreProductoNuevo,precioProductoNuevo)}>REGISTRAR </Button>   
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModal12}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>




          
        {/* MODAL EGRESOS */}
        <Modal show={showModalMotivoEgresos} onHide={handleCloseModalMotivosEgesos}>
            <Modal.Header closeButton>
              <Modal.Title >MOTIVOS DE EGRESOS</Modal.Title>
            </Modal.Header>   
            <Modal.Body>       
              <MDBInputGroup className="mb-3">
              <span className="input-group-text">
              <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#012541"}} />
              </span>
              <input className="form-control" ref={inputRef} type="text" placeholder="Ingrese el motivo del egreso" value={motivoEgreso} onChange={(e) => setMotivoEgreso(e.target.value)} />
              </MDBInputGroup>
        
              <div className='container table'>
            <Table striped bordered hover>
            <thead>
              <tr>
                <th>MOTIVO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>

              {MotivosEgresos.map((m)=>(
                <tr key={m.IdMotivoEgreso}>
                    <td >{m.Motivo}</td>
                  <td>
                  <ButtonGroup aria-label="Basic example" >
                    <Button variant="dark" onClick={()=>seleccionarMotivo(m)}><FontAwesomeIcon icon={faPencil} size="lg" style={{color: "0048fb"}}/></Button>
                    <Button variant="dark" onClick={()=>EliminarMotivoEgreso(m.IdMotivoEgreso)}><FontAwesomeIcon icon={faTrash} size="lg" style={{color: "red"}}/> </Button>
                  </ButtonGroup>
                  </td>
                </tr>
                
              ))}
            </tbody>
 
          </Table>
          </div>
              {EgresoSeleccionado === 1 ? 
              <>
              <Button className='btn btn-warning m-2' onClick={editarMotivoEgreso}>EDITAR </Button>  
              <Button className='btn btn-danger m-2' onClick={cancelarEditarMotivo}>CANCELAR </Button>   
              </>
            :
            <Button className='btn btn-success m-2' onClick={crearMotivoEgreso}>REGISTRAR </Button>   
            }
             
              
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModalMotivosEgesos}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>




      {/* MODAL PRODUCTOS VENTA */}
      <Modal size='lg' show={showModalVerProductosVenta} onHide={handleCloseModalVerProductosVenta}>
            <Modal.Header closeButton>
              <Modal.Title >DETALLE VENTA</Modal.Title>
            </Modal.Header>   
            <Modal.Body>       
          
              <div className='container table'>
              <Table striped bordered hover>
              <thead>
                <tr>
                  <th>VENTA</th>
                  <th>PRODUCTOS</th>
                  <th>CANTIDAD</th>
                  <th>PRECIO</th>
                  <th>ELIMINAR</th> 
                </tr>
              </thead>
              <tbody>
              {verVentaSeleccionada.map((dv)=>(
                <tr key={dv.Id_detalleVenta}>
                    <td >{dv.Id_venta}</td>
                    <td >{dv.nombre_producto || dv.nombre_promocion}</td>
                    <td >{dv.CantidadVendida}</td>
                    <td >{formatCurrency(dv.precioVenta || dv.precio_paquete)}</td>
                    <td>
                      <Button variant='danger' onClick={()=>eliminarProductoVenta(dv.Id_detalleVenta,dv)}>
                        <FontAwesomeIcon icon={faTrash}/>
                      </Button></td>
                </tr>
                
              ))}
            </tbody>
 
          </Table>
          </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseModalVerProductosVenta}>
                CERRAR
              </Button>
             
            </Modal.Footer>
          </Modal>


      </>
      )
    }

export default TestVenta



const ContenedorBotones = styled.div`
padding: 10px;
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 30px;
`;

