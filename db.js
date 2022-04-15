require('dotenv').config();
const {Client} = require('pg')
const { Sequelize } = require("sequelize");


const client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOSTNAME,
    port: process.env.PORT,
    database: process.env.DB_NAME
})


module.exports = client;

// user: "csye6225",
// password: "Coco1234",
// host: "csye6225.capgwuekxrqq.us-east-1.rds.amazonaws.com",
// port: "5432",
// database: "cloud_database"