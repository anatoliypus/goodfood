import express from 'express'
import chalk from 'chalk'
import parseEda from './parsers/eda/edaParser.js'
import checkEdaRAmount from './parsers/eda/checkEdaRAmount.js'
import connect from './database/connect.js'
import getIngredients from './database/getIngredients.js'
import { parseGastronom } from './parsers/gastronom/gastronomParser.js'
import clearIngredients from './database/clearIngredients.js'

const PORT = process.env.PORT || 5000
const app = express()

app.set('views', 'public')
app.set('view engine', 'ejs')

// api method to parse data
app.get('/api/parse', async (req, res) => {
    res.end('Parsing started')
    console.log(chalk.yellow('\nParsing started'))
    const connection = connect()
    // чистит таблицу в базе
    clearIngredients(connection)
    await parseEda(connection)
    await parseGastronom(connection, 1)
    connection.end()
    console.log(chalk.green('Parsing done\n'))
})

// api method to get recipes json string
app.get('/api/get', async (req, res) => {
    const connection = connect()
    const data = await getIngredients(connection)
    const stringified = JSON.stringify(data)
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
    })
    res.end(stringified)
})

// api method to get current recipes amount on resources
app.get('/api/check', async (req, res) => {
    const data = await checkEdaRAmount()
    res.send(data)
})

app.listen(PORT, () => {
    console.log(chalk.yellow('Server has been started...'))
})
