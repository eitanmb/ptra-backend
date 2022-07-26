import express from 'express';

import { generateJWT, verificarToken } from '../helpers/jwt';
import { findUserByRefreshToken } from '../database/db.operations';

export const renovarToken = async( req:express.Request, res:express.Response ) => {
    const cookies = req.cookies;

    if(!cookies?.jwt ) {
        return res.sendStatus(403);
    }
    const refreshToken = cookies.jwt;
    const user = await findUserByRefreshToken( refreshToken );

    if ( !user ) return res.sendStatus(403);
    
    try {
        const decoded = await verificarToken( refreshToken );
        if( user.firstName !== decoded.firstName ) throw new Error("Los usarios no coinciden");
        const accessToken = await generateJWT( decoded.uid, decoded.firstName, '15s' );

        res.status(201).json({
            accessToken
        });

    } catch(err) {
        throw new Error("No pudo vericarse el token");
    }
}