
/* eslint-disable react/prop-types */
import { CarritoContext } from "./CarritoContext"
import { useReducer } from 'react'


const initialState = []



export const CarritoProvider = ({children}) => {
    
    const comprasReducer = (state = initialState, action = {}) => {
        switch (action.type) {
            case '[CARRITO] Agregar Compras': 
            return [...state, ...action.payload]; 
            case '[CARRITO] Agregar Compra':
                return [...state, action.payload]
            case '[CARRITO] Aumentar Cantidad Compra': 
                return state.map(item => {
                    const cant = item.cantidadesVendidas + item.cantidadesVendidas
                    if(item.Id_producto === action.payload) return {...item, cantidadesVendidas: cant}
                    return item
                })
            case '[CARRITO] Disminuir Cantidad Compra': 
            return state.map(item => {
                const cant = item.cantidadesVendidas - item.cantidadesVendidas
                if(item.Id_producto === action.payload && item.cantidadesVendidas > 1) return {...item, cantidadesVendidas: cant}
                return item
            })
             
            case '[CARRITO] Eliminar Compra':
                return state.filter(compra => compra.Id_producto !== action.payload)

            case '[CARRITO] Eliminar Compras':
                return state.filter(compra => compra.Id_producto !== action.payload)

            case '[CARRITO] Eliminar Ventas':
                    return initialState; 

            default:
                return state
        }
    }

    const [listaCompras, dispatch] = useReducer(comprasReducer, initialState)

    const agregarCompra = (compra) => {
        const action = {
            type: '[CARRITO] Agregar Compra',
            payload: compra
        }
        dispatch(action)
    
    }
    const aumentarCantidad = (Id_producto) => {
        const action = {
            type: '[CARRITO] Aumentar Cantidad Compra',
            payload: Id_producto
        }
        dispatch(action)
    
    }
    const disminuirCantidad = (Id_producto) => {
        const action = {
            type: '[CARRITO] Disminuir Cantidad Compra',
            payload: Id_producto
        }
        dispatch(action)
    
    }

    const eliminarCompra = (Id_producto) => {
        const action = {
            type: '[CARRITO] Eliminar Compra',
            payload: Id_producto
        }
        dispatch(action)
    
    }
    const agregarCompras = (compras) => {
    const action = {
        type: '[CARRITO] Agregar Compras', 
        payload: compras 
    };
    dispatch(action);  
    };

    const eliminarVentas   = () => {
    const action = {
        type: '[CARRITO] Eliminar Ventas'
    };
    dispatch(action);
    };

  return (
     <>
    
      <CarritoContext.Provider value={{eliminarVentas ,listaCompras,agregarCompras, agregarCompra, aumentarCantidad, disminuirCantidad, eliminarCompra}}>
        {children}
      </CarritoContext.Provider>
    
    
    </>
   )
 }


