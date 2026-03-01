/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import  { useContext, useEffect, useState } from 'react'
import App from '../App'
import { faDollar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSackDollar} from '@fortawesome/free-solid-svg-icons'
import { faTags } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faCashRegister  } from '@fortawesome/free-solid-svg-icons'
import { faChartSimple} from '@fortawesome/free-solid-svg-icons'
import { faScissors } from '@fortawesome/free-solid-svg-icons'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
import Table from 'react-bootstrap/Table';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import axios from 'axios'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { DataContext } from '../context/DataContext.jsx';
import { Modal} from 'react-bootstrap';
import { MDBInputGroup } from 'mdb-react-ui-kit';
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ScrollToTopButton from "../components/utils/ScrollToTopButton.jsx"


const Corte2 = () => {


const [ventas, setVentas] = useState([]);
const [ventaxcategoria, setVentaXcategoria] = useState([]);
const [ventaxcliente, setVentaXcliente] = useState([]);
const [ventasEliminadas, setVentasElimindas] = useState([]);
const [ingresoEfectivo, setIngresoEfectivo] = useState([]);
const [egresoEfectivo, setEgresoEfectivo] = useState([])
const [ganancia, setGanancia] = useState(0);
const [gananciaUsuario, setGananciaUsuario] = useState(0);
const [importe, setImporte] = useState(0);
const [ganancia2, setGanancia2] = useState([]);
const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
const [corteIniciado, setCorteIniciado] = useState(false)
const [corteSeleccionado, setCorteSeleccionado] = useState(true)
const [ventaxpaquete, setVentaXPaquete] = useState(0)
const [costopaquete, setCostoPaquete] = useState([])
const [productoseliminados, setProductosEliminados] = useState([])

const [ventaxpaqueteXusuarios, setVentaPaqueteXusuarios] = useState(0)
const [ganaciaPaqueteXusuarios, setGanaciaPaqueteXUsuarios] = useState([])

const [VentasPorcategoriasUsuarios, setVentasPorcategoriasUsuarios] = useState([])
const [mostrarVentasPorCategoriasUsuarios, setMostrarVentasPorCategoriasUsuarios] = useState(false)


const [fondoCajaImporte, setFondoCajaImporte] = useState(0)
const [fondoCaja, setFondoCaja] = useState([])
const [IdUsuario, setIdUsuario] = useState("")
const [time, setTime] = useState(new Date());
const [caja, setCaja] = useState([])

const [idCaja, setIdCaja] = useState(0)

const [mostrarFondoCaja, setMostrarFondoCaja] = useState(false)
const [mostrarVentasPaqueteUsuario, setMostrarVentasPaqueteUsuarios] = useState(false)
const [importeXusuario, setImportePorUsuario] = useState(0)
const [mostrarVentaUsuario, setMostrarVentaUsuario ] = useState(false)
const [fechaLogin, setFechaLogin] = useState("")
const [fechaCierre, setFechaCierre] = useState(new Date())
const [tablaIngreso, setTablaIngreso] = useState([])
const [tablaEgreso, setTablaEgreso]= useState([]) 
const [nombreEmpleado, setNombreEmpleado] = useState("")
const [usuarios, setUsuarios] = useState([])
const Id_usuario = sessionStorage.getItem("idUsuario")
const id_sucursal = sessionStorage.getItem("sucursalId")
const [codigoMov,setCodigoMov] = useState('')
const [ventaEliminada, setVentaEliminada] = useState(false)
const [pagoCredito, setPagoCredito] = useState(false)

const [tablaEgresoUsuario, setTablaEgresoUsuario] = useState(false)
const [tablaIngresoUsuario, setTablaIngresoUsuario] = useState(false)
const [tablaIngresoEgreso, setTablaIngresoEgreso] = useState(true)
const [tablasEscuendidas, setTabalasEscuendidas] = useState(true)


const [showModal9, setShowModal9] = useState(false);
const handleShowModal9 = () => setShowModal9(true);
const handleCloseModal9 = () => {
  setShowModal9(false)
  setCodigoMov("")
}

const {  URL } = useContext(DataContext);



  useEffect(() => {
    const id_sucursal = sessionStorage.getItem("sucursalId");
    axios.get(`${URL}usuarios/sucursal/${id_sucursal}`)
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching sucursales:', error);
      });
  }, []);  


 

  const fetchVentaTotal = () => {
    const formattedDate = formatDate(fechaSeleccionada);
    fetch(`${URL}corte/ventatotal?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
      .then((response) => response.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error('Error al obtener los datos del corte del día:', error));
  };


  const fetchVentaTotalxCategoria = () => {
    const formattedDate = formatDate(fechaSeleccionada);
    fetch(`${URL}corte/ventatotalxcategoria?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
      .then((response) => response.json())
      .then((data) => {
        setVentaXcategoria(data);
      })
      .catch((error) => console.error('Error al obtener los datos de venta por categoría:', error));
  };

  
  const fetchVentaTotalxCategoriaUsuarios = () => {
    const formattedDate = formatDate(fechaSeleccionada);
     const idUsuario = document.getElementById("usuarios").value;
    fetch(`${URL}corte/ventaxCategoriaUsuarios?formattedDate=${formattedDate}&Id_sucursal=${id_sucursal}&Id_usuario=${idUsuario}&Id_caja=${idCaja}`)
    .then((response) => response.json())
      .then((data) => {
        setVentasPorcategoriasUsuarios(data);
      })
      .catch((error) => console.error('Error al obtener los datos de venta por categoría:', error));
  };



  const fetchVerGanancia = () => {
    const formattedDate = formatDate(fechaSeleccionada);
    fetch(`${URL}corte/verganancia?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const ganancia = parseFloat(data[0].ganancia_total);
        if (!isNaN(ganancia)) {
          setGanancia(ganancia);
        } else {
          console.error('Error: el valor de ganancia no es un número válido:', data[0].ganancia_total);
          setGanancia(0); 
        }
      })
      .catch((error) => {
        console.error('Error al obtener los datos de ganancia:', error);
        setGanancia(0); 
      });
  };

  const fetchVerGananciaXUsuario = (idUsuario) => {
    const formattedDate = formatDate(fechaSeleccionada);
    fetch(`${URL}corte/gananciaUsuario?formattedDate=${formattedDate}&Id_usuario=${idUsuario}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const ganaciaUsuario = parseFloat(data[0].ganancia_total);
        if (!isNaN(ganaciaUsuario)) {
          setGananciaUsuario(ganaciaUsuario);
        } else {
          console.error('Error: el valor de ganancia no es un número válido:', data[0].ganancia_total);
          setGananciaUsuario(0); 
        }
      })
      .catch((error) => {
        console.error('Error al obtener los datos de ganancia:', error);
        setGananciaUsuario(0);
      });
  };


  const fetchVerImporte = () => {
    const formattedDate = formatDate(fechaSeleccionada);
     fetch(`${URL}corte/importeventatotal?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
     .then((response) => {
      return response.json();
    })
    .then((data) => {
      const importe = parseFloat(data[0].importe_total_venta);
      if (!isNaN(importe)) {
        setImporte(importe);
      } else {
        console.error('Error: el valor de importe no es un número válido:', data[0].importe_total_venta);
        setImporte(0);  
      }
    })
    .catch((error) => {
      console.error('Error al obtener los datos de importe:', error);
      setImporte(0); 
     });
  }


  
  const fetchVerImporteXUsuario = () => {
    const formattedDate = formatDate(fechaSeleccionada);
    const Id_usuario = parseInt(document.getElementById("usuarios").value);
     fetch(`${URL}corte/importeventatotalUsuario/${formattedDate}/${Id_usuario}`)
     .then((response) => {
      return response.json();
    })
    .then((data) => {
      setImportePorUsuario(parseFloat(data[0].importe_total_venta)) ;
      if (!isNaN(importeXusuario)) {
        setImporte(importeXusuario);
      } else {
        console.error('Error: el valor de importe no es un número válido:', parseFloat(data[0].importe_total_venta));
        setImporte(0);
      }
    })
    .catch((error) => {
      console.error('Error al obtener los datos de importe:', error);
      setImporte(0);
    });
  }

  const fetchVentaxcliente = () => {
    const formattedDate = formatDate(fechaSeleccionada);
    fetch(`${URL}corte/ventaxcliente?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
      .then((response) => response.json())
      .then((data) => {
        setVentaXcliente(data);
      })
      .catch((error) => console.error('Error al obtener los datos de venta por cliente:', error));
  };


 const verVentaEliminada = () =>{
  const formattedDate = formatDate(fechaSeleccionada);
  fetch(`${URL}ventas/verVentasEliminidas?formattedDate=${formattedDate}`)
  .then((response) => response.json())
  .then((data) => {
    setVentasElimindas(data);
  })
  .catch((error) => console.error('Error al obtener los datos de venta por cliente:', error));
 }


  const fetchGananciaxdep = () => {
    const formattedDate = formatDate(fechaSeleccionada);
     fetch(`${URL}corte/vergananciaxdep?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
     .then((response) => response.json())
      .then((data) => {
       setGanancia2(data);
      })
      .catch((error) => console.error('Error al obtener los datos de ganancia2:', error));
  }

  const fetchEntradaEfect = () => {
    const formattedDate = formatDate(fechaSeleccionada);
     fetch(`${URL}corte/veringresoefectivo?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
     .then((response) => response.json())
      .then((data) => {
       setTablaIngreso(data);
      })
      .catch((error) => console.error('Error al obtener los datos de ingresoEfect:', error));
  }

  const fetchSalidaEfect = () => {
    const formattedDate = formatDate(fechaSeleccionada);
     fetch(`${URL}corte/veregresoefectivo?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
     .then((response) => response.json())
      .then((data) => {
       setTablaEgreso(data);
      })
      .catch((error) => console.error('Error al obtener los datos de salidaEfect:', error));
  }

  const traerventaxpaquete = () => {
    const formattedDate = formatDate(fechaSeleccionada)
    axios.get(`${URL}corte/ventatotalxPaquetes?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
    .then((response)=>{   
      setVentaXPaquete(response.data[0].monto_total_ventas_paquetes)
      console.log('Monto de paquetes: ', ventaxpaquete)
    }).catch((error) =>{
      console.error("Error al traer venta x paquetes", error)
    })  
 }


 const traerventaxpaqueteXusuarios = () => {
  const formattedDate = formatDate(fechaSeleccionada)
  axios.get(`${URL}corte/ventatotalxPaquetesXUsuarios?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}&Id_usuario=${Id_usuario}`)
  .then((response)=>{   
    setVentaPaqueteXusuarios(response.data[0].monto_total_ventas_paquetes)
    console.log('Monto de paquetes: ', ventaxpaquete)
  }).catch((error) =>{
    console.error("Error al traer venta x paquetes", error)
  })  
}


const traergananciapaqueteXusuarios = () => {
  const formattedDate = formatDate(fechaSeleccionada)
  axios.get(`${URL}corte/verGananciaPaquetesXUsuario?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}&Id_usuario=${Id_usuario}`)
  .then((response)=>{
    setGanaciaPaqueteXUsuarios(response.data[0].ganancia_total_paquetes)
  }).catch((error)=>{
    console.error('Error al traer el costo de paquete', error)
  })
 }

 const traergananciapaquete = () => {
  const formattedDate = formatDate(fechaSeleccionada)
  axios.get(`${URL}corte/verGananciaPaquetes?formattedDate=${formattedDate}&id_sucursal=${id_sucursal}`)
  .then((response)=>{
    setCostoPaquete(response.data[0].ganancia_total_paquetes)
  }).catch((error)=>{
    console.error('Error al traer el costo de paquete', error)
  })
 }

 const verProductosEliminados = () => {
  const formattedDate = formatDate(fechaSeleccionada)
  axios.get(`${URL}corte/verProductosEliminados/${formattedDate}`).then(response => {
    setProductosEliminados(response.data)
    console.log(response.data)
  }).catch(error => {
    console.error("Error al obtener los productos eliminados", error)
  })
}
  

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);



  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };


  const handleClickCorteDia = () => {
    setCorteIniciado(false)
    setCorteSeleccionado(true)
    traerventaxpaquete()
    setMostrarVentaUsuario(false)
    fetchVentaTotal();
    fetchVentaTotalxCategoria();
    fetchVerGanancia();
    fetchVerImporte();
    fetchVentaxcliente();
    fetchGananciaxdep();
    setNombreEmpleado("")
    setEgresoEfectivo([])
    setIngresoEfectivo([])
    traergananciapaquete()
    setMostrarVentasPaqueteUsuarios(false)
    setPagoCredito(true)
    fetchSalidaEfect()
    verPagosCreditos()
    fetchEntradaEfect()
    verProductosEliminados()
  };

  const verlasCajas = () =>{
    axios.get(`${URL}caja/${id_sucursal}`).then((response)=>{
        setCaja(response.data)
    })
}
useEffect(()=>{
  verlasCajas()
},[])


  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000); 
  
    return () => clearInterval(intervalID);
  }, []);


  const fetchVentaTotalUsuario = () => {
    const idUsuario = document.getElementById("usuarios").value;
    const selectUsuarios = document.getElementById("usuarios");
    setIdUsuario(idUsuario)
    const nombreUsuario = selectUsuarios.options[selectUsuarios.selectedIndex].text;
    setNombreEmpleado(nombreUsuario);
  }

 useEffect(() => {
    if (IdUsuario) {
      const formattedDate = formatDate(fechaSeleccionada);
      fetch(`${URL}corte/ventatotal/${formattedDate}/${id_sucursal}/${IdUsuario}/${idCaja}/`)
        .then((response) => response.json())
        .then((data) => setVentas(data))
        .then(() => setFechaCierre(time))
        .then(() =>{
          setVentaXcategoria([])
          setVentaXcliente([])
          setGanancia([])
          setGanancia2([])
        })
        .catch((error) => console.error('Error al obtener los datos del corte del día:', error));
    }
  }, [IdUsuario,fechaSeleccionada,idCaja]); 

  
  const verFechaHoraIngreso = () => {
    const formattedDate = formatDate(fechaSeleccionada);
    axios.get(`${URL}plataLogin/${IdUsuario}/${idCaja}/${formattedDate}`)
      .then((response) => {
        const fechaRegistro = response.data[response.data.length - 1].FechaRegistro; 
        const fechaLogin = new Date(fechaRegistro); 
        setFechaLogin(fechaLogin);
        console.log('fechaLogin',fechaLogin)
      })
      .catch((error) => {
        console.log('Error en solicitud de fecha de login:', error);
      });
  }


  
  const verIngresoEfectivoUsuario = () =>{
    const idUsuario = document.getElementById("usuarios").value;
    const formattedDate = formatDate(fechaSeleccionada);
    axios.get(`${URL}corte/veringresoefectivo/${idUsuario}/${formattedDate}/${idCaja}`)
    .then((response) => {
      setIngresoEfectivo(response.data);
     })
     .catch((error) => {
      console.error('Error al obtener ingresos:', error)
      console.error('Error al obtener ingresos data:',ingresoEfectivo)

     });
  }
    
  const verSalidaEfectivoUsuario = () =>{
    const idUsuario = document.getElementById("usuarios").value;
    const formattedDate = formatDate(fechaSeleccionada);
    axios.get(`${URL}corte/veregresoefectivo/${idUsuario}/${formattedDate}/${idCaja}`)
     .then((response) => {
       setEgresoEfectivo(response.data);
     })
     .catch((error) => {
      console.error('Error al obtener los datos de egreso:', error)
      console.error('Error al obtener los datos de egreso data:', egresoEfectivo)
     });
  }

   


     const validarCodigo = () =>{
      if(codigoMov === '1812'){
        handleClickCorteDia()
        handleCloseModal9()
      }else(     
        setCodigoMov(""),
        alert('Codigo Incorrecto') 
      )
    }

  const handleClickCorteCajero = () => { 
    const idUsuario = parseInt(document.getElementById("usuarios").value);
    const cajita = parseInt(document.getElementById("caja").value)
     if(cajita === 0 || idUsuario === 0) {
      alert ('Debe seleccionar un empleado y una caja')
    }else{
      setCorteIniciado(true)
      setCorteSeleccionado(false)
      fetchVentaTotalUsuario()
      setVentaXcategoria([])
      setVentaXcliente([])
      verIngresoEfectivoUsuario()
      verSalidaEfectivoUsuario()
      setGanancia([])
      setGanancia2([])
      setTablaEgreso([])
      setTablaIngreso([])
      setTablaEgresoUsuario(true)
      setTablaIngresoUsuario(true)
      setMostrarVentaUsuario(true)
      fetchVerImporteXUsuario()
      fetchVentaTotalxCategoriaUsuarios()
      setMostrarVentasPorCategoriasUsuarios(true)
      setMostrarFondoCaja(!mostrarFondoCaja)
      setMostrarVentasPaqueteUsuarios(!mostrarVentasPaqueteUsuario)
      setTablaIngresoEgreso(false)
      setTabalasEscuendidas(false)
      fetchVerGananciaXUsuario(idUsuario)
      traerventaxpaqueteXusuarios()
      traergananciapaqueteXusuarios()
      verFechaHoraIngreso()
    }
    
  };

  useEffect(()=>{
    const formattedDate = formatDate(fechaSeleccionada)
    axios.get(`${URL}corte/plataloginconusuario/${formattedDate}/${Id_usuario}`)
    .then((response) =>{
      setFondoCaja(response.data)
      setFondoCajaImporte(response.data[0].cantidadPlataLogin)
    })
    .catch((error) =>{
      console.log('error al obtener fondoCaja', error)
    })
},[fechaSeleccionada,Id_usuario]);


  const [pagosCreditos,setPagosCreditos]= useState([])

  const verPagosCreditos = () =>{
    const formattedDate = formatDate(fechaSeleccionada)
    axios.get(`${URL}corte/verPagosCreditos/${formattedDate}`).then((response)=>{
      setPagosCreditos(response.data)
    }).catch((error)=>{
      console.log('Error al obtener los pagos de creditos',error)
    })
  }



  const generarPDF = () => {
    const doc = new jsPDF();
    const fecha = formatDate(fechaSeleccionada);
  
    // 👉 Logo
    try {
      doc.addImage(logomarket, "PNG", 10, 10, 25, 10);
    } catch (error) {
      console.warn("No se pudo cargar el logo:", error);
    }
  
    // 👉 Título
    doc.setFontSize(18);
    doc.text(`CORTE DEL DÍA - ${fecha}`, 40, 20);
  
    let y = 30;
    doc.setFontSize(14);
  
    // 🧾 Labels resumen
    doc.text(`VENTAS PRODUCTOS: ${formatCurrency(importe)}`, 14, y);
    y += 8;
    doc.text(`GANANCIA PRODUCTOS: ${formatCurrency(ganancia)}`, 14, y);
    y += 8;
    doc.text(`GANANCIA PAQUETES: ${formatCurrency(costopaquete)}`, 14, y);
    y += 10;
  
    // 🧾 Tabla: Ventas Totales
    doc.text("Ventas Totales:", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Tipo de Pago', 'Total']],
      body: ventas.map(v => [v.tipo_metodo_pago, formatCurrency(v.monto_total)])
    });
    y = doc.lastAutoTable.finalY + 10;
  
    // 🏬 Ventas por Departamento
    doc.text("Ventas por Departamento:", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Departamento', 'Monto']],
      body: ventaxcategoria.map(v => [v.descripcion_categoria, formatCurrency(v.monto_total_ventas_categoria)])
    });
    y = doc.lastAutoTable.finalY + 10;
  
    // 📊 Ganancia por Departamento
    doc.text("Ganancia por Departamento:", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Departamento', 'Ganancia']],
      body: ganancia2.map(v => [v.nombre_categoria, formatCurrency(v.ganancia_por_categoria)])
    });
    y = doc.lastAutoTable.finalY + 10;
  
    // 👥 Clientes con más ventas
    doc.text("Clientes con más ventas:", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Cliente', 'Monto']],
      body: ventaxcliente.map(v => [v.nombre_cliente, formatCurrency(v.monto_total_venta)])
    });
    y = doc.lastAutoTable.finalY + 10;
  
    // 📥 Entrada efectivo
    doc.text("Entradas de Efectivo:", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Descripción', 'Monto']],
      body: tablaIngreso.map(v => [v.DescripcionIngreso, formatCurrency(v.montoTotalIngreso)])
    });
    y = doc.lastAutoTable.finalY + 10;
  
    // 📤 Salida efectivo
    doc.text("Salidas de Efectivo:", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Descripción', 'Monto']],
      body: tablaEgreso.map(v => [v.DescripcionEgreso, formatCurrency(v.montoTotalEgreso)])
    });
    y = doc.lastAutoTable.finalY + 10;
  
    // 💳 Pagos de Crédito
    if (pagosCreditos.length > 0) {
      doc.text("Pagos de Créditos:", 14, y);
      autoTable(doc, {
        startY: y + 4,
        head: [['Cliente', 'Método Pago', 'Monto', 'Fecha']],
        body: pagosCreditos.map(p => [
          p.nombre_cliente,
          p.tipo_metodoPago,
          formatCurrency(p.monto),
          new Date(p.fechaRegsitro).toLocaleString()
        ])
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  
    if (productoseliminados.length > 0) {
      doc.text("Productos Eliminados:", 14, y);
      autoTable(doc, {
        startY: y + 4,
        head: [['N° Venta', 'Producto', 'Precio', 'Motivo', 'Usuario']],
        body: productoseliminados.map(p => [
          p.Id_venta,
          p.nombre_producto,
          formatCurrency(p.precioVentaProducto),
          p.Motivo,
          p.nombre_usuario
        ])
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  
    doc.save(`corte-${fecha}.pdf`);
  };
  
  




return (
<>
<App />

{/* HEADER */}
<div className="container-fluid py-4 px-4 bg-light border-bottom">
  <h1 className="fw-bold mb-1" style={{ color: "#01992f" }}>
    Corte de Negocio
  </h1>
  <span className="text-muted">
    Visualiza todos los movimientos realizados en tu negocio
  </span>

  {corteSeleccionado && (
    <div className="mt-2 text-muted">
      Fecha seleccionada: <strong>{formatDate(fechaSeleccionada)}</strong>
    </div>
  )}

  {corteIniciado && (
    <div className="text-muted">
      Corte iniciado: <strong>{new Date(fechaLogin).toLocaleString()}</strong>
    </div>
  )}
</div>


{/* FILTROS */}
<div className="container my-4">
  <div className="card shadow-sm border-0 rounded-4">
    <div className="card-body p-4">
      <div className="row g-4">

        <div className="col-md-3">
          <label className="form-label fw-semibold">Empleado</label>
          <Form.Select id="usuarios">
            <option disabled>Selecciona un empleado</option>
            {usuarios.map((usu) => (
              <option key={usu.Id_usuario} value={usu.Id_usuario}>
                {usu.nombre_usuario}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-semibold">Caja</label>
          <Form.Select
            id="caja"
            value={idCaja}
            onChange={(e)=>setIdCaja(e.target.value)}
          >
            <option disabled>Selecciona una caja</option>
            {caja.map((c) => (
              <option key={c.Id_caja} value={c.Id_caja}>
                Caja {c.Id_caja}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-semibold">Fecha</label>
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(date)=>setFechaSeleccionada(date)}
            className="form-control"
            dateFormat="yyyy/MM/d"
            locale={es}
            maxDate={lastDayOfMonth}
          />
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <Button variant="success" className="w-100" onClick={handleShowModal9}>
            Corte del Día
          </Button>
        </div>

      </div>

      <div className="d-flex gap-3 mt-4 flex-wrap">
        <Button variant="outline-success" onClick={handleClickCorteCajero}>
          Corte de Cajero
        </Button>
        <Button variant="dark" onClick={generarPDF}>
          Exportar PDF
        </Button>
      </div>
    </div>
  </div>
</div>


{/* KPIs */}
<div className="container mb-4">
  <div className="row g-4">

    <div className="col-md-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <small className="text-muted">
            {mostrarVentaUsuario ? "Ventas Totales del Empleado" : "Ventas Productos"}
          </small>
          <h4 className="fw-bold mt-2 text-success">
            {mostrarVentaUsuario
              ? formatCurrency(isNaN(importeXusuario) ? 0 : importeXusuario)
              : formatCurrency(isNaN(importe) ? 0 : importe)}
          </h4>
        </div>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <small className="text-muted">Ganancia</small>
          <h4 className="fw-bold mt-2 text-success">
            {formatCurrency(ganancia > 0 ? ganancia : gananciaUsuario)}
          </h4>
        </div>
      </div>
    </div>

    {mostrarFondoCaja && (
      <div className="col-md-3">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <small className="text-muted">Fondo de Caja</small>
            <h4 className="fw-bold mt-2 text-success">
              {formatCurrency(fondoCajaImporte)}
            </h4>
          </div>
        </div>
      </div>
    )}

    {mostrarVentasPaqueteUsuario && (
      <div className="col-md-3">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <small className="text-muted">Ganancia Paquetes Usuario</small>
            <h4 className="fw-bold mt-2 text-success">
              {formatCurrency(ganaciaPaqueteXusuarios)}
            </h4>
          </div>
        </div>
      </div>
    )}

    {!mostrarVentasPaqueteUsuario && (
      <div className="col-md-3">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <small className="text-muted">Ganancia Paquetes</small>
            <h4 className="fw-bold mt-2 text-success">
              {formatCurrency(costopaquete)}
            </h4>
          </div>
        </div>
      </div>
    )}

  </div>
</div>


{/* VENTAS POR TIPO */}
<div className="container mb-4">
  <div className="card shadow-sm border-0 rounded-4">
    <div className="card-body">
      <h5 className="fw-semibold mb-3">Ventas por Tipo</h5>
      <Table hover responsive>
        <thead className="table-light">
          <tr>
            <th>Tipo</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index)=>(
            <tr key={index}>
              <td>{venta.tipo}</td>
              <td>{formatCurrency(venta.monto_total)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </div>
</div>


{/* TODAS TUS DEMÁS TABLAS */}
{/* No elimino ninguna condición, solo las envuelvo en cards */}

{tablasEscuendidas && (
  <div className="container mb-4">
    <div className="row g-4">

      <div className="col-md-6">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Ventas por Departamento</h5>
            <Table hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Departamento</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {ventaxcategoria.map(v=>(
                  <tr key={v.descripcion_categoria}>
                    <td>{v.descripcion_categoria}</td>
                    <td>{formatCurrency(v.monto_total_ventas_categoria)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Ganancia por Departamento</h5>
            <Table hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Departamento</th>
                  <th>Ganancia</th>
                </tr>
              </thead>
              <tbody>
                {ganancia2.map(v=>(
                  <tr key={v.nombre_categoria}>
                    <td>{v.nombre_categoria}</td>
                    <td>{formatCurrency(v.ganancia_por_categoria)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

    </div>
  </div>
)}

{/* ACÁ MANTENÉS EXACTAMENTE IGUAL todas tus demás condiciones:
   tablaIngresoEgreso
   tablaIngresoUsuario
   ventaEliminada
   pagoCredito
   mostrarVentasPorCategoriasUsuarios
   etc
   Solo envolvelas en:
   <div className="container mb-4">
     <div className="card shadow-sm border-0 rounded-4">
       <div className="card-body">
         ...tu tabla original...
       </div>
     </div>
   </div>
*/}


{/* MODAL ORIGINAL */}
<Modal show={showModal9} onHide={handleCloseModal9} centered>
  <Modal.Header closeButton>
    <Modal.Title>Ingresos y Egresos</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <MDBInputGroup>
      <span className="input-group-text">
        <FontAwesomeIcon icon={faBarcode}/>
      </span>
      <input
        className="form-control"
        type="password"
        placeholder="Ingrese el código"
        value={codigoMov}
        onChange={(e)=>setCodigoMov(e.target.value)}
      />
    </MDBInputGroup>

    <Button variant="success" className="w-100 mt-3" onClick={validarCodigo}>
      Enviar
    </Button>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="outline-danger" onClick={handleCloseModal9}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

<ScrollToTopButton/>

</>
)
}

export default Corte2
