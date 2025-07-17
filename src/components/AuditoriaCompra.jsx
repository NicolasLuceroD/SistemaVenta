import { useState, useEffect, useContext} from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import App from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { DataContext } from '../context/DataContext'
import axios from 'axios'

const AuditoriaCompra = () => {

//URL
const { URL } = useContext(DataContext)

//ESTADOS PARA COMPRAS CANCELADAS
const [comprascanceladas, setComprasCanceladas] = useState([])
const [detallecompracancelada, setDetalleCompraCancelada] = useState([])
const [montoscompras, setMontosCompras] = useState([])
const [sucursal, setSucursal] = useState('') // para el filtro del select modal

//ESTADOS PARA CUENTAS A PAGAR
const [cuentasapagar, setCuentasAPagar] = useState([])
const [detallecuentasapagar, setDetalleCuentaAPagar] = useState([])


//ESTADOS PARA SALDOS AV Y SM
const [saldoavellaneda, setSaldoAvellaneda] = useState([])
const [saldosanmartin, setSaldoSanMartin ] = useState([])

//ESTADOS PARA CUENTAS PAGADAS
const [cuentaspagadas, setCuentasPagadas] = useState([])
const [totalcuentaspagadas, setTotalCuentasPagadas] = useState([])


//MODALES
const [showmodalcancelaciones, setShowModalCancelaciones] = useState(false)
const [showmodalcuentasapagar, setShowModalCuentasAPagar] = useState(false)
const [showmodalcuentaspagadas, setShowModalCuentasPagadas] = useState(false)

//MANEJADORES DEL MODAL
const handleShowModalCancelaciones = () => setShowModalCancelaciones(true)
const handleCloseModalCancelaciones = () => setShowModalCancelaciones(false)

const handleShowModalCuentasPagadas = () => setShowModalCuentasPagadas(true)
const handleCloseModalCuentasPagadas = () => setShowModalCuentasPagadas(false)

const handleShowModalCuentasAPagar = () => setShowModalCuentasAPagar(true)
const handleCloseModalCuentasAPagar = () => setShowModalCuentasAPagar(false)

//-------------------------------COMPRAS CANCELADAS-----------------------------------------------------------------//
//TRAER COMPRAS CANCELADAS
const verComprasTotalesCanceladas = () => {
  axios.get(`${URL}auditoria/verComprasCanceladas`).then((response)=> {
    setComprasCanceladas(response.data[0].total_canceladas)
  })
}

//TRAER DETALLE COMPRAS CANCELADAS
const verDetalleCompraCancelada = () => {
  axios.get(`${URL}auditoria/verDetalleCompraCancelada`).then((response)=> {
    setDetalleCompraCancelada(response.data)
  })
}

//TRAER MONTOS TOTALES COMPRAS
const verMontosTotalesCompras = () => {
  axios.get(`${URL}auditoria/verMontosTotalesCompras`).then((response)=> {
    console.log('Montos totales compras', response.data)
    setMontosCompras(response.data[0].total_monto_pagos)
  })
}

//-----------------------------------CUENTAS A PAGAR------------------------------------------------------------//

//TRAER CUENTAS A PAGAR
const verCuentasAPagar = () => {
  axios.get(`${URL}auditoria/verCuentasAPagar`).then((response)=> {
    console.log('Cuentas a pagar: ',response.data)
    setCuentasAPagar(response.data[0].total_a_pagar)
  })
}

//TRAER DETALLE CUENTA A PAGAR
const verDetalleCuentaAPagar = () => {
  axios.get(`${URL}auditoria/verdetalleCuentasAPagar`).then((response) => {
    console.log('Detalle cuenta a pagar: ', response.data)
    setDetalleCuentaAPagar(response.data)
  }).catch((error)=> {
    console.error('Error al obtener detalle',error)
  })
}



//---------------------------------------SALDOS---------------------------------------------------------//

//TRAER SALDO AVELLANEDA
const verSaldoAvellaneda = () => {
  axios.get(`${URL}auditoria/verSaldoAvellaneda`).then((response)=> {
    setSaldoAvellaneda(response.data[0].saldo_avellaneda)
  }).catch((error)=> {
    console.error('Error',error)
  })
}

const verSaldoSanMartin = () => {
  axios.get(`${URL}auditoria/verSaldoSanMartin`).then((response)=> {
    setSaldoSanMartin(response.data[0].saldo_sm)
  }).catch((error)=> {
    console.error('Error',error)
  })
}

//---------------------------------------CUENTAS PAGADAS---------------------------------------------------------//
const verCuentasPagadas = () => {
  axios.get(`${URL}auditoria/verCuentasPagadas`).then((response)=> {
    console.log('Cuentas pagadas: ',response.data)
    setCuentasPagadas(response.data)
  }).catch((error)=>{
    console.error('Error al obtener cuentas pagadas', error)
  })
}

const verTotalCuentasPagadas = () => {
  axios.get(`${URL}auditoria/verTotalCuentasPagadas`).then((response)=> {
    setTotalCuentasPagadas(response.data[0].total_compras_pagadas)
  }).catch((error)=>{
    console.error('Error', error)
  })
}


//FORMATO MONEDA
 const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};

//SELECT MODAL CANCELACIONES FILTRO
const handleSucursalChange = (e) => {
  setSucursal(e.target.value);
};


const coloresSucursal = {
  'Av. Avellaneda - 99': '#d1e7dd', 
  'San Martin - 16': '#f8d7da',    
};  

useEffect(()=> {
  verComprasTotalesCanceladas()
  verDetalleCompraCancelada()
  verMontosTotalesCompras()
  verCuentasAPagar()
  verDetalleCuentaAPagar()
  verSaldoAvellaneda()
  verSaldoSanMartin()
  verCuentasPagadas()
  verTotalCuentasPagadas()
},[])

  return (
    <>
    <App/>
     <div className='h3-ventas'>
      <h1>AUDITORIA DE COMPRAS</h1>
    </div>

 <div className="container mt-4">
      <div className="mb-4">
        <div className="card text-center shadow">
          <div className="card-body">
            <h3 className="card-title">PAGOS A PROVEEDORES</h3>
            <h2 style={{color: 'green'}}>{formatCurrency(montoscompras)}</h2>
            <br />
            <h5 style={{textAlign: 'left'}}>SALDO AVELLANEDA:  <strong style={{color: '#b66900', marginLeft: '8px'}}>{formatCurrency(saldoavellaneda)}</strong> </h5>
            <h5 style={{textAlign: 'left'}}>SALDO SAN MARTIN: <strong style={{color: '#b66900', marginLeft: '8px'}}>{formatCurrency(saldosanmartin)}</strong></h5>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h4>CUENTAS PAGADAS </h4>
             <Button variant="success" onClick={handleShowModalCuentasPagadas} >
              <FontAwesomeIcon icon={faEye}/>
             </Button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h4>CUENTAS A PAGAR</h4>
              <Button variant="warning" onClick={handleShowModalCuentasAPagar}>
              <FontAwesomeIcon icon={faEye}/>
             </Button>
             
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h4>COMPRAS CANCELADAS </h4>
              <Button variant="danger" onClick={handleShowModalCancelaciones} >
              <FontAwesomeIcon icon={faEye}/>
             </Button>
            </div>
          </div>
        </div>
      </div>
    </div>


{/* MODALES */}

{/* MODAL CANCELACIONES */}
  <Modal show={showmodalcancelaciones} onHide={handleCloseModalCancelaciones} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>COMPRAS CANCELADAS</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <h6>TOTAL DE COMPRAS CANCELADAS: {comprascanceladas} </h6>
             <Form.Select
                className="mb-3"
                 value={sucursal}
                 onChange={handleSucursalChange}
              >
                <option value="">FILTRAR POR SUCURSAL</option>
                <option value="Av. Avellaneda - 99">Av.Avellaneda - 99</option>
                <option value="San Martin - 16">San Martin - 16</option>
              </Form.Select>
           <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
            <thead className='custom-table-header'>
              <tr>
                <th>FOLIO</th>
                <th>TOTAL</th>
                <th>PROVEEDOR</th>
                <th>MOTIVO</th>
                <th>F.CANCELACION</th>
                <th>USUARIO REGISTRO COMPRA</th>
                <th>USUARIO CANCELO</th>
                <th>SUCURSAL</th>
              </tr>
            </thead>
            <tbody>
              {detallecompracancelada.filter((val) => !sucursal || val.sucursal === sucursal).map((val) => (
                  <tr key={val.Id_compra}>
                    <td>{val.Id_compra}</td>
                    <td>{formatCurrency(val.totalCompra)}</td>
                    <td>{val.proveedor}</td>
                    <td style={{backgroundColor: '#dcdd91'}}>{val.motivo_cancelacion}</td>
                    <td>{new Date(val.fecha_cancelacion).toLocaleString()}</td>
                    <td>{val.usuario_registra_compra}</td>
                    <td>{val.usuario_cancela}</td>
                    <td style={{ backgroundColor: coloresSucursal[val.sucursal] || '' }}>{val.sucursal}</td>
                  </tr>
                ))}
          </tbody>
           </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModalCancelaciones}>
            CERRAR
          </Button>
        </Modal.Footer>
   </Modal>

  {/* MODAL CUENTAS A PAGAR */}
  <Modal show={showmodalcuentasapagar} onHide={handleCloseModalCuentasAPagar} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>CUENTAS A PAGAR</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <h6>TOTAL DE COMPRAS A PAGAR: {cuentasapagar} </h6>
             <Form.Select
                className="mb-3"
                 value={sucursal}
                 onChange={handleSucursalChange}
              >
                <option value="">FILTRAR POR SUCURSAL</option>
                <option value="Av. Avellaneda - 99">Av.Avellaneda - 99</option>
                <option value="San Martin - 16">San Martin - 16</option>
              </Form.Select>
           <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
            <thead className='custom-table-header'>
              <tr>
                <th>FOLIO</th>
                <th>TOTAL COMPRA</th>
                <th>FALTA PAGAR</th>
                <th>PROVEEDOR</th>
                <th>FECHA REGISTRO</th>
                <th>USUARIO REGISTRO COMPRA</th>
                <th>SUCURSAL</th>
              </tr>
            </thead>
            <tbody>
              {detallecuentasapagar.filter((val) => !sucursal || val.nombre_sucursal === sucursal).map((val) => (
                  <tr key={val.Id_compra}>
                    <td>{val.Id_compra}</td>
                    <td>{formatCurrency(val.totalCompra)}</td>
                    <td style={{backgroundColor: '#FF9985'}}>{formatCurrency(val.faltaPagar)}</td>
                    <td>{val.nombre_proveedor}</td>
                    <td>{new Date(val.FechaRegistro).toLocaleString()}</td>
                    <td>{val.registrado_por}</td>
                    <td style={{ backgroundColor: coloresSucursal[val.nombre_sucursal] || '' }}>{val.nombre_sucursal}</td>
                  </tr>
                ))}
          </tbody>
           </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModalCuentasAPagar}>
            CERRAR
          </Button>
        </Modal.Footer>
   </Modal>

     {/* MODAL CUENTAS PAGADAS */}
  <Modal show={showmodalcuentaspagadas} onHide={handleCloseModalCuentasPagadas} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>CUENTAS PAGADAS</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <h6>TOTAL DE COMPRAS PAGADAS: {totalcuentaspagadas} </h6>
             <Form.Select
                className="mb-3"
                 value={sucursal}
                 onChange={handleSucursalChange}
              >
                <option value="">FILTRAR POR SUCURSAL</option>
                <option value="Av. Avellaneda - 99">Av.Avellaneda - 99</option>
                <option value="San Martin - 16">San Martin - 16</option>
              </Form.Select>
           <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
            <thead className='custom-table-header'>
              <tr>
                <th>FOLIO</th>
                <th>TOTAL COMPRA</th>
                <th>PROVEEDOR</th>
                <th>USUARIO</th>
                <th>FECHA REGISTRO</th>
                <th>SUCURSAL</th>
              </tr>
            </thead>
            <tbody>
              {cuentaspagadas.filter((val) => !sucursal || val.nombre_sucursal === sucursal).map((val) => (
                  <tr key={val.Id_compra}>
                    <td>{val.Id_compra}</td>
                    <td>{formatCurrency(val.totalCompra)}</td>
                    <td>{val.nombre_proveedor}</td>
                    <td>{val.nombre_usuario}</td>
                    <td>{new Date(val.FechaRegistro).toLocaleString()}</td>
                    <td style={{ backgroundColor: coloresSucursal[val.nombre_sucursal] || '' }}>{val.nombre_sucursal}</td>
                  </tr>
                ))}
          </tbody>
           </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModalCuentasPagadas}>
            CERRAR
          </Button>
        </Modal.Footer>
   </Modal>             
    </>
  )
}

export default AuditoriaCompra