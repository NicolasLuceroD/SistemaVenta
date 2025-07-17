const {connection} = require('../database/config')

/*CONSULTAS PARA COMPRAS CANCELADAS*/
const verComprasCanceladas = (req,res) => {
    connection.query(`SELECT COUNT(*) AS total_canceladas FROM compra WHERE estado_compra = 'cancelada'`, (error,results)=> {
        if (error) throw error
        res.json(results)
    })
}

const verDetalleCompraCancelada = (req,res) => {
    connection.query(`SELECT 
                        c.Id_compra,
                        c.totalCompra,
                        s.nombre_sucursal AS sucursal,
                        p.nombre_proveedor AS proveedor,
                        u.nombre_usuario AS usuario_registra_compra,
                        ca.FechaRegistro AS fecha_cancelacion,
                        ca.motivo_cancelacion,
                        uc.nombre_usuario AS usuario_cancela
                        FROM compra c
                        LEFT JOIN sucursales s ON c.Id_sucursal = s.Id_sucursal
                        LEFT JOIN proveedores p ON c.Id_proveedor = p.Id_proveedor
                        LEFT JOIN usuarios u ON c.Id_usuario = u.Id_usuario
                        LEFT JOIN cancelaciones ca ON c.Id_compra = ca.Id_compra
                        LEFT JOIN usuarios uc ON ca.Id_usuario = uc.Id_usuario
                        WHERE c.estado_compra = 'cancelada'`,(error,results)=> {
                            if (error) throw error
                            res.json(results)
                        })
}


const verMontoTotalesCompras = (req,res) => {
    connection.query(`SELECT SUM(monto) AS total_monto_pagos FROM pagosproveedores`,(error,results)=> {
        if (error) throw error
        res.json(results)
    })
}

/*CONSULTAS PARA CUENTAS A PAGAR */
const verCuentasAPagar = (req,res) => {
    connection.query(`SELECT COUNT(*) AS total_a_pagar FROM compra WHERE estado_compra = 'pendiente'`,(error,results) => {
        if (error) throw error
        res.json(results)
    })
}


const verdetalleCuentasAPagar = (req,res) => {
    connection.query(`
                        SELECT 
                            c.Id_compra,
                            c.totalCompra,
                            c.faltaPagar,
                            p.nombre_proveedor AS nombre_proveedor,       
                            s.nombre_sucursal AS nombre_sucursal,          
                            u.nombre_usuario AS registrado_por,   
                            c.FechaRegistro
                        FROM 
                            compra c
                        LEFT JOIN 
                            proveedores p ON c.Id_proveedor = p.Id_proveedor
                        LEFT JOIN 
                            sucursales s ON c.Id_sucursal = s.Id_sucursal
                        LEFT JOIN 
                            usuarios u ON c.Id_usuario = u.Id_usuario
                        WHERE 
                            c.faltaPagar > 0
                        ORDER BY 
                            c.FechaRegistro DESC`,(error,results)=> {
                                if (error) throw error
                                res.json(results)
                            })
}


//SALDOS AVELLANEDA Y SANN MARTIN
const verSaldoAvellaneda = (req,res) => {
    connection.query('SELECT SUM(faltaPagar) AS saldo_avellaneda FROM compra WHERE Id_sucursal = 1 AND faltaPagar > 0',(error,results)=> {
        if(error) throw error
        res.json(results)
    })
}

const verSaldoSanMartin = (req,res) => {
    connection.query('SELECT SUM(faltaPagar) AS saldo_sm FROM compra WHERE Id_sucursal = 2 AND faltaPagar > 0',(error,results)=> {
        if(error) throw error
        res.json(results)
    })
}

//CONSULTA PARA VER CUENTAS PAGADAS
const verCuentasPagadas = (req,res) => {
    connection.query(`SELECT 
                        c.Id_compra,
                        c.totalCompra,
                        c.FechaRegistro,
                        p.nombre_proveedor,
                        s.nombre_sucursal,
                        u.nombre_usuario
                        FROM compra c
                        LEFT JOIN proveedores p ON c.Id_proveedor = p.Id_proveedor
                        LEFT JOIN sucursales s ON c.Id_sucursal = s.Id_sucursal
                        LEFT JOIN usuarios u ON c.Id_usuario = u.Id_usuario
                        WHERE c.estado_compra = 'pagada'`,(error,results)=> {
                            if (error) throw error
                            res.json(results)
                        })
}

//TOTAL DE CUENTAS PAGADAS
const verTotalCuentasPagadas = (req,res) => {
    connection.query(`SELECT COUNT(*) AS total_compras_pagadas FROM compra WHERE estado_compra = 'pagada'`,(error,results)=>{
        if(error) throw error
        res.json(results)
    })
}




module.exports = {verComprasCanceladas,verDetalleCompraCancelada,verMontoTotalesCompras,verCuentasAPagar,verdetalleCuentasAPagar,verSaldoAvellaneda,verSaldoSanMartin,verCuentasPagadas,verTotalCuentasPagadas}