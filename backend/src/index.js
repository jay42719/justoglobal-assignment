'use strict';

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const {
    mongodbDatabase
} = require('./database');
const {
    userRouter
} = require('./router');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(['/status'], (req, res) => {
    res.send({
        status: 'OK'
    });
});

app.use('/api/user', userRouter);

app.listen(PORT, async (error) => {
    if (!error) {
        console.log(`Server is Successfully Running, and App is listening on port ${PORT}`);
        await mongodbDatabase();
    } else {
        console.log("Error occurred, server can't start", error);
    }
});