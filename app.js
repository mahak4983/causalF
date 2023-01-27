const express = require("express");
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to mongodb
mongoose
    .connect(MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        // start the App server
        console.log('connected to mongodb...');
        app.listen(8080, () => console.log(`Listening on port 8080`));
    })
    .catch((err) => {
        // If not connected, exit the process
        console.log('Error while connecting to mongodb: ', err);
        process.exit(1);
    });