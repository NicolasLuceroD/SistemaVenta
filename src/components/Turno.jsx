import { useEffect, useContext, useState } from 'react'
import { DataContext } from '../context/DataContext'
import App from '../App'
import axios from 'axios'
import ScrollToTopButton from './utils/ScrollToTopButton'
import Paginacion from './Paginacion'
import { set } from 'date-fns'

const Turno = () => {

  // API
  const { URL } = useContext(DataContext)

  // ESTADOS
  const [turnos, setTurnos] = useState([])
  const [fechaFiltro, setFechaFiltro] = useState('')


  // TRAER TURNOS
const traerTurnos = (fecha) => {
  const params = fecha ? { params: { fecha } } : undefined;

  axios.get(`${URL}Turno/verTurnos`, params)
    .then((response) => {
      setTurnos(response.data);
      setTotal(response.data.length);
    })
    .catch((error) => {
      console.error('Error al traer turnos: ', error);
    });
};


useEffect(() => {
  setActualPagina(1);            // clave para que no te quedes en pag 3 sin resultados
  traerTurnos(fechaFiltro);
}, [fechaFiltro]);


  const mostrarValor = (valor) => {
    return valor === null ? '-' : valor
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value)
  }

  const mostrarImporte = (valor) => {
    if (valor === null) return '-'
    return formatCurrency(valor)
  }

  const mostrarTotal = (valor, estado) => {
    if (estado === 'ABIERTO') {
      return <span className="text-success fst-italic">Turno abierto</span>
    }
    if (valor === null) return '-'
    return formatCurrency(valor)
  }

  const turnosFiltrados =  turnos

const sinResultadosPorFecha = fechaFiltro && turnosFiltrados.length === 0

    //PAGINACION NUEVA
    const productosPorPagina = 5
    const [actualPagina, setActualPagina] = useState(1)
    const [total, setTotal] = useState(0)
    const ultimoIndex = actualPagina * productosPorPagina;
    const primerIndex = ultimoIndex - productosPorPagina;
  

    const mostrarFecha = (s) => {
  if (!s) return "—";
  const [fecha, hora] = s.split(" ");
  if (!hora) return s; 
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}, ${hora}`;
};

  return (
    <>
      <App />

      <div className="h3-ventas">
        <h1>TURNOS</h1>
      </div>

      <br />

      <div className="container">
        <div className="row">
          <div className="col">
            <h2><strong>ADMINISTRACIÓN DE TURNOS</strong></h2>
            <h4>Gestiona todos los turnos de forma centralizada.</h4>
          </div>
        </div>
      </div>

      <br />

{/* CALENDARIO */}
<div className="container-fluid px-4 mt-3">
  <div className="row align-items-end">
    <div className="col-md-3">
      <label className="form-label fw-semibold">
        Filtrar por fecha de ingreso
      </label>
      <input
        type="date"
        className="form-control"
        value={fechaFiltro}
        onChange={(e) => setFechaFiltro(e.target.value)}
      />
    </div>

    <div className="col-md-2">
      <button className="btn btn-outline-warning mt-2" onClick={() => setFechaFiltro('')}>
        Limpiar filtro
      </button>
    </div>
  </div>
</div>

 <div className="container-fluid mt-4">
  <div className="card shadow-sm border-0">
    <div className="card-body p-0">

      {turnos.length === 0 ? (
        <div className="py-4 text-center text-muted">
          No hay turnos registrados
        </div>
      ) : sinResultadosPorFecha ? (
        <div className="alert alert-warning text-center m-4">
          No hay turnos para la fecha seleccionada
          <br />
          <strong>{fechaFiltro}</strong>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle text-center mb-0 table-column-lines">
            <thead className="table-header-gradient text-uppercase small">
              <tr>
                <th className="px-2">Folio</th>
                <th className="px-2">Estado</th>
                <th className="px-2">Ingreso</th>
                <th className="px-2">Salida</th>
                <th className="px-2">Usuario</th>
                <th className="px-2">Fondo</th>
                <th className="px-2">Efectivo</th>
                <th className="px-2">Transferencia</th>
                <th className="px-2">Mixto</th>
                <th className="px-2">Débito</th>
                <th className="px-2">Credito</th>
                <th className="px-2">Cigarrillos</th>
                <th className="px-2">Egreso</th>
                <th className="px-2">Ingreso</th>
                <th className="px-2">Total en Caja</th>
                <th className="px-2">Sucursal</th>
              </tr>
            </thead>

            <tbody>
              {turnosFiltrados.slice(primerIndex, ultimoIndex).map((tur) => (
                <tr key={tur.Id_turno}>
                  <td className="px-2 fw-semibold">{tur.Id_turno}</td>

                  <td className="px-2">
                    <span
                      className={`badge rounded-pill px-3 py-1 ${
                        tur.Estado === 'ABIERTO'
                          ? 'bg-success-subtle text-success'
                          : 'bg-danger-subtle text-danger'
                      }`}
                    >
                      {tur.Estado}
                    </span>
                  </td>

                  <td className="px-2 text-nowrap">{new Date(tur.FechaIngreso).toLocaleString()}</td>

                <td className="px-2 text-nowrap">
                  {tur.FechaSalida ? mostrarFecha(tur.FechaSalida) : "—"}
                </td>
                
                  <td className="px-2">{mostrarValor(tur.NombreUsuario)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.FondoCaja)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Efectivo)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Transferencia)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Mixto)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Debito)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Credito)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Cigarrillos)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Egreso)}</td>
                  <td className="px-2 text-end">{mostrarImporte(tur.Ingreso)}</td>

                  <td className="px-2 fw-bold text-end">
                    {mostrarTotal(tur.TotalEnCaja, tur.Estado)}
                  </td>

                  <td className="px-2">{mostrarValor(tur.NombreSucursal)}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>

    <br />

    <div className="d-flex justify-content-center">
      <Paginacion
        productosPorPagina={productosPorPagina}
        actualPagina={actualPagina} 
        setActualPagina={setActualPagina}
        total={total}
      />
    </div>
  </div>
</div>

      <ScrollToTopButton/>
    </>
  )
}

export default Turno
