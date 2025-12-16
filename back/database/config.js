/* eslint-disable no-undef */
const mysql= require ('mysql2')

const connection = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'Lola2201',
        database: 'dbjuanakiosco',
    }
)

module.exports = {connection}