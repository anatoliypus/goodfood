import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import sendIngredient from '../../database/sendIngredient.js'

const __dirname = path.resolve()
const parseProductsFileName = 'parsers/eda/parseEdaProducts.py'
const parseProductCardFileName = 'parsers/eda/parseEdaProductCard.py'
const tempFile = 'parsers/eda/temp.txt'
const url = 'https://eda.ru/recepty'
const pageLimit = 1

// главная функция для парса с Eda.ru
async function parseEda(connection) {
    let i = 1
    // цикл по страницам с рецептами
    while (true) {
        const pageUrl = url + '?page=' + i // шаблон для получения ссылки на запрос с query параметром
        if (pageLimit && i > pageLimit) break
        ++i

        const productsFromPage = await getProducts(pageUrl) // возвращает коллекцию с рецептами на странице
        if (!productsFromPage) break

        // цикл по рецептам в полученной коллекции
        for (let product of productsFromPage) {
            const productCard = await getProductCard(product.url) // получает объект с рецептом
            sendIngredient(connection, { ...product, ...productCard }) // отправляет полученный рецепт в базу
        }
    }

    // удаляет временный файл
    fs.unlink(path.join(__dirname, tempFile), (e) => {
        if (e) throw e
    })
}

// получает объект с рецептом
async function getProductCard(url) {
    const productCardQuery = await axios.get(url)
    const html = productCardQuery.data
    const productCardJSON = await processProductCard(html, tempFile)
    const productCard = JSON.parse(productCardJSON)
    return productCard
}

// возвращает коллекцию с рецептами на странице
async function getProducts(url) {
    try {
        const response = await axios.get(url)
        const data = response.data
        const result = await processAllProducts(data, tempFile)
        const productsFromPage = JSON.parse(result)
        return productsFromPage
    } catch (e) {
        return null
    }
}

// создает процесс с питоном, парсит страницу с продуктами
function processAllProducts(data, tempFileName) {
    fs.writeFile(path.join(__dirname, tempFileName), data, (e) => {
        if (e) throw e
    })
    const python = spawn('python', [parseProductsFileName, tempFileName])
    return new Promise((resolve) => {
        python.stdout.on('data', (res) => {
            resolve(res.toString())
        })
    })
}

// создает процесс с питоном, парсит карточку продукта
function processProductCard(data, tempFileName) {
    fs.writeFile(path.join(__dirname, tempFileName), data, (e) => {
        if (e) throw e
    })
    const python = spawn('python', [parseProductCardFileName, tempFileName])
    return new Promise((resolve) => {
        python.stdout.on('data', (res) => {
            resolve(res.toString())
        })
    })
}

export default parseEda
