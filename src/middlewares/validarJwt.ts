import express from 'express';
import { verificarToken } from '../helpers/jwt';

const validarJwt = async(req: express.Request, res:express.Response, next:express.NextFunction ) => {
    
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.sendStatus(403);
    }
    
    let token;
    if (authHeader.toLowerCase().startsWith('bearer')) {
        token = authHeader.slice('bearer'.length).trim();
    }
    else {
        token = authHeader;
    }
    
    const SECRET_SEED: string | undefined = process.env.SECRET_SEED;
    
    if(!SECRET_SEED) throw new Error("La clave privada no existe");

    try {
        const decoded = await verificarToken(token);
        req.uid = decoded.uid;
        req.firstName = decoded.firstName;
        next();

    } catch(err) {
        res.sendStatus(403)
    }    
    
};


export default validarJwt;