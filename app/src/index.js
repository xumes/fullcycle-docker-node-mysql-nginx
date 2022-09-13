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
        console.log("terminei de inserrir, uha")
    })
    console.log("pronto, agora vou fechar a conexao com o banco")
    connection.release()
})

const app = express()

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM people'

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            //connection.release()
            console.log("Error getting mysql pool connection" + err)
        }
    
        connection.query(sql, (err, result, fields) => {
            if (err) {
                res.status(500).send(err)
            }
    
            res.status(200).send(result)
        })
        console.log("pronto, agora vou fechar a conexao com o banco")
        connection.release()
    })
    // res.send(sql)
})

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})