/* eslint-disable no-undef */
const mysql= require ('mysql2')

const connection = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'Lucho2010',
        database: 'chupitos',
    }
)

module.exports = {connection}