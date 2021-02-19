import config from './config.js'

export default function clearIngredients(connection) {
    connection.query(`DELETE FROM ${config.tableName}`, (e) => {
        if (e) throw new Error()
    })
}
