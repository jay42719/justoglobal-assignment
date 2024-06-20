'use strict';

const mongoose = require('mongoose');

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL || 'mongodb://127.0.0.1:27017/just_global_test';

module.exports = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(MONGODB_CONNECTION_URL).then(() => {
            console.log(`Mongodb connection is successfully done`);
            return resolve(true);
        }).catch((err) => {
            console.error(`Mongodb error`, err);
            return reject(err);
        });
    });
};