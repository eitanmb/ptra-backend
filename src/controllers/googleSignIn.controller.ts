import express from 'express';

import { createDeployTokens } from '../helpers/jwt';
import { User } from '../models/Users.model';
import googleVerify from '../helpers/googleVerify';


export const googleSignIn = async( req:express.Request, res:express.Response ) => {
    const { id_token } = req.body;
    const { firstName, lastName, email } = await googleVerify( id_token );
    let user = await User.findOne({ email });

    try {
        if(!user) {
            user = new User({
                firstName,
                lastName,
                email,
                password:'111111',
                google: true
            });
            await user.save();
        }

        if(!user.status) {
            return res.status(401).json({
                ok:false,
                msg:'No pudo ingresar, por favor comuníquese con el administrador'
            });
        }
        
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