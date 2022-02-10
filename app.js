const express = require('express');
const app = express();
app.use(express.json());

//GET request 
app.get('/healthz', (req,res) => {
    res.json("server responds with 200 OK if it is healhty.", 200)
 });
 
 app.get('/hoho', (req,res) => {
    res.status(200).send('You made a successful MERRY CHRISTMAS api call');
 });

 app.get('/home', (req,res) => {
    res.send(200).send({
        "id":"1",
        "status": "OK"
    });
});

app.get('/getrequest', (req,res)=>{
    res.status(201).send("Request Created");
});

module.exports = app
