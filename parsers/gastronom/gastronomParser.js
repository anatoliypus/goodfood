import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import sendIngredient from '../../database/sendIngredient.js'

const parserFileName = 'parsers/gastronom/parser.py'
const tempFileName = 'parsers/gastronom/temp.txt'

export async function parseGastronom(connection, pagesNumber) {
    return new Promise((resolve) => {
        // const python = spawn('python', [
        //     parserFileName,
        //     pagesNumber,
        //     tempFileName,
        // ])
        // python.on('exit', () => {
        //     // console.log('writed file')
        //     fs.readFile(tempFileName, (e, data) => {
        //         if (e) throw e
        //         const json = JSON.parse(data.toString())
        //         for (let el of json.list) {
        //             sendIngredient(connection, el)
        //         }
        //         resolve()
        //     })
        // })

        // python.stdout.on('data', (data) => {
        //     console.log('вывод питона ' + data)
        // })
        // python.stderr.on('', (err) => console.log(err))

        fs.readFile(tempFileName, (e, data) => {
            if (e) throw e
            const json = JSON.parse(data.toString())
            for (let el of json.list) {
                sendIngredient(connection, el)
            }
            resolve()
        })
    })
}
