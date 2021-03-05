import config from './config.js'

const recipeTitle = 'title'

export default function findIngredients(connection, title) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM ${config.tableName} WHERE ${recipeTitle} LIKE '%${title}%'`,
            (e, data) => {
                if (e) reject(e)
                resolve(data)
            }
        )
    })
}
