/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { DataContext } from "./DataContext";
import axios from 'axios';

const DataProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true); 

  // "/api/"    "http://localhost:2201/api/"

  const URL = "http://localhost:2201/api/"
  
  const traerSucursales = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}sucursales`);
      if (Array.isArray(response.data)) {
        setSucursales(response.data);
      } else {
        console.error('Respuesta inesperada:', response.data);
        setSucursales([]);
      }
    } catch (error) {
      console.error('Error al traer las sucursales:', error);
      setSucursales([]); 
    }
  }, []);

  const traerProductos = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}productos`);
      setProductos(response.data);
    } catch (error) {
      console.log('Error al traer los productos', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([traerSucursales(), traerProductos()]);
      setLoading(false); 
    };

    fetchData(); 
  }, [traerSucursales, traerProductos]);

  if (loading) {
    return <div>Cargando...</div>; 
  }

  return (
    <DataContext.Provider value={{ productos, sucursales, URL }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
