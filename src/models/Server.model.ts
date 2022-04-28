import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import  { dbConnection}  from '../database/config.db';
import { options } from '../middlewares/corsConfig';

interface IServer {
    app: express.Application,
    port: string | undefined,
    paths: {
        auth: string,
        user: string
    }
    ptraConnection: () => void,
    middlewares: () => void,
    routes: () => void,
    listen: () => void


}

export class Server implements IServer{
        
        public app;
        public port;
        public paths;
       

        constructor( ) {

            this.app = express();
            this.port = process.env.PORT;
            this.paths = {
                auth: '/api/auth',
                user: '/api/user'
            }

            this.ptraConnection();
            this.middlewares(); 
            this.routes();
            
        }

        //Ptra DB connection
        async ptraConnection() {
            await dbConnection( process.env.PTRA_CNN );
        }

        //Midlewares
        middlewares() {
            //CORS
            this.app.use( cors(options) );

            //carpeta publica
            this.app.use( express.static('public') );

            //lectura Parseo Json
            this.app.use( express.json() );

            //Cookie parser
            this.app.use( cookieParser() );
        }

        //rutas
        routes() {

            this.app.use( this.paths.auth, require('../routes/auth.routes'));
            this.app.use( this.paths.user, require('../routes/user.routes'));
        }

        listen() {

            this.app.listen( this.port, () => {
                console.log(`Escuchando el puerto ${ this.port }`);
            });
        }

}
