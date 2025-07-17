import { useContext, useEffect, useState } from "react"
import Productos from "../components/Productos"
import axios from "axios"
import { DataContext } from "../context/DataContext"
import Paginacion from '../components/Paginacion.jsx';


const Inventario = () => {

    const  [inv, setInv] = useState([])
    const [vencimineto,setVencimineto] = useState([])
    const {URL} = useContext(DataContext)

    const traerInv =() =>{
        axios.get(`${URL}stock/invBajo`).then((response)=>{
            setInv(response.data)
            setTotal2(response.data.length)
        }).catch((error)=>{
            console.log('Error al obtener el inventario', error)
        })
    }

    const traerVencidos = () =>{
        axios.get(`${URL}productos/ver/vencimineto`).then((response)=>{
            setVencimineto(response.data)
            setTotal(response.data.length)

        }).catch((error)=>{
            console.log('Error al obtener los producos por vencerce', error)
        })
    }

    useEffect(()=>{
        traerInv()
        traerVencidos()
    },[inv,vencimineto])


//PAGINACION NUEVA
const productosPorPagina = 10
const [actualPagina,setActualPagina] = useState(1)
const [total, setTotal]=useState(0)
const ultimoIndex = actualPagina * productosPorPagina;
const primerIndex = ultimoIndex - productosPorPagina;

//PAGINACION NUEVA 2
const productosPorPagina2 = 10   
const [actualPagina2,setActualPagina2] = useState(1)
const [total2, setTotal2]=useState(0)
const ultimoIndex2 = actualPagina2 * productosPorPagina2;
const primerIndex2 = ultimoIndex2 - productosPorPagina2;


const [buscar, setBuscar] = useState('');


const buscador = (e) => {
    setBuscar(e.target.value);
  }

  let resultado = [];
  if (!buscar) {
    resultado = inv;
  } else {
    resultado = inv.filter((dato) => {
      const nombreProductoIncluye = dato.nombre_producto.toLowerCase().includes(buscar.toLowerCase());
      const codProductoIncluye = dato.codProducto && dato.codProducto.toString().includes(buscar.toLowerCase());
      return nombreProductoIncluye || codProductoIncluye;
    });
  }

const [buscar2, setBuscar2] = useState('');

const buscador2 = (e) => {
    setBuscar2(e.target.value);
  }

  let resultado2 = [];
  if (!buscar2) {
    resultado2 = vencimineto;
  } else {
    resultado2 = vencimineto.filter((dato) => {
      const nombreProductoIncluye = dato.nombre_producto.toLowerCase().includes(buscar2.toLowerCase());
      const codProductoIncluye = dato.codProducto && dato.codProducto.toString().includes(buscar2.toLowerCase());
      return nombreProductoIncluye || codProductoIncluye;
    });
  }


  return (
    <>
      <Productos/>

      <div className="container"><br /><br />
            <h2><strong>GESTION DE INVENTARIO</strong></h2>
            <h4>
            Lleva un stock actualizado controlando el stock de tus productos de forma centralizada y la fecha de vencimiento de los mismos
            </h4><br /><br /><br />
            
            <h4>POR INVENTARIO BAJO</h4>
            <input value={buscar} onChange={buscador} type="text" placeholder='Busca un producto...' className='form-control'/>
            <div className='container table'>
            <table className="table table-striped table-hover mt-5 shadow-lg">
                <thead className='custom-table-header'>
                    <tr>
                        <th>CODIGO</th>
                        <th>NOMBRE</th>
                        <th>DESCRIPCION</th>
                        <th>TIPO VENTA</th>
                        <th>CANTIDAD </th>
                        <th>INV. MINIMO</th>
                        <th>SUCURSAL</th>
                    </tr>
                </thead>
                <tbody>
                  {resultado.slice(primerIndex2, ultimoIndex2).map((item)=>(
                    <tr key={item.Id_stock}>
                        <td>{item.codProducto}</td>
                        <td>{item.nombre_producto}</td>
                        <td>{item.descripcion_producto}</td>
                        <td>{item.tipo_venta}</td>
                        <td className="cantidad">{item.cantidad}</td>
                        <td className="inventario-minimo">{item.inventarioMinimo}</td>
                        <td>{item.nombre_sucursal}</td>
                    </tr>
                 ))}
                </tbody>
            </table>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
            <Paginacion productosPorPagina={productosPorPagina2} 
            actualPagina={actualPagina2} 
            setActualPagina={setActualPagina2}
            total={total2}
            />
            </div>
                 <hr />

            <h4>POR FECHA DE VENCIMINETO A VENCERCE</h4>
            <input value={buscar2} onChange={buscador2} type="text" placeholder='Busca un producto...' className='form-control'/>
            <div className='container table'>
            <table className="table table-striped table-hover mt-5 shadow-lg">
                <thead className='custom-table-header'>
                    <tr>
                        <th>CODIGO</th>
                        <th>NOMBRE</th>
                        <th>DESCRIPCION</th>
                        <th>TIPO VENTA</th>
                        <th>FECHA DE VENCIMIENTO</th>
                    </tr>
                </thead>
                <tbody>
                  {resultado2.slice(primerIndex, ultimoIndex).map((item)=>(
                    <tr key={item.Id_producto}>
                        <td>{item.codProducto}</td>
                        <td>{item.nombre_producto}</td>
                        <td>{item.descripcion_producto}</td>
                        <td>{item.tipo_venta}</td>
                        <td>{new Date(item.FechaVencimiento).toISOString().slice(0, 10)}</td>
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

      </div>
    </>
  )
}

export default Inventario
