require('dotenv').config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { credentials } from './middlewares/credentials';
import { dbConnection } from './config/db';
import { options } from './config/corsConfig';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
  } from 'apollo-server-core';


async function startRestGraphQLServer() {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer }),
          ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
      });
   
      
    await server.start();
    
    app.use(credentials);
    app.use(cors(options));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(cookieParser());
    
    server.applyMiddleware({ app });

    const paths = {
      auth: '/api/auth',
      google: '/api/google',
      register: '/api/new',
      refreshToken: '/api/refresh',
      logout: '/api/logout',
      user: '/api/user'
    }

    app.use(paths.auth, require('./routes/auth.routes'));
    app.use(paths.google, require('./routes/googleSignIn.routes'));
    app.use(paths.register, require('./routes/newUser.routes'));
    app.use(paths.refreshToken, require('./routes/refreshToken.routes'));
    app.use(paths.logout, require('./routes/logout.routes'));
    app.use(paths.user, require('./routes/user.routes'));

    const PTRA_CNN = process.env.PTRA_CNN;
    
    async function ptraConnection() {
      if (!PTRA_CNN) {
        process.exit(1);
      }
      await dbConnection(PTRA_CNN);
    }
    
    ptraConnection();
    
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Escuchando el puerto ${PORT}`);
    });
}


startRestGraphQLServer();
