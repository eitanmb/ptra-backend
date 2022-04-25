const { response } = require('express');
const User = require('../models/Users.model');
const bcryptjs = require('bcryptjs');
const generateJWT = require('../helpers/jwt');
const googleVerify = require('../helpers/googleVerify');
const encriptarPassword = require('../helpers/encriptarPassword');


const newUser = async( req, res=response ) => {

    try {

        const { password } = req.body;
       
        const user = new User( req.body );

        //encryptar contraseña
        user.password = encriptarPassword( password );

        //registrar nuevo usuario en db
        await user.save();

        //Crear el JWT
        const token = await generateJWT( user._id, user.firstName, '15s' );
        
        return res.status(201).json({
            ok:true,
            user,
            token
        });

        
    } catch (error) {
        return res.status(400).json({
            ok:false,
            msg: 'No pudo registrarse el usuario. Comuníquese con el administrador'
        });
    }

}

const loginByEmail = async(req, res=response) => {

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

        // Create accesToken and refreshToken
        const accesToken = await generateJWT( user._id, user.firstName, '15s' );
        const refreshToken = await generateJWT( user._id, user.firstName, '1d' );

        //Sending the refreshToken
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });
        
        //Sending the accessToken to the frontend developer
        res.json({
            ok:true,
            msg:'Login by email',
            uid: user._id,
            name: user.firstName,
            accesToken
        });

    } catch (error) {
        
    }
    
}

const googleSignIn = async(req, res=response) => {

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

         // Create accesToken and refreshToken
         const accesToken = await generateJWT( user._id, user.firstName, '15s' );
         const refreshToken = await generateJWT( user._id, user.firstName, '1d' );
 
         //Sending the refreshToken
         res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });
         
        res.json({
            ok:true,
            msg:'Login by Gmail',
            uid: user._id,
            name: user.firstName,
            accesToken
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok:false,
            msg:'El token no pudo ser verificado'
        });
    }

}

const renewJWT = async(req, res=response) => {

    try {
        
        const { uid, firstName:name } = req;
        console.log(uid, name);
        
         // Create accesToken and refreshToken
         const accesToken = await generateJWT( user._id, user.firstName, '15s' );
         const refreshToken = await generateJWT( user._id, user.firstName, '1d' );
 
         //Sending the refreshToken
         res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });
         
        
        res.json({
            ok: true,
            accesToken,
            uid,
            name
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'No pudo renovarse el token'
        });
    }

}


module.exports = {
    loginByEmail,
    googleSignIn,
    newUser,
    renewJWT
}