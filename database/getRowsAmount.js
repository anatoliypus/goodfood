import config from './config.js'

export default function getRowsAmount(connection) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT COUNT(*) FROM ${config.tableName}`,
            (e, data) => {
                if (e) reject(e)
                resolve(data['0']['COUNT(*)'])
            }
        )
    })
}
