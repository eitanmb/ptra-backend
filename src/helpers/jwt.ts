import jwt from 'jsonwebtoken';
import { updateUserRefreshToken } from '../database/db.operations';
import { IUser } from '../types/types';
import express from 'express';

interface ITokens {
    accessToken: string | undefined,
    refreshToken: string | undefined
}

interface ITokenPayload {
    uid: string,
    firstName: string
}

const SECRET_SEED: string | undefined = process.env.SECRET_SEED;

export const generateJWT = ( uid='', firstName='', exp='15s'): Promise<string | undefined> => {

    return new Promise( (resolve, reject) => {
        
        const payload:ITokenPayload = { uid, firstName };

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
     const accessToken:string | undefined= await generateJWT( user._id, user.firstName, '15s' );
     const refreshToken:string | undefined = await generateJWT( user._id, user.firstName, '1d' );

     //Sending the refreshToken
     if(!refreshToken) throw new Error("No existe el Token");
     res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });

     //Actualizar refreshToken del usuiario en la db
     updateUserRefreshToken( user, refreshToken );

     if(!accessToken) throw new Error("No existe el Token");

     return {
        accessToken,
        refreshToken
     }
}

export const verificarToken = function( token: string ): Promise<ITokenPayload> {

    if(!SECRET_SEED) throw new Error("La clave privada no existe");

    return new Promise((resolve, reject) => {
        jwt.verify( token, SECRET_SEED, (err, decoded ) => {
            
            if (err) return reject(err);

            resolve(<ITokenPayload>decoded);
          }
        )
    });
}

