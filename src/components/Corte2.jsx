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
const Id_usuario = localStorage.getItem("idUsuario")
const id_sucursal = localStorage.getItem("sucursalId")
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
    const id_sucursal = localStorage.getItem("sucursalId");
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
    fetch(`${URL}corte/ventaxCategoriaUsuarios?formattedDate=${formattedDate}&Id_sucursal=${id_sucursal}&Id_usuario=${Id_usuario}&Id_caja=${idCaja}`)
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
          console.log('ventas',ventas)
          console.log('ventas',ventas)
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

  // const handleClickCorteCajeroAdmin = () => { 
  //   const idUsuario = parseInt(document.getElementById("usuarios").value);
  //   const cajita = parseInt(document.getElementById("caja").value)
  //    if(cajita === 0 || idUsuario === 0) {
  //     alert ('Debe seleccionar un empleado y una caja')
  //   }else{
  //     setCorteIniciado(true)
  //     setCorteSeleccionado(false)
  //     fetchVentaTotalUsuario()
  //     setVentaXcategoria([])
  //     setVentaXcliente([])
  //     verIngresoEfectivoUsuario()
  //     verSalidaEfectivoUsuario()
  //     setGanancia([])
  //     setGanancia2([])
  //     setTablaEgreso([])
  //     setTablaIngreso([])
  //     setTablaEgresoUsuario(true)
  //     setTablaIngresoUsuario(true)
  //     setMostrarVentaUsuario(true)
  //     fetchVerImporteXUsuario()
  //     setMostrarVentasPaqueteUsuarios(!mostrarVentasPaqueteUsuario)
  //     setMostrarFondoCaja(!mostrarFondoCaja)
  //     setTablaIngresoEgreso(false)
  //     setTabalasEscuendidas(false)
  //     fetchVerGananciaXUsuario(idUsuario)
  //     setVentaEliminada(true)
  //     verVentaEliminada()
  //     traerventaxpaquete()
  //     traergananciapaquete()
  //   }
  // };




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
  
    // ❌ Productos Eliminados
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

<div className='h3-ventas'>
    <h1 className='h3-corte'>CORTE</h1>
</div>
<br />
            <h2><strong>CORTE DE NEGOCIO</strong></h2>
            <h4>Visualiza todos los movientos realizados en tu negocio</h4> <br /> 
<div className='calendario'>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
    {corteSeleccionado && (
        <label className='lbl-corte'>Fecha: <strong>{formatDate(fechaSeleccionada)}</strong></label> 
        )}
        <br />

        {corteIniciado && (
  <label className='lbl-corte'>Corte iniciado de la fecha: <b>{new Date(fechaLogin).toLocaleString()}</b></label>
)}
     <Form.Select aria-label="Nombre Categoria" id= "usuarios" style={{width: '300px', margin: '0 auto'}} >
         <option value="0" disabled selected>---Selecciona un empleado---</option>
        {usuarios.map((usu) => (
             <option key={usu.Id_usuario} value={usu.Id_usuario}>{usu.nombre_usuario}</option>
        ))}
    </Form.Select>
    <br/>
     <Form.Select  aria-label="Nombre Categoria" id="caja" value={idCaja} onChange={(e)=>setIdCaja(e.target.value)} style={{width: '300px', margin: '0 auto'}}>
         <option value="0" disabled selected>---Selecciona una caja---</option>
        {caja.map((c) => (
            <option key={c.Id_caja} value={c.Id_caja}>{c.Id_caja}</option>
        ))}
    </Form.Select>

        <DatePicker
        selected={fechaSeleccionada}
        onChange={(date) => {
            setFechaSeleccionada(date)
        }}
        className='form-control custom-date-picker custom-datepicker-wrapper'
        dateFormat="yyyy/MM/d"
        locale={es}
        placeholderText='Ingrese una fecha'
        maxDate={lastDayOfMonth
        }
    />
        <div style={{ marginTop: '10px' }}>
            <Button className='btn-corte' onClick={handleShowModal9}><FontAwesomeIcon icon={faScissors}></FontAwesomeIcon> Corte del dia</Button>
            <Button className='btn-corte2'  onClick={handleClickCorteCajero}><FontAwesomeIcon icon={faScissors}></FontAwesomeIcon> Corte de cajero</Button>
            <Button className='btn-corte' onClick={generarPDF}><FontAwesomeIcon icon={faArrowUpFromBracket} /> Exportar PDF</Button>

        </div>
    </div>
</div>
<br />


   
<div className='container' style={{ marginLeft: '15px', marginBottom: '50px', marginTop: '50px', textAlign: 'left' }}>
    {nombreEmpleado && (
        <h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faUser} style={{ color: '#01992f', marginRight: '8px' }} />
            CORTE DE CAJERO DEL EMPLEADO: {nombreEmpleado}
        </h3>
    )}

    <br />
    {mostrarVentaUsuario ? (
        <h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faDollar} style={{ color: '#01992f', marginRight: '8px' }} />
            {isNaN(importeXusuario) ? (<>VENTAS TOTALES DEL EMPLEADO: $0,00</>) : (<>VENTAS TOTALES DEL EMPLEADO: {formatCurrency(importeXusuario)}</>)}
        </h3>
    ) : (
        <h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faDollar} style={{ color: '#01992f', marginRight: '8px' }} />
            {isNaN(importe) ? (<>VENTAS PRODUCTOS: $0,00</>) : (<>VENTAS PRODUCTOS: {formatCurrency(importe)}</>)}
        </h3>
    )}

    {ganancia > 0 ? (
        <h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faChartSimple} style={{ color: '#01992f', marginRight: '8px' }} />
            GANANCIA PRODUCTOS: {formatCurrency(ganancia)}
        </h3>
    ) : (
        <h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faChartSimple} style={{ color: '#01992f', marginRight: '8px' }} />
            GANANCIA PRODUCTOS: {formatCurrency(gananciaUsuario)}
        </h3>
    )}
    
    {mostrarFondoCaja && (
        <h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faCashRegister} style={{ color: '#01992f', marginRight: '8px' }} />
            FONDO DE CAJA: {formatCurrency(fondoCajaImporte)}
        </h3>
    )}

      {mostrarVentasPaqueteUsuario && (
        <>
        {/* <h3 className='h3-clientes'>
        <FontAwesomeIcon icon={faDollar} style={{ color: '#1D4FA0', marginRight: '8px' }} />
        VENTA DE PAQUETES X USUARIO: {formatCurrency(ventaxpaqueteXusuarios)}
        </h3> */}

        <h3 className='h3-clientes'>
        <FontAwesomeIcon icon={faDollar} style={{ color: '#01992f', marginRight: '8px' }} />
        GANANCIA PAQUETES X USUARIO: {formatCurrency(ganaciaPaqueteXusuarios)}
        </h3>
        </>
        ) }

{mostrarVentasPaqueteUsuario === false ?

<>
  {/* <h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faDollar} style={{ color: '#1D4FA0', marginRight: '8px' }} />
            VENTA DE PAQUETES: {formatCurrency(ventaxpaquete)}
</h3> */}

<h3 className='h3-clientes'>
            <FontAwesomeIcon icon={faDollar} style={{ color: '#01992f', marginRight: '8px' }} />
           GANANCIA PAQUETES: {formatCurrency(costopaquete)}
</h3>
</>:
<></>
}        




</div>
     
     
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            <h3 className='h3-clientes'><FontAwesomeIcon icon={faSackDollar} style={{color: "#01992f"}} ></FontAwesomeIcon> VENTAS: </h3>
            <div className="container table">
                <Table striped bordered hover className='table-primary'>
                    <thead className='custom-table-header'>
                        <tr>
                            <th>TIPO</th>
                            <th>TOTAL</th>
                        </tr> 
                    </thead>
                    <tbody>
                        {ventas.map(venta => (
                            <tr key={venta.tipo_metodoPago}>
                                <td>{venta.tipo_metodo_pago}</td>
                                <td>{formatCurrency(venta.monto_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            </div>
            {tablasEscuendidas && (
              <>
  <div className='col'>
    
    <h3 className='h3-clientes'>
      <FontAwesomeIcon icon={faTags} style={{ color: "#01992f" }} /> VENTAS POR DEPARTAMENTOS:</h3>
    <div className="container table">
      <Table striped bordered hover className='table-primary'>
        <thead className='custom-table-header'>
          <tr>
            <th>DESCRIPCION</th>
            <th>MONTO</th>
          </tr>
        </thead>
        <tbody>
          {ventaxcategoria.map(venta => (
            <tr key={venta.descripcion_categoria}>
              <td>{venta.descripcion_categoria}</td>
              <td>{formatCurrency(venta.monto_total_ventas_categoria)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </div>
  
  <hr />


  <div className='row'>
    <div className='col'>

      <h3 className='h3-clientes'>
        <FontAwesomeIcon icon={faChartSimple} style={{ color: "#01992f" }} /> GANANCIA POR DEPARTAMENTO:</h3>
      <div className="container table">
        <Table striped bordered hover className='table-primary'>
          <thead className='custom-table-header'>
            <tr>
              <th>DEPARTAMENTO</th>
              <th>GANANCIA</th>
            </tr>
          </thead>
          <tbody>
            {ganancia2.map(venta => (
              <tr key={venta.nombre_categoria}>
                <td>{venta.nombre_categoria}</td>
                <td>{formatCurrency(venta.ganancia_por_categoria)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>

    <div className='col'>
      <h3 className='h3-clientes'>
        <FontAwesomeIcon icon={faUsers} style={{ color: "#01992f" }} /> CLIENTES CON MAS VENTAS:</h3>
      <div className="container table">
        <Table striped bordered hover className='table-primary'>
          <thead className='custom-table-header'>
            <tr>
              <th>NOMBRES CLIENTES</th>
              <th>MONTO</th>
            </tr>
          </thead>
          <tbody>
            {ventaxcliente.map(venta => (
              <tr key={venta.nombre_cliente}>
                <td>{venta.nombre_cliente}</td>
                <td>{formatCurrency(venta.monto_total_venta)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  </div>
  </>
)}

</div>



{mostrarVentasPorCategoriasUsuarios === true ?  


<div className='col'>
<hr />  

    <h3 className='h3-clientes'>
      <FontAwesomeIcon icon={faTags} style={{ color: "#01992f" }} /> VENTAS POR DEPARTAMENTOS:</h3>
    <div className="container table">
      <Table striped bordered hover className='table-primary'>
        <thead className='custom-table-header'>
          <tr>
            <th>DESCRIPCION</th>
            <th>MONTO</th>
          </tr>
        </thead>
        <tbody>
          {VentasPorcategoriasUsuarios.map(venta => (
            <tr key={venta.descripcion_categoria}>
              <td>{venta.descripcion_categoria}</td>
              <td>{formatCurrency(venta.monto_total_ventas_categoria)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </div>
: <></>

}
  
        {tablaIngresoEgreso && (

        <div className='row'>
        <hr />    
          <div className='col'>
          <h3 className='h3-clientes'><FontAwesomeIcon icon={faArrowUpFromBracket} rotation={180}  style={{color: "#01992f",}}></FontAwesomeIcon> ENTRADA DE EFECTIVO DEL DIA:</h3>
            <div className="container table">
                <Table striped bordered hover className='table-primary'>
                    <thead className='custom-table-header'>
                        <tr>
                            <th>DESCRIPCION</th>
                            <th>MONTO</th>
                       
                        </tr>
                    </thead>
                    <tbody>
                  {tablaIngreso.map(venta => (
                        <tr key={venta.DescripcionIngreso}>
                            <td>{venta.DescripcionIngreso}</td>
                            <td>{formatCurrency(venta.montoTotalIngreso)}</td>
                            
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>   
          </div>
         
         
                 

          <div className='col'> 
          <h3 className='h3-clientes'><FontAwesomeIcon icon={faArrowUpFromBracket}  style={{color: "#01992f"}}></FontAwesomeIcon> SALIDA DE EFECTIVO DEL DIA:</h3>
            <div className="container table">
                <Table striped bordered hover className='table-primary'>
                    <thead className='custom-table-header'> 
                        <tr>
                            <th>DESCRIPCION</th>
                            <th>MONTO</th>    
                        </tr>
                    </thead>
                    <tbody>
                {tablaEgreso.map(venta => (
                        <tr key={venta.motivo}>
                            <td>{venta.DescripcionEgreso}</td>
                            <td>{formatCurrency(venta.montoTotalEgreso)}</td>
                        </tr>
                    ))}
            </tbody>
                </Table>
            </div>  
          </div>
        </div>  
        )}
      </div>     


      {tablaIngresoUsuario && (     
          <div className='row'>
            <div className='col'>
            <h3 className='h3-clientes'><FontAwesomeIcon icon={faArrowUpFromBracket} style={{color: "#01992f"}} rotation={180}></FontAwesomeIcon> ENTRADA DE EFECTIVO DE USUARIO: {nombreEmpleado}</h3>
            <div className="container table">
                <Table striped bordered hover className='table-primary'>
                    <thead className='custom-table-header'>
                        <tr>
                            <th>DESCRIPCION</th>
                            <th>MONTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingresoEfectivo.map(venta => (
                         <tr key={venta.DescripcionIngreso}>
                            <td>{venta.DescripcionIngreso}</td>
                            <td>{formatCurrency(venta.montoTotalIngreso)}</td>
                         </tr>
                        ))}
                    </tbody>
                </Table>  
          </div>
            </div>

           <div className='col'>
            <h3 className='h3-clientes'><FontAwesomeIcon style={{color: "#01992f"}} icon={faArrowUpFromBracket}></FontAwesomeIcon> SALIDA DE EFECTIVO DE USUARIO: {nombreEmpleado}</h3>
            <div className="container table">
            <Table striped bordered hover className='table-primary'>
                  <thead className='custom-table-header'>
                      <tr>
                          <th>DESCRIPCION</th>
                          <th>MONTO</th>
                      </tr>
                  </thead>
                  <tbody>
                  {egresoEfectivo.map(venta => {
                      return (
                          <tr key={venta.IdEgreso}>
                              <td>{venta.DescripcionEgreso}</td>
                              <td>{formatCurrency(venta.montoTotalEgreso)}</td>
                          </tr>
                      );
                  })}
                  </tbody>
              </Table>
            </div>  
            </div>
        </div>
)}
<div>


{ventaEliminada ? 
<>
  <h3 className='h3-clientes'><FontAwesomeIcon style={{color: "#01992f"}} icon={faArrowUpFromBracket}></FontAwesomeIcon> VENTAS ELIMINADAS</h3>
 <div className="container table">
                <Table striped bordered hover className='table-primary'>
                    <thead className='custom-table-header'>
                        <tr>
                            <th>MONTO TOTAL</th>
                            <th>NUMERO VENTA</th>
                            <th>FECHA VENTA</th>
                            <th>USUARIO</th>
                            <th>PRODUCTO</th>
                        </tr>
                    </thead>
                    <tbody>
  {ventasEliminadas.map(venta => (
    <tr key={venta.IdVentaEliminada}>
      <td>${venta.MontoTotal}</td>
      <td>{venta.NumeroVenta}</td>
      <td>{new Date(venta.FechaVenta).toLocaleString()}</td>
      <td>{venta.Empleado}</td>
      <td>
        {venta.productos && venta.productos.length > 0 && venta.productos.map((producto, index) => (
          <li key={index} >
            {producto.Producto} (Cantidad: {producto.cantidad})
          </li>
        ))}
      </td>
    </tr>
  ))}
</tbody>
                </Table>
</div>  


</>
  : 
  <></>
  }




  
{pagoCredito ? 
<>
<hr />
  <h3 className='h3-clientes'><FontAwesomeIcon style={{color: "#01992f"}} icon={faArrowUpFromBracket}></FontAwesomeIcon> PAGOS CREDITOS</h3>
 <div className="container table">
                <Table striped bordered hover className='table-primary'>
                    <thead className='custom-table-header'>
                        <tr>
                            <th>CLIENTE</th>
                            <th>METODO PAGO</th>
                            <th>MONTO</th>
                            <th>FECHA</th>
                        </tr>
                    </thead>
                    <tbody>
                     {pagosCreditos.map((p,index)=>(
                      <tr key={index}>
                        <td>{p.nombre_cliente}</td>
                        <td>{p.tipo_metodoPago}</td>
                        <td>{formatCurrency(p.monto)}</td>
                        <td>{new Date(p.fechaRegsitro).toLocaleString()}</td>
                      </tr>
                     ))}
                    </tbody>
                </Table>
</div>  


</>
  : 
  <></>
  }
  

</div>

<hr />
<h3 className='h3-clientes'>
      <FontAwesomeIcon icon={faTags} style={{ color: "#01992f" }} /> PRODUCTOS ELIMINADOS:</h3>
    <div className="container table">
      <Table striped bordered hover className='table-primary'>
        <thead className='custom-table-header'>
          <tr>
            <th>N° VENTA</th>
            <th>PRODUCTO</th>
            <th>PRECIO</th>
            <th>MOTIVO</th>
            <th>USUARIO</th>
          </tr>
        </thead>
        <tbody>
          {productoseliminados.map(venta => (
            <tr key={venta.Id_venta}>
              <td>{venta.Id_venta}</td>
              <td>{venta.nombre_producto}</td>
              <td>{formatCurrency(venta.precioVentaProducto)}</td>
              <td>{venta.Motivo}</td>
              <td>{venta.nombre_usuario}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

<Modal show={showModal9} onHide={handleCloseModal9}>
            <Modal.Header closeButton>
              <Modal.Title>INGRESOS Y EGRESOS </Modal.Title>
            </Modal.Header>   
            <Modal.Body >    
              <MDBInputGroup>
              <span className="input-group-text">
                    <FontAwesomeIcon icon={faBarcode} size="lg" style={{color: "#01992f"}} />
              </span>
              <input className="form-control" type="password" placeholder="Ingrese el codigo" value={codigoMov} onChange={(e) => setCodigoMov(e.target.value)} />  
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

</>
  )
}

export default Corte2

