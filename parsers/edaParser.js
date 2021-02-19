import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
const parseProductsFileName = 'parsers/parseEdaProducts.py'
const parseProductCardFileName = 'parsers/parseEdaProductCard.py'

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

export { processAllProducts, processProductCard }
