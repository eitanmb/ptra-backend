import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { dbConnection } from '../database/config.db';
import { options } from '../middlewares/corsConfig';

interface IServer {
    app: express.Application,
    PORT: string | undefined,
    PTRA_CNN: string | undefined,
    paths: {
        auth: string,
        google: string,
        logout: string,
        register: string,
        renovarToken: string,
        user: string
    }
    ptraConnection: () => void,
    middlewares: () => void,
    routes: () => void,
    listen: () => void
}

export class Server implements IServer {

    public app: express.Application;
    public PORT: string | undefined;
    public paths: { auth: string, google: string, logout: string, register: string, renovarToken: string, user: string };
    public PTRA_CNN: string | undefined;

    constructor() {

        this.app = express();
        this.PORT = process.env.PORT;
        this.PTRA_CNN = process.env.PTRA_CNN;
        this.paths = {
            auth: '/api/auth',
            google: '/api/google',
            logout: '/api/logout',
            register: '/api/new',
            renovarToken: '/api/renovar',
            user: '/api/user'
        }

        this.ptraConnection();
        this.middlewares();
        this.routes();

    }

    async ptraConnection() {
        if (!this.PTRA_CNN) {
            process.exit(1);
        }
        await dbConnection(this.PTRA_CNN);
    }

    middlewares(): void {
        this.app.use(cors(options));
        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    routes(): void {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.google, require('../routes/googleSignIn.routes'));
        this.app.use(this.paths.logout, require('../routes/logout.routes'));
        this.app.use(this.paths.register, require('../routes/newUser.routes'));
        this.app.use(this.paths.renovarToken, require('../routes/renovarToken.routes'));
        this.app.use(this.paths.user, require('../routes/user.routes'));
    }

    listen(): void {

        this.app.listen(this.PORT, () => {
            console.log(`Escuchando el puerto ${this.PORT}`);
        });
    }

}
