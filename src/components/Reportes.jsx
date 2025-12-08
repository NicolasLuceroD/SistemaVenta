import { useContext, useEffect, useState } from "react";
import App from "../App";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import { DataContext } from '../context/DataContext';
import DataReportes from './DataReportes'

export default function Reportes() {

  //ARRAYS
  const [ventaxdepto, setVentaxDepto] = useState([]);
  const [ventaXmetodoPago, setVentaxMetodoPago] = useState([]);
  const [ventatotalxcategoria, setVentaTotalXcategoria] = useState([]);
  const [ventaxcliente, setVentaXcliente] = useState([]);
  const [ventaxempleado, setVentaXempleado] = useState([]);
  const [ventastotales, setVentasTotales] = useState([])
  const [numeroventas, setNumeroVentas] = useState([])
  const [ganancias, setGanancias] = useState([])
  const [gananciasXPaquetes, setGananciasXPaquetes] = useState([])
  const [ventaspromedio, setVentasPromedio] = useState([])
  const [utilidadpromedio, setUtilidadPromedio] = useState([])
  const [egresos,setEgresos] = useState([])

  //FECHAS
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
 
  //URL
  const {  URL } = useContext(DataContext);

  //FN PARA ULTIMO DIA DEL MES
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  //ID DE SUCURSAL POR LOCALSTORAGE
  const idSucursal = parseInt(localStorage.getItem("sucursalId"), 10);


  //FUNCION PARA TREAER EL NUMERO DE VENTAS TOTALES POR DEPARTAMENTO
  const verVentasxDepartamento = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ventaxdepartamento`, {
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal 
        }
      }).then((response)=>{
        setVentaxDepto(response.data)
        console.log('Ventas por depto: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer las ventas por depto', error)
      })
    }
  }


  const verMontoMetodoPago = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ventaxmetodopago`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal 
        }
      }).then((response)=> {
        setVentaxMetodoPago(response.data)
        console.log('Montos de venta con metodo de pago: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer montos por metodo de pago', error)
      })
    }
  }

  const verMontoDepartamento = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ventamontoxdepto`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setVentaTotalXcategoria(response.data)
        console.log('Monto de ventas totales por depto: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer los montos por depto', error)
      })
    }
  }


  const verVentaCliente = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ventaclientes`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        const verificodato = response.data.map(item => ({
          ...item,
          monto_total_venta:  Number(item.monto_total_venta),
        }))
        setVentaXcliente(verificodato)
        console.log("Ventas a clientes: ", response.data)
      }).catch((error)=> {
        console.error('Error al traer los clientes con venta', error)
      })
    }
  }


  const verVentaEmpleados = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ventaempleados`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setVentaXempleado(response.data)
        console.log('Ventas por empleados: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer las ventas por empleados', error)
      })
    }
  }

  const verVentasTotales = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ventatotal`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setVentasTotales(response.data)
        console.log('Ventas totales monto: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer ventas totales', error)
      })
    }
  }

  const verNumeroVentas = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/numeroventas`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setNumeroVentas(response.data)
        console.log('Ventas totales numericas: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer ventas totales numericas', error)
      })
    }
  }

  const verGanancias = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ganancias`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setGanancias(response.data)
        console.log('Ganancias: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer ganancias', error)
      })
    }
  }
  const verGananciasXPaquete = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/gananciasventasXPaquete`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setGananciasXPaquetes(response.data)
      }).catch((error)=> {
        console.error('Error al traer ganancias', error)
      })
    }
  }

  const verUtilidadPromedio = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/utilidadpromedio`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setUtilidadPromedio(response.data)
        console.log('Margen de utilidad promedio: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer utilidad promedio', error)
      })
    }
  }

  const verPromedioVentas = () => {
    if (fechaInicio && fechaFin) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      axios.get(`${URL}reportes/ventaspromedio`,{
        params: {
          fechaInicio : inicio,
          fechaFin: fin,
          id_sucursal: idSucursal
        }
      }).then((response)=> {
        setVentasPromedio(response.data)
        console.log('Promedio de ventas: ', response.data)
      }).catch((error)=> {
        console.error('Error al traer promedio de ventas', error)
      })
    }
  }

  

  const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};
  
            
            
useEffect(() =>{
 verVentasxDepartamento()
 verMontoMetodoPago()
 verMontoDepartamento()
 verVentaCliente()
 verVentaEmpleados()
 verVentasTotales()
 verNumeroVentas()
 verGanancias()
 verPromedioVentas()
 verUtilidadPromedio()

 verGananciasXPaquete()
},[fechaInicio,fechaFin]) 
  
  
const Colors = [
  "#00FF4C", // verde neón
  "#006408ff", // verde hover
  "#73a177ff", // gris oscuro
  "#3c463cff", // gris profundo
  "#292e2aff", // negro absoluto
];
  return (
    <>
    <App />
    <div className="h3-ventas">
      <h1>REPORTES</h1>
    </div>
  
    <h2 style={{ marginTop: '20px' }}><strong>ADMINISTRACION DE REPORTES</strong></h2><br />
    <h4>Comience a buscar resultados ingresando una fecha de inicio y una de fin en el calendario.</h4>
  
    {/* CALENDARIOS */}
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <DatePicker
          selected={fechaInicio}
          onChange={(date) => setFechaInicio(date)}
          className='form-control custom-date-picker custom-datepicker-wrapper'
          dateFormat="yyyy/MM/d"
          placeholderText='Ingrese una fecha inicio'
          locale={es}
          maxDate={lastDayOfMonth}
          style={{ flex: '1 1 45%', minWidth: '200px' }} // Ajuste para responsive
      />
      <DatePicker
          selected={fechaFin}
          onChange={(date) => setFechaFin(date)}
          className='form-control custom-date-picker custom-datepicker-wrapper'
          dateFormat="yyyy/MM/d"
          placeholderText='Ingrese una fecha fin'
          locale={es}
          maxDate={lastDayOfMonth}
          style={{ flex: '1 1 45%', minWidth: '200px' }} // Ajuste para responsive
      />
    </div>
    <br /><br /><br /><br />

    <div style={{ display: 'flex' }}>
  <div style={{ flex: 1, marginRight: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h5 style={{ margin: '0', marginLeft: '100px' }}>VENTAS TOTALES:</h5>
      {ventastotales.length > 0 ? (
        <span style={{ marginLeft: '10px' }}>
          {ventastotales.map((venta, index) => (
            <strong key={index}>{formatCurrency(venta.total_ventas)}</strong>
          ))}
        </span>
      ) : (
        <p style={{ color: 'red', marginLeft: '10px' }}>Comience a buscar para ver resultados.</p>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h5 style={{ margin: '0', marginLeft: '100px' }}>NUMERO DE VENTAS:</h5>
      {numeroventas.length > 0 ? (
        <span style={{ marginLeft: '10px' }}>
          {numeroventas.map((venta, index) => (
            <strong key={index}>{venta.total_ventas} </strong>
          ))}
        </span>
      ) : (
        <p style={{ color: 'red', marginLeft: '10px' }}>Comience a buscar para ver resultados.</p>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h5 style={{ margin: '0', marginLeft: '100px' }}>VENTAS PROMEDIO:</h5>
      {ventaspromedio.length > 0 ? (
        <span style={{ marginLeft: '10px' }}>
          {ventaspromedio.map((ventas, index) => (
            <strong key={index}>{formatCurrency(ventas.promedio_ventas)} </strong>
          ))}
        </span>
      ) : (
        <p style={{ color: 'red', marginLeft: '10px' }}>Comience a buscar para ver resultados.</p>
      )}
    </div>
  </div>

  <div style={{ flex: 1 }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h5 style={{ margin: '0', marginLeft: '70px' }}>GANANCIA X PRODUCTOS:</h5>
      {ganancias.length > 0 ? (
        <span style={{ marginLeft: '10px' }}>
          {ganancias.map((ganancia, index) => (
            <strong key={index}>{formatCurrency(ganancia.total_ganancia)} </strong>
          ))}
        </span>
      ) : (
        <p style={{ color: 'red', marginLeft: '10px' }}>Comience a buscar para ver resultados.</p>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h5 style={{ margin: '0', marginLeft: '70px' }}>GANANCIA  X PAQUETES:</h5>
      {gananciasXPaquetes.length > 0 ? (
        <span style={{ marginLeft: '10px' }}>
          {gananciasXPaquetes.map((ganancia, index) => (
            <strong key={index}>{formatCurrency(ganancia.gananciaPaquetes)} </strong>
          ))}
        </span>
      ) : (
        <p style={{ color: 'red', marginLeft: '10px' }}>Comience a buscar para ver resultados.</p>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h5 style={{ margin: '0', marginLeft: '70px' }}>MARGEN DE UTILIDAD PROMEDIO:</h5>
      {utilidadpromedio.length > 0 ? (
        <span style={{ marginLeft: '10px' }}>
          {utilidadpromedio.map((promedio, index) => (
            <strong key={index}>%{promedio.margen_utilidad_promedio} </strong>
          ))}
        </span>
      ) : (
        <p style={{ color: 'red', marginLeft: '10px' }}>Comience a buscar para ver resultados.</p>
      )}
    </div>
  </div>
</div>

<br /><br /><br />
    {/* GRÁFICOS EN DOS COLUMNAS */}
    <div className="row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', margin: '10px' }}>
      {/* PRIMER GRAFICO */}
      <div className="col" style={{ flex: '1 1 45%', marginTop: '20px', minWidth: '300px' }}>
          <h5 className="titulosreportes">NUMERO DE VENTAS TOTALES POR DEPARTAMENTO</h5>
          <div>
              {ventaxdepto.length === 0 ? (
                  <DataReportes />
              ) : (
                  <ResponsiveContainer width="100%" height={500}>
                      <PieChart>
                          <Pie
                              dataKey="total_ventas_categoria"
                              nameKey="nombre_categoria"
                              data={ventaxdepto}
                              innerRadius={120}
                              outerRadius={200}
                              fill="#82ca9d"
                              label={(entry) => `${entry.nombre_categoria}: ${entry.total_ventas_categoria}`}
                          >
                              {ventaxdepto.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
                              ))}
                          </Pie>
                      </PieChart>
                  </ResponsiveContainer>
              )}
          </div>
      </div>
  
      {/* SEGUNDO GRAFICO */}
      <div className="col" style={{ flex: '1 1 45%', marginTop: '20px', minWidth: '300px' }}>
          <h5 className="titulosreportes">MONTO DE VENTAS TOTALES POR METODO DE PAGO ($)</h5>
          <div>
              {ventaXmetodoPago.length === 0 ? (
                  <DataReportes />
              ) : (
                  <ResponsiveContainer width="100%" height={500}>
                      <BarChart data={ventaXmetodoPago}>
                          <CartesianGrid strokeDasharray="8 8" />
                          <XAxis dataKey="tipo_metodo_pago" />
                          <YAxis domain={[0, Math.max(...ventaXmetodoPago.map(item => item.monto_total)) * 1.2]} />
                          <Legend />
                          <Bar dataKey="monto_total" fill="#006408ff" barSize={50}>
                              <LabelList dataKey="monto_total" position="top"   formatter={(value) => 
                              new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value)
                              }  />
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              )}
          </div>
      </div>
  
      {/* TERCER GRAFICO */}
      <div className="col" style={{ flex: '1 1 45%', marginTop: '100px', minWidth: '300px' }}>
          <h5 className="titulosreportes">MONTO DE VENTAS TOTALES POR DEPARTAMENTO ($)</h5>
          <div>
              {ventatotalxcategoria.length === 0 ? (
                  <DataReportes />
              ) : (
                  <ResponsiveContainer width="100%" height={500}>
                      <BarChart data={ventatotalxcategoria}>
                          <CartesianGrid strokeDasharray="8 8" />
                          <XAxis dataKey="nombre_categoria" />
                          <YAxis domain={[0, Math.max(...ventatotalxcategoria.map(item => item.monto_total)) * 1.2]} />
                          <Legend />
                          <Bar dataKey="monto_total" fill="#006408ff" barSize={50}>
                              <LabelList dataKey="monto_total" position="top" formatter={(value) => 
                              new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value)
                              }  />
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              )}
          </div>
      </div>
  
      {/* CUARTO GRAFICO */}
      <div className="col" style={{ flex: '1 1 45%', marginTop: '100px', minWidth: '300px' }}>
          <h5 className="titulosreportes">CLIENTE CON MAYOR VENTA</h5>
          <div>
              {ventaxcliente.length === 0 ? (
                  <DataReportes />
              ) : (
                  <ResponsiveContainer width="100%" height={500}>
                      <PieChart>
                          <Pie
                              dataKey="monto_total_venta"
                              nameKey="nombre_cliente"
                              data={ventaxcliente}
                              innerRadius={120}
                              outerRadius={200}
                              fill="#82ca9d"
                              label={(entry) => `${entry.nombre_cliente}: ${formatCurrency(entry.monto_total_venta)}`}
                          >
                              {ventaxcliente.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
                              ))}
                          </Pie>
                      </PieChart>
                  </ResponsiveContainer>
              )}
          </div>
      </div>
  
      {/* QUINTO GRAFICO */}
      <div className="col" style={{ flex: '1 1 45%', marginTop: '100px', minWidth: '300px' }}>
          <h5 className="titulosreportes">NUMERO Y MONTO DE VENTAS POR EMPLEADO</h5>
          <div>
              {ventaxempleado.length === 0 ? (
                  <DataReportes />
              ) : (
                  <ResponsiveContainer width="100%" height={500}>
                  <PieChart>
                      <Pie
                          dataKey="total_ventas"
                          nameKey="nombre_usuario"
                          data={ventaxempleado}
                          innerRadius={120}
                          outerRadius={200}
                          fill="#82ca9d"
                          label={({ nombre_usuario, total_ventas, precioTotal_venta }) => 
                              `${nombre_usuario}: ${total_ventas} (${formatCurrency(precioTotal_venta)})`
                          }
                      >
                          {ventaxempleado.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
                          ))}
                      </Pie>
                  </PieChart>
                  </ResponsiveContainer>
              )}
          </div>
      </div>
{/*
      <div className="col" style={{ flex: '1 1 45%', marginTop: '100px', minWidth: '300px' }}>      
       <h5>EGRESOS</h5>
      <div>
        {egresos.length === 0 ? (
          <DataReportes/>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
          <PieChart>
              <Pie
                  dataKey="MontoTotal"
                  nameKey="Descripcion_motivo"
                  data={egresos}
                  innerRadius={120}
                  outerRadius={200}
                  fill="#82ca9d"
                  label={({ motivo, MontoTotal }) => 
                      `${motivo}: $${MontoTotal}`
                  }
              >
                  {egresos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
                  ))}
              </Pie>
          </PieChart>
          </ResponsiveContainer>
        )}
      </div> 
      </div>  */}
    </div>
  </>
  
  )
}
