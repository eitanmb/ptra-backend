import bcryptjs from 'bcryptjs';
import { createDeployTokens, generateJWT } from '../helpers/jwt';
import googleVerify from '../helpers/googleVerify';
import { createNewUser, findUserByRefreshToken } from '../database/db.operations';
import jwt from 'jsonwebtoken';
import express from 'express';
import { IUser } from '../types/types';
import {User} from '../models/Users.model';


export const newUser = async( req: express.Request, res:express.Response ) => {

    try {

        //registrar nuevo usuario en db
        const user:IUser = await createNewUser( req.body );

        //Crear Tokens
        const { accessToken } = await createDeployTokens( user, res );
        
        return res.status(201).json({
            ok:true,
            user,
            accessToken
        });

        
    } catch (error) {
        return res.status(400).json({
            ok:false,
            msg: 'No pudo registrarse el usuario. Comuníquese con el administrador'
        });
    }

}

export const loginByEmail = async( req:express.Request, res:express.Response ) => {

    const { email, password } = req.body;

    try {
        
        const user = await User.findOne( { email });

        //comparar el password del request con el que figura en la bbdd
        if( !user ) {
            return res.status(400).json({
                ok:false,
                msg:'No existe el usuario'
            });
        }

        //comparar las passwords
        const validPassword = bcryptjs.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            });
        }

        //Crear Tokens
        const { accessToken } = await createDeployTokens( user, res );
        
        //Sending the accessToken to the frontend developer
        res.json({
            ok:true,
            msg:'Login by email',
            uid: user._id,
            name: user.firstName,
            accessToken
        });

    } catch (error) {
        
    }
    
}

export const googleSignIn = async( req:express.Request, res:express.Response ) => {

    const { id_token } = req.body;

    try {
        
        const { firstName, lastName, email } = await googleVerify( id_token );

        //Si el usuario no existe, se registra en el db, utilizando los datos extraidos del token de google
        let user = await User.findOne({ email });

        if( !user ) {

            user = await new User({
                firstName,
                lastName,
                email,
                password:'111111',
                google: true
            });

            await user.save();
        }

        //Si el usuario existe en la db, comprobar que esté activo
        if( !user.status ) {
            return res.status(401).json({
                ok:false,
                msg:'No pudo ingresar, por favor comuníquese con el administrador'
            });
        }

        //Crear Tokens
        const { accessToken } = await createDeployTokens( user, res );
         
        res.json({
            ok:true,
            msg:'Login by Gmail',
            uid: user._id,
            name: user.firstName,
            accessToken
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok:false,
            msg:'El token no pudo ser verificado'
        });
    }

}


export const renovarToken = async( req:express.Request, res:express.Response ) => {

    const cookies = req.cookies;

    if(!cookies?.jwt ) {
        res.sendStatus(403);
    }

    const refreshToken = cookies.jwt;

    const user = await findUserByRefreshToken(refreshToken);

    jwt.verify(refreshToken, process.env.SECRET_SEED as any, 
        
        async(err:any, decoded:any ) => {

            if (!user) return res.sendStatus(403);

            if (err || user.firstName !== decoded.firstName ) {
                
                res.sendStatus(403);
            }

            const accessToken = await generateJWT( decoded.uid, decoded.firstName, '15s' );
            
            res.status(201).json({
                accessToken
            });
        }
    );

}