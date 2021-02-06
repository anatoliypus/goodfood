import express from 'express';
import getEdaRuRecepies from './parsers/edaParser.js';
import chalk from 'chalk';
import checkEdaRAmount from './parsers/checkEdaRAmount.js';
import mysql from 'mysql';

const PORT = process.env.PORT || 5000;
const app = express();
const tableName = 'recipes';

app.set('views', 'public');
app.set('view engine', 'ejs');

app.get('/api/parse', async (req, res) => {
    res.send('Parsing started');
    const data = await getEdaRuRecepies();
    const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
    connection.connect((e) => {
        if (e) throw e
    });
    connection.query(`DELETE FROM ${tableName}`);
    for (let el of data) {
        connection.query(`INSERT INTO ${tableName} (title, url, cook_time, ingredients_amount, steps_arr_json, ingredients_arr_json, images_arr_json, categories_arr_json)
                            VALUES ('${el.title}', '${el.url}', '${el.time}', '${el.ingredientsAmount}', '${JSON.stringify(el.steps)}', '${JSON.stringify(el.ingredients)}', '${JSON.stringify(el.images)}', '${JSON.stringify(el.categories)}')`, (e) => {
            if (e) throw e;
        });
    }
});

app.get('/api/get', (req, res) => {
    const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
    connection.connect((e) => {
        if (e) throw e
    });
    connection.query('SELECT * FROM recipes', (e, data) => {
        if (e) throw e;
        res.send(data);
    });
});

app.get('/api/check', async (req, res) => {
    const data = await checkEdaRAmount();
    res.send(data);
});

app.get('/test', (req, res) => {
    res.send(JSON.stringify(req.query));
});

app.listen(PORT, () => {
    console.log(chalk.yellow('Server has been started...'));
});