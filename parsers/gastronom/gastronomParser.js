import { spawn } from 'child_process'

const parserFileName = 'parsers/gastronom/parser.py'
const tempFileName = 'parsers/gastronom/temp.txt'

export function parseGastronom(pagesNumber) {
    return new Promise((resolve) => {
        const python = spawn('python', [
            parserFileName,
            pagesNumber,
            tempFileName,
        ])
        python.on('exit', () => {
            resolve('Python code done!')
        })
    })
}
