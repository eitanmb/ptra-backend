import bcryptjs from 'bcryptjs';
import {User} from "../models/Users.model";
import { CustomValidator } from 'express-validator';

export const emailExist = async( email='' ) => {
    
    const existEmail = await User.findOne( { email } );

    if ( !existEmail ) throw new Error('No hay usuario con ese email');

    if( existEmail ) {

        throw new Error(`El usuario con email ${ email }, ya existe`); 
    }
}

export const isActiveUser = async( userId='' ) => {
    
    //Determinar si el usuario está activo
    const isActive = await User.findById( userId );

    if (!isActive) throw new Error('No hay usuraio con ese ID');
        
    if(!isActive.status) {
        throw new Error(`El usuario con id ${ userId } no existe`); 
    }
    
}

export const isGoogleUser = async( userId='') => {
    
    const isGoogle = await User.findById( userId );

    if (!isGoogle) throw new Error('No hay usuraio con ese ID');

    //verifica que el usuario no se haya registrado a través de google
    if( isGoogle.google ) { 
        throw new Error(`El usuario con id ${ userId } se registro a través de Google`); 
    }

}

export const havePriviledges:CustomValidator = async( userId:string, { req }): Promise<boolean> => {

    //determinar si el usuario logeado es el mismo que quiere cambiar su profile o si tiene rol de administrador
    const user = await User.findById( req.uid );

    if (!user) throw new Error('El usuario no existe');

    if (user.rol === "ADMIN" ) {

        console.log('Es administrador');
        return true;
    }

    if( req.uid !== userId ){
        throw new Error('El usuario no tiene privilegios');
    }

    return true;

}


export const passwordMatched:CustomValidator = ( confirmPassword:string, { req } ):boolean => {

    if (confirmPassword !== req.body.password) {
      throw new Error('Las claves no coinciden');
    }

    // Indicates the success of this synchronous custom validator
    return true;
}


export const currentPasswordMatch:CustomValidator = async( currentPassword:string, { req } ):Promise<void> => {
    
    if(!req.params) throw new Error("No existe el parametro de request userId");

    const { userId } = req.params;

    //Determinar si el usuario está activo
    const user = await User.findById( userId );

    if( !user ) throw new Error("El usuario no existe");

     //verficar si el currentPassword enviado por el usuario a través del formulario
    const validPassword = bcryptjs.compareSync( currentPassword, user.password );

    if( !validPassword ) {
        throw new Error('Las claves no coinciden');
    }
}
