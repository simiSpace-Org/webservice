const express = require("express");
const app = require('./app');

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}.`);
});


