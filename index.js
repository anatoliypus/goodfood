import express from 'express';
import path from 'path';
import {spawn} from 'child_process';

const PORT = process.env.PORT || 5000;
const app = express();

// app.use(express.static('public'));

app.get('/', (req, res) => {
    // res.sendFile('index');
    const python = spawn('python', ['test.py']);
    python.stdout.on('data', (data) => {
        res.end(data.toString())
    })
})

app.listen(PORT, () => {
    console.log('Server has been started...');
})