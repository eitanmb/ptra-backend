import bcryptjs from 'bcryptjs';
import express from 'express';

import { createDeployTokens } from '../helpers/jwt';
import { User } from '../models/Users.model';

export const auth = async( req:express.Request, res:express.Response ) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne( { email });
        if( !user ) {
            return res.status(400).json({
                ok:false,
                msg:'No existe el usuario'
            });
        }
        
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            });
        }

        const tokens = await createDeployTokens( user, res );
        if(!tokens) throw new Error("La operacion de generacion de tokens ha fallado");
        const { accessToken } = tokens;
        
        res.json({
            ok:true,
            msg:'Login by email',
            uid: user._id,
            name: user.firstName,
            accessToken
        });

    } catch (error) {
        throw new Error("No pudo vericarse el usuario");
    }
    
}