import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import sendIngredient from '../database/sendIngredient.js'
import clearIngredients from '../database/clearIngredients.js'

const __dirname = path.resolve()
const parseProductsFileName = 'parsers/parseEdaProducts.py'
const parseProductCardFileName = 'parsers/parseEdaProductCard.py'
const pagesAmount = 1 // кол-во страниц для парсинга
const tempFile = 'parsers/temp.txt'
const url = 'https://eda.ru/recepty'

async function parseEda(connection) {
    clearIngredients(connection)
    for (let i = 1; i <= pagesAmount; i++) {
        const pageUrl = url + '?page=' + i
        const productsFromPage = await getProducts(pageUrl)
        for (let product of productsFromPage) {
            const productCard = await getProductCard(product.url)
            sendIngredient(connection, product, productCard)
        }
    }

    fs.unlink(path.join(__dirname, tempFile), (e) => {
        if (e) throw e
    })
}

async function getProductCard(url) {
    const productCardQuery = await axios.get(url)
    const html = productCardQuery.data
    const productCardJSON = await processProductCard(html, tempFile)
    const productCard = JSON.parse(productCardJSON)
    return productCard
}

async function getProducts(url) {
    const response = await axios.get(url)
    const data = response.data
    const result = await processAllProducts(data, tempFile)
    const productsFromPage = JSON.parse(result)
    return productsFromPage
}

// создает процесс с питоном, парсит страницу с продуктами
async function processAllProducts(data, tempFileName) {
    fs.writeFile(path.join(__dirname, tempFileName), data, (e) => {
        if (e) throw e
    })
    const python = spawn('python', [parseProductsFileName, tempFileName])
    return await new Promise((resolve) => {
        python.stdout.on('data', (res) => {
            resolve(res.toString())
        })
    })
}

// создает процесс с питоном, парсит карточку продукта
async function processProductCard(data, tempFileName) {
    fs.writeFile(path.join(__dirname, tempFileName), data, (e) => {
        if (e) throw e
    })
    const python = spawn('python', [parseProductCardFileName, tempFileName])
    return await new Promise((resolve) => {
        python.stdout.on('data', (res) => {
            resolve(res.toString())
        })
    })
}

export default parseEda
