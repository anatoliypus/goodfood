import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(1);
    res.sendFile('index');
})

app.listen(PORT, () => {
    console.log('Server has been started...');
})