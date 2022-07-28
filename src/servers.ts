import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';

import { credentials } from './middlewares/credentials';
import { dbConnection } from './config/db';
import { options } from './config/corsConfig';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';


export default async function startRestGraphQLServer() {
    const app = express();
    const httpServer = http.createServer(app);
    const serverGraphQL = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer }),
          ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
      });
   
      
    await serverGraphQL.start();
    
    app.use(credentials);
    app.use(cors(options));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(cookieParser());
    
    serverGraphQL.applyMiddleware({ app });

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
    
    if (!PTRA_CNN) {
        process.exit(1);
    }
    await dbConnection(PTRA_CNN);
    
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}`);
        
    });
}
