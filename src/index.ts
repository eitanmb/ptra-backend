require('dotenv').config();
import { Server } from './models/Server.model';

const server = new Server();

server.listen();