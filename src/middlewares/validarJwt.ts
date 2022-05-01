import jwt from 'jsonwebtoken';
import express from 'express';


const validarJwt = (req: express.Request, res:express.Response, next:express.NextFunction ) => {
    
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.sendStatus(401);
    }
    console.log(authHeader);
    // remove Bearer if using Bearer Authorization mechanism
    let token;
    if (authHeader.toLowerCase().startsWith('bearer')) {
        token = authHeader.slice('bearer'.length).trim();
    }
    else {
        token = authHeader;
    }
    
    const SECRET_SEED: string | undefined = process.env.SECRET_SEED;
    
    if(!SECRET_SEED) throw new Error("La clave privada no existe");

    jwt.verify(token, SECRET_SEED, (err: any, decoded:any) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.uid = decoded.uid;
        req.firstName = decoded.firstName;
        next();
    });
};


export default validarJwt;