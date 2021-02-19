import express from 'express'
import chalk from 'chalk'
import { processAllProducts, processProductCard } from './parsers/edaParser.js'
import checkEdaRAmount from './parsers/checkEdaRAmount.js'
import mysql from 'mysql'
import axios from 'axios'
import sendIngredient from './database/sendIngredient.js'
import clearIngredients from './database/clearIngredients.js'

const PORT = process.env.PORT || 5000
const app = express()

app.set('views', 'public')
app.set('view engine', 'ejs')

app.get('/api/parse', async (req, res) => {
    res.send('Parsing started')

    const pagesAmount = 2 // кол-во страниц для парсинга
    const tempFile = 'parsers/temp.txt'
    const url = 'https://eda.ru/recepty'

    const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)
    connection.connect((e) => {
        if (e) throw e
    })

    clearIngredients(connection)

    for (let i = 1; i <= pagesAmount; i++) {
        const response = await axios.get(url + '?page=' + i)
        const data = response.data
        const result = await processAllProducts(data, tempFile)
        const productsFromPage = JSON.parse(result)
        for (let product of productsFromPage) {
            const productCardQuery = await axios.get(product.url)
            const html = productCardQuery.data
            const productCardJSON = await processProductCard(html, tempFile)
            const productCard = JSON.parse(productCardJSON)
            sendIngredient(connection, product, productCard)
        }
    }

    console.log(chalk.green('Parsing done'))
})

app.get('/api/get', (req, res) => {
    const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)
    connection.connect((e) => {
        if (e) throw e
    })
    connection.query('SELECT * FROM recipes', (e, data) => {
        if (e) throw e
        res.send(data)
    })
})

app.get('/api/check', async (req, res) => {
    const data = await checkEdaRAmount()
    res.send(data)
})

app.get('/test', (req, res) => {
    res.send(JSON.stringify(req.query))
})

app.listen(PORT, () => {
    console.log(chalk.yellow('Server has been started...'))
})
