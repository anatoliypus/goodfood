import express from 'express';
import path from 'path';
import getEdaRuRecepies from './edaParser.js';
import chalk from 'chalk';
import fs from 'fs';

const PORT = process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve();
const dataFile = 'data.txt';

app.set('views', 'public');
app.set('view engine', 'ejs');

app.get('/api/parse', async (req, res) => {
    res.send('Parsing started');
    const data = await getEdaRuRecepies();
    fs.writeFile(path.join(__dirname, dataFile), JSON.stringify(data), (e) => {
        if (e) throw new Error;
    });
});

app.get('/api/get', (req, res) => {
    fs.readFile(path.join(__dirname, dataFile), 'utf-8', (e, data) => {
        if (e) throw new Error;
        res.send(data);
    })
});

app.get('/test', (req, res) => {
    res.send(JSON.stringify(req.query));
});

app.listen(PORT, () => {
    console.log(chalk.yellow('Server has been started...'));
});