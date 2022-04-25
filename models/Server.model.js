const cors = require('cors');
const express = require('express');
const { use } = require('../routes/auth.routes');
const dbConnection = require('../database/config.db');
const cookieParser = require('cookie-parser');

class Server {

        constructor() {

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
            this.app.use( cors() );

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


module.exports = Server;