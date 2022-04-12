const express = require('express');
const app = express();


const {
    createUser,
    updateUser,
    viewUser,
    addProfilePic,
    getProfilePic,
    deleteProfilePic
} = require("./controllers/index");


const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const multer = require('multer')
const upload = multer({ dest: 'images/' })

const SDC = require('statsd-client');
sdc = new SDC({host: 'localhost', port: 8125});
const logger = require('./logger');

const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

//Routes
app.post("/v1/user", createUser);
app.put("/v1/user/self", updateUser);
app.get("/v1/user/self", viewUser);

app.post('/v1/user/self/pic', upload.single('profilePic') ,addProfilePic);
app.get('/v1/user/self/pic',getProfilePic);

app.delete('/v1/user/self/pic',deleteProfilePic);



app.get("/healthzz", (req, res) => {
    try {
        res.sendStatus(200);
        logger.info('Health Check');
        sdc.increment('health_check');
    } catch (err) {
        res.json(err.message);

    }
});

app.get('*', function (req, res) {
    res.status(404).json("Page not found!")
});



  

module.exports = app;