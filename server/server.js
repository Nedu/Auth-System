const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');

const server = express();

mongoose.connect(`mongodb://localhost/auth`).then(conn => {
    console.log(`\n=== Successfully connected to database ==\n`);
}).catch(err => {
    console.log(`\n=== Error connecting to database: ${err} ===\n`)
});

server.use(helmet());
server.use(morgan('dev'));
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.json({ api: 'up and running!' });
});

server.listen(5000, () => console.log(`\n=== API running on port ${5000} ===\n`));