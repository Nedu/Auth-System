const express = require('express');
const mongoose = require('mongoose');
const server = express();

const setupMiddleware = require('./config/middleware')(server);

mongoose.connect(`mongodb://localhost/auth`).then(conn => {
    console.log(`\n=== Successfully connected to database ==\n`);
}).catch(err => {
    console.log(`\n=== Error connecting to database: ${err} ===\n`)
});

server.get('/', (req, res) => {
    res.json({ api: 'up and running!' });
});

server.listen(5000, () => console.log(`\n=== API running on port ${5000} ===\n`));