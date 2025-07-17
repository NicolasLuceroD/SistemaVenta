import { useContext, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { MDBFile } from 'mdb-react-ui-kit';
import { DataContext } from '../context/DataContext';
import Productos from "../components/Productos";

const Importar = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const { URL } = useContext(DataContext);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Por favor selecciona un archivo.');
      return;
    }
    if (!file.name.endsWith('.xlsx')) {
      setError('El archivo seleccionado no es un archivo Excel válido.');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        const productsData = [];
        for (let i = 1; i < data.length; i++) {
          const fechaRegistro = data[i][7] ? new Date(data[i][7]) : null;
          const fechaVencimiento = data[i][10] ? new Date(data[i][10]) : null;
  
          const isValidDate = (date) => date instanceof Date && !isNaN(date);
  
          const product = {
            nombre_producto: data[i][0],
            descripcion_producto: data[i][1],
            precioCompra: data[i][2],
            precioVenta: data[i][3],
            precioMayoreo: data[i][4],
            tipo_venta: data[i][5],
            FechaRegistro: isValidDate(fechaRegistro) ? fechaRegistro.toISOString().slice(0,10) : '2024-06-28',
            Id_categoria: data[i][7],
            Id_sucursal: data[i][8],
            FechaVencimiento: isValidDate(fechaVencimiento) ? fechaVencimiento.toISOString().slice(0,10) : '2024-12-31',
            codProducto: data[i][10] // Asegúrate que esto esté en el índice correcto
        };
  
          productsData.push(product);
        }
  
        setProducts(productsData);
        setError('');
      } catch (error) {
        setError('Error al procesar el archivo. Verifica el formato correcto del archivo.');
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
  };
  

  const cargarProductos = async () => {
    if (products.length === 0) {
      alert('Debes cargar los productos antes de crearlos');
      return;
    }
  
    const fechaDefinida = "2024-06-28";
    for (const producto of products) {
      const precioCompra = producto.precioCompra ? parseFloat(producto.precioCompra.replace(/[^\d.-]/g, '')) : 0;
      const precioVenta = producto.precioVenta ? parseFloat(producto.precioVenta.replace(/[^\d.-]/g, '')) : 0;
      const precioMayoreo = producto.precioMayoreo ? parseFloat(producto.precioMayoreo.replace(/[^\d.-]/g, '')) : 0;
  
      const data = {
        nombre_producto: producto.nombre_producto,
        descripcion_producto: producto.descripcion_producto,
        precioCompra: precioCompra,
        precioVenta: precioVenta,
        precioMayoreo: precioMayoreo,
        Id_categoria: 4,
        Id_sucursal: 1,
        tipo_venta: producto.tipo_venta,
        FechaVencimiento: fechaDefinida,
        codProducto: producto.codProducto,
        Estado: 1  // O el estado que necesites enviar
      };
  
      try {
        await axios.post(`${URL}productos/post`, data);
        console.log(`Producto ${producto.nombre_producto} cargado exitosamente`);
      } catch (error) {
        console.error(`Error al cargar producto ${producto.nombre_producto}:`, error);
        if (error.response) {
          console.error("Datos del error:", error.response.data);
        }
      }
    }
  };

  return (
    <div>
      <Productos/>
      <br /><br />
      <div className='container'>
        <h2><strong>CARGA MASIVA DE PRODUCTOS</strong></h2>
        <h4>Carga todos tus productos desde un excel</h4>
        <MDBFile type="file" id='customFile' onChange={handleFileUpload} />
      </div>
      <br /><br />
      <button onClick={cargarProductos} className='btn btn-secondary'>Cargar Productos</button>
      <br /><br /><br /><br />
      <div className="container table">
        <table className="table table-striped table-hover mt-5 shadow-lg">
          <thead className='custom-table-header'>
            <tr>
              <th>NOMBRE</th>
              <th>DESCRIPCION</th>
              <th>PRECIO COSTO</th>
              <th>PRECIO VENTA</th>
              <th>PRECIO MAYOREO</th>
              <th>TIPO VENTA</th>
              <th>FECHA REGISTRO</th>
              <th>CATEGORÍA</th>
              <th>SUCURSAL</th>
              <th>FECHA VENCIMIENTO</th>
              <th>CODIGO PRODUCTO</th>
            </tr>
          </thead>
          <tbody>
            {products.map((producto) => (
              <tr key={producto.Id_producto}>
                <td>{producto.nombre_producto}</td>
                <td>{producto.descripcion_producto}</td>
                <td>{producto.precioCompra}</td>
                <td>{producto.precioVenta}</td>
                <td>{producto.precioMayoreo}</td>
                <td>{producto.tipo_venta}</td>
                <td>{new Date(producto.FechaRegistro).toISOString().slice(0,10)}</td>
                <td>{producto.Id_categoria}</td>
                <td>{producto.Id_sucursal}</td>
                <td>{new Date(producto.FechaVencimiento).toISOString().slice(0,10)}</td>
                <td>{producto.codProducto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Importar;
