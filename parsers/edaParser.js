import axios from 'axios';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const url = 'https://eda.ru/recepty';
const pagesAmount = 1; // кол-во страниц для парсинга
const tempFile = 'parsers/temp.txt';
const __dirname = path.resolve();
const parseProductsFileName = 'parsers/parseEdaProducts.py';
const parseProductCardFileName = 'parsers/parseEdaProductCard.py';

export default async function getEdaRuRecepies() {
    let collection = [];

    // проходит по страницам с продуктами
    for (let i = 1; i <= pagesAmount; i++) {
        const response = await axios.get(url + '?page=' + i);
        const data = response.data;
        const result = await processAllProducts(data);
        collection = collection.concat(JSON.parse(result))
    }

    console.log(chalk.green('Succesfully parsed all products, parsing ingredients...'));

    // проходит по всем полученным продуктам, достает ингредиенты и шаги по приготовлению
    for (let i = 0; i < collection.length; i++) {
        const el = {
            ...collection[i]
        };
        const response = await axios.get('https://eda.ru'+ el.url);
        const data = response.data;
        const result = await processProductCard(data);
        collection[i] = {
            ...el, 
            ...JSON.parse(result)
        }
    }

    fs.unlink(path.join(__dirname, tempFile), (e) => {
        if (e) throw new Error;
    });

    console.log(chalk.green('Parsing done!'));

    return collection
}

// создает процесс с питоном, парсит страницу с продуктами
async function processAllProducts(data) {
    fs.writeFile(path.join(__dirname, tempFile), data, (e) => {
        if (e) throw new Error;
    });
    const python = spawn('python', [parseProductsFileName, tempFile]);
    return await new Promise((resolve) => {
        python.stdout.on('data', (res) => {
            resolve(res.toString());
        })
    });
}

// создает процесс с питоном, парсит карточку продукта
async function processProductCard(data) {
    fs.writeFile(path.join(__dirname, tempFile), data, (e) => {
        if (e) throw new Error;
    });
    const python = spawn('python', [parseProductCardFileName, tempFile]);
    return await new Promise((resolve) => {
        python.stdout.on('data', (res) => {
            resolve(res.toString());
        })
    });
}