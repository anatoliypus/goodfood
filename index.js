import express from 'express';
import path from 'path';
import {spawn} from 'child_process';
import getEdaRuRecepies from './edaParser.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.set('views', 'public');
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const data = await getEdaRuRecepies();
    res.render('parsed', {json: JSON.stringify(data)});
});

app.get('/test', (req, res) => {
    res.send(JSON.stringify(req.query));
});

app.listen(PORT, () => {
    console.log('Server has been started...');
});