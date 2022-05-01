"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const Server_model_1 = require("./models/Server.model");
const server = new Server_model_1.Server();
server.listen();
