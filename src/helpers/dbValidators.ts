import bcryptjs from 'bcryptjs';
import {User} from "../models/Users.model";

export const emailExist = async( email='' ) => {
    
    const existEmail = await User.findOne( { email } );

    if(existEmail) {

        throw new Error(`El usuario con email ${ email }, ya existe`); 
    }
}

export const isActiveUser = async( userId='' ) => {
    
    //Determinar si el usuario está activo
    const isActive = await User.findById( userId );
        
    if(!isActive?.status) {
        throw new Error(`El usuario con id ${ userId } no existe`); 
    }
    
}

export const isGoogleUser = async( userId='') => {
    
    const isGoogle = await User.findById( userId );

    //verifica que el usuario no se haya registrado a través de google
    if( isGoogle?.google ) { 
        throw new Error(`El usuario con id ${ userId } se registro a través de Google`); 
    }

}

export const havePriviledges = async( userId:string, { req }:{ req:any } ) => {

    //determinar si el usuario logeado es el mismo que quiere cambiar su profile o si tiene rol de administrador
    const user:any = await User.findById( req.uid );

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


export const passwordMatched = ( confirmPassword:string, { req }:{ req:any } ) => {

    if (confirmPassword !== req.body.password) {
      throw new Error('Las claves no coinciden');
    }

    // Indicates the success of this synchronous custom validator
    return true;
}


export const currentPasswordMatch = async( currentPassword:string, { req }:{ req:any } ) => {
    
    const { userId } = req.params;

    //Determinar si el usuario está activo
    const user:any = await User.findById(userId);

     //verficar si el currentPassword enviado por el usuario a través del formulario
    const validPassword = bcryptjs.compareSync( currentPassword, user.password );

    if( !validPassword ) {
        throw new Error('Las claves no coinciden');
    }
}
