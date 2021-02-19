import mysql from 'mysql'

export default function connect() {
    const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)
    connection.connect((e) => {
        if (e) throw e
    })
    return connection
}
