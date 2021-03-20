import config from './config.js'

export default function getIngredients(connection, findTitle, from, to) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM ${config.tableName}`
        ////////////// limit и offset в sql
        connection.query(sql, (e, data) => {
            if (e) reject(e)
            resolve(data)
        })
    })
}
