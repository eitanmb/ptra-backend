require('dotenv').config();
import { startApolloServer } from './models/apolloServer';
import { Server } from './models/Server.model';
import { typeDef } from './graphql/typeDef';
import { resolvers } from './graphql/resolvers';

const restServer = new Server();
startApolloServer(typeDef, resolvers)

restServer.listen();