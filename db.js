const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password:"Coco@786",
    host: "localhost",
    port: 5432,
    database: "cloud_database"
})

module.exports = pool;