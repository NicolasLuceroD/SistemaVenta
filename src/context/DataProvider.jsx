/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { DataContext } from "./DataContext";
import axios from 'axios';

const DataProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);

// "https://bunkermarket.com.ar:9113/api/"    "http://localhost:2201/api/"

  const URL =   "http://localhost:2201/api/"
 
  
  const traerSucursales = () => {
    axios.get(`${URL}sucursales`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setSucursales(response.data);
        } else {
          console.error('Respuesta inesperada:', response.data);
          setSucursales([]);
        }
      })
      .catch((error) => {
        console.error('Error al traer las sucursales:', error);
        setSucursales([]); 
      });
  };

  

  const traerProductos = () =>{
    axios.get(`${URL}productos`).then((response)=>{
      setProductos(response.data)
    }).catch((error)=>{
      console.log('error al traer los productos', error)
    })
  }


  useEffect(()=>{
    traerSucursales()
    traerProductos()
  },[])


  return (
    <DataContext.Provider value={{ productos, sucursales,URL }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
