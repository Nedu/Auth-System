const express = require('express');
const mongoose = require('mongoose');
const server = express();

const authRoutes = require('./routes');
const userRoutes = require('./routes/users');
const setupMiddleware = require('./config/middleware')(server);

mongoose.connect(`mongodb://localhost/auth`).then(conn => {
    console.log(`\n=== Successfully connected to database ==\n`);
}).catch(err => {
    console.log(`\n=== Error connecting to database: ${err} ===\n`)
});

server.get('/', (req, res) => {
    res.json({ api: 'up and running!' });
});
server.use('/api', authRoutes);
server.use('/api', userRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n=== API running on port ${port} ===\n`),
);