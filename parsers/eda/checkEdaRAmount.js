import axios from 'axios';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempFile = 'parsers/temp.txt';
const __dirname = path.resolve();
const url = 'https://eda.ru/recepty';
const amountParserFileName = 'parsers/parseEdaRAmount.py';

export default async function checkEdaRAmount() {
    const response = await axios.get(url);
    const data = response.data;
    fs.writeFile(path.join(__dirname, tempFile), data, (e) => {
        if (e) throw e;
    });
    const python = spawn('python', [amountParserFileName, tempFile]);
    return await new Promise((resolve) => {
        python.stdout.on('data', (res) => {
            fs.unlink(path.join(__dirname, tempFile), (e) => {
                if (e) throw e
            });
            const amount = res.toString();
            resolve(String(parseInt(amount)));
        })
    });
}