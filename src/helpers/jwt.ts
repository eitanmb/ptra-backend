import * as jwt from 'jsonwebtoken';
import { updateUserRefreshToken } from '../database/db.operations';
import { IUser, ITokens } from '../types/types';
import express from 'express';



const SECRET_SEED: string | undefined = process.env.SECRET_SEED;

export const generateJWT = ( uid='', firstName='', exp='15s'): Promise<string | undefined> => {

    return new Promise( (resolve, reject) => {
        
        const payload:jwt.JwtPayload = { uid, firstName };

        if(!SECRET_SEED) throw new Error("La clave privada no existe");

        jwt.sign( payload, SECRET_SEED, {
            expiresIn:exp
        }, ( error, token ) => {
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
     const accessToken:string | undefined= await generateJWT( user._id, user.firstName, '30s' );
     const refreshToken:string | undefined = await generateJWT( user._id, user.firstName, '1d' );

     if(!refreshToken) throw new Error("No existe el Token");
     res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });

     updateUserRefreshToken( user, refreshToken );

     if(!accessToken) throw new Error("No existe el Token");

     return {
        accessToken,
        refreshToken
     }
}

export const verificarToken = function( token: string ): Promise<jwt.JwtPayload> {

    if(!SECRET_SEED) throw new Error("La clave privada no existe");

    return new Promise((resolve, reject) => {
        jwt.verify( token, SECRET_SEED, (err, decoded ) => {
            
            if (err) reject(err);
            resolve(<jwt.JwtPayload>decoded);
          }
        )
    });
}

