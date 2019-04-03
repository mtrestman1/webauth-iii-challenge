const express = require('express');
const helmet = require('helmet');


const authRouter = require('../auth/auth-router');


const server = express();

server.use(helmet());
server.use(express.json());



server.use('/api', authRouter);

server.get('/', (req, res) => {
  res.send("It's working");
});

module.exports = server;