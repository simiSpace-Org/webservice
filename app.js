const cors = require("cors");
const sequelize = require("./config/db.config");

const User = require("./models/index");

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const userRoute = require('./routers/user');
app.use("/v1", userRoute);


//sync database
const db = require("./models/index");
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  
})


var corsOptions = {
  origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Cloud Assignment application." });
});

//health checkup get api
app.get("/healthz", (req, res) => {
    res.sendStatus(200);
  });

//router calls 
/*const {
    createUser,
    updateUser,
    getUser
} = require("./controllers");

//Routes
app.post("/v1/user", createUser);
app.put("/v1/user/self", updateUser);
app.get("/v1/user/self", getUser);
app.get('*', function (req, res) {
    res.status(404).json("Page not found!")
});
*/

module.exports = app;