const User = require("../models/Users.model")
const bcryptjs = require('bcryptjs');



const emailExist = async( email='' ) => {
    
    const existEmail = await User.findOne( { email } );

    if(existEmail) {

        throw new Error(`El usuario con email ${ email }, ya existe`); 
    }
}

const isActiveUser = async( userId='' ) => {
    
    //Determinar si el usuario está activo
    const isActive = await User.findById( userId );
        
    if(!isActive.status) {
        throw new Error(`El usuario con id ${ userId } no existe`); 
    }
    
}

const isGoogleUser = async( userId='') => {
    
    const isGoogle = await User.findById( userId );

    //verifica que el usuario no se haya registrado a través de google
    if( isGoogle.google ) { 
        throw new Error(`El usuario con id ${ userId } se registro a través de Google`); 
    }

}

const havePriviledges = async( userId, { req }) => {

    //determinar si el usuario logeado es el mismo que quiere cambiar su profile o si tiene rol de administrador
    const user = await User.findById( req.uid );

    if (user.rol === "ADMIN" ) {
        console.log('Es administrador');
        return true;
    }

    if( req.uid !== userId ){
        throw new Error('El usuario no tiene privilegios');
    }

    return true;

}


const passwordMatched = ( confirmPassword, { req } ) => {

    if (confirmPassword !== req.body.password) {
      throw new Error('Las claves no coinciden');
    }

    // Indicates the success of this synchronous custom validator
    return true;
}


const currentPasswordMatch = async( currentPassword, { req } ) => {
    
    const { userId } = req.params;

    //Determinar si el usuario está activo
    const user = await User.findById(userId);

     //verficar si el currentPassword enviado por el usuario a través del formulario
    const validPassword = bcryptjs.compareSync( currentPassword, user.password );

    if( !validPassword ) {
        throw new Error('Las claves no coinciden');
    }
}






module.exports = {
    emailExist,
    isActiveUser,
    isGoogleUser,
    havePriviledges,
    passwordMatched,
    currentPasswordMatch
}