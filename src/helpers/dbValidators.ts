import bcryptjs from 'bcryptjs';
import {User} from "../models/Users.model";
import { CustomValidator } from 'express-validator';
import { IsNumericOptions } from 'express-validator/src/options';

export const isValidUser = async(userId ='') => {
   return await User.findById( userId );
}

export const emailExist = async( email='' ) => {
    const existEmail = await User.findOne( { email } );
    
    if( existEmail ) throw new Error(`El usuario con email ${ email }, ya existe`); 
}

export const isActiveUser = async( userId='' ) => {
    const isUser = await isValidUser(userId);

    if (!isUser || !isUser.status) {
        throw new Error('No hay usuraio con ese ID');
    }
}

export const isGoogleUser = async( userId='') => {
    const isUser = await isValidUser(userId);

    if (!isUser) throw new Error('No hay usuraio con ese ID');
    if( isUser.google ) throw new Error(`El usuario con id ${ userId } se registro a través de Google`); 
}

export const havePriviledges:CustomValidator = async( userId:string, { req }): Promise<boolean> => {

    const isUser = await isValidUser(req.uid );

    if (!isUser) throw new Error('El usuario no existe');

    if (isUser.rol === "ADMIN" ) {
        console.log('Es administrador');
        return true;
    }

    if( req.uid !== userId ) throw new Error('El usuario no tiene privilegios');

    return true;

}

export const passwordMatched:CustomValidator = ( confirmPassword:string, { req } ):boolean => {

    if (confirmPassword !== req.body.password) throw new Error('Las claves no coinciden');
    
    return true;
}


export const currentPasswordMatch:CustomValidator = async( currentPassword:string, { req } ):Promise<void> => {
    
    if(!req.params) throw new Error("No existe el parametro de request userId");

    const { userId } = req.params;
    const user = await User.findById( userId );

    if( !user ) throw new Error("El usuario no existe");

    const validPassword = bcryptjs.compareSync( currentPassword, user.password );

    if( !validPassword ) {
        throw new Error('Las claves no coinciden');
    }
}
