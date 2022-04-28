const res = require('express/lib/response');
import jwt from 'jsonwebtoken';
import { updateUserRefreshToken } from '../database/db.operations';
import { IUser } from '../types/types';
import express from 'express';

interface ITokens {
    accessToken: string | undefined,
    refreshToken: string | undefined
}


export const generateJWT = ( uid='', firstName='', exp='15s'): Promise<string | undefined> => {

    return new Promise( (resolve, reject) => {
        
        const payload = { uid, firstName };

        jwt.sign( payload, process.env.SECRET_SEED || "", {
            expiresIn:exp
        }, ( error, token:string|undefined ) => {
            if(error) {
                console.log(error);
                reject('No pudo generarse el token');
            } else {
                resolve(token);
            }
        });

    });
}

export const createDeployTokens = async function( user:IUser, res:express.Response ): Promise<ITokens> {

     // Create accesToken and refreshToken
     const accessToken:string | undefined= await generateJWT( user._id, user.firstName, '15s' );
     const refreshToken:string | undefined = await generateJWT( user._id, user.firstName, '1d' );

     //Sending the refreshToken
     res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });

     //Actualizar refreshToken del usuiario en la db
     updateUserRefreshToken( user, refreshToken as string );

     return {
        accessToken,
        refreshToken
     }
}
