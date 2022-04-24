require('dotenv').config();
const Server = require('./models/Server.model.js');

const server = new Server();

server.listen();