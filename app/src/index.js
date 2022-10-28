const express = require('express')
const fakerJs = require('@faker-js/faker')
const mysql = require('mysql')
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'fullcycle'
}
const createTable = `CREATE TABLE IF NOT EXISTS people(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL) ENGINE=INNODB;`

const faker = fakerJs.faker
const name = faker.name.fullName()

console.log("o nome que eu vou inserir é", name)
const sqlInsert = `INSERT INTO people (name) VALUES ('${name}');`

const mysqlPool = mysql.createPool(config)

mysqlPool.getConnection((err, connection) => {
    if (err) {
        //connection.release()
        console.log("Error getting mysql pool connection" + err)
    }

    connection.query(createTable, () => {
        connection.query(sqlInsert, () => {
            console.log("registro inserido com sucesso")
        })
    })

    connection.release()
})

const app = express()

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM people;'

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

            console.log("result", result)

            res.send(buildHtml(result));
        })
        connection.release()
    })
})

const buildHtml = (data) => {

    const lineItems = data.map(d => {
        console.log(`item: ${d}`)
        return `<li>${d.name}</li>`
    })
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fullcycle</title>
        </head>
        <body>
                <h1>Full Cycle Rocks!</h1>
        
                <ul>${lineItems}</ul>
        
        </body>
        </html>
    `
}

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})