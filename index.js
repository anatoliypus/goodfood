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
        connection.query(`INSERT INTO ${tableName} (title, url, cook_time, ingredients_amount, steps_arr_json, ingredients_arr_json)
                            VALUES ('${el.title}', '${el.url}', '${el.time}', '${el.ingredientsAmount}', '${JSON.stringify(el.steps)}', '${JSON.stringify(el.ingredients)}')`, (e) => {
            if (e) throw e;
        });
    }
});

app.get('/api/get', (req, res) => {
    res.send('In deevlopment');
    const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
    connection.connect((e) => {
        if (e) throw e
    });
    //make query, create collection and send data
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