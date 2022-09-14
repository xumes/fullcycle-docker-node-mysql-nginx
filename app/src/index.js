const express = require('express')
const fakerJs = require('@faker-js/faker')
const mysql = require('mysql')
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'fullcycle'
}

const faker = fakerJs.faker
const name = faker.name.fullName()

console.log("o nome que eu vou inserir é", name)
const sqlInsert = `INSERT INTO people (name) VALUES ('${name}')`

const mysqlPool = mysql.createPool(config)

mysqlPool.getConnection((err, connection) => {
    if (err) {
        //connection.release()
        console.log("Error getting mysql pool connection" + err)
    }

    connection.query(sqlInsert, () => {
        console.log("registro inserido com sucesso")
    })
    connection.release()
})

const app = express()

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM people'

    console.log(__dirname)

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            //connection.release()
            console.log("Error getting mysql pool connection" + err)
        }
    
        connection.query(sql, (err, result, fields) => {
            if (err) {
                res.status(500).send(err)
            }

            res.sendFile(__dirname + "/index.html");
        })
        connection.release()
    })
})

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})