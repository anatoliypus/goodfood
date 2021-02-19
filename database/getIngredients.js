import config from './config.js'

export default function getIngredients(connection) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${config.tableName}`, (e, data) => {
            if (e) reject(e)
            resolve(data)
        })
    })
}
