const User = require('../models/Users.model');
const encriptarPassword = require('../helpers/encriptarPassword');


const createNewUser = async( userInfo ) => {
    
    const { password } = userInfo;
    const user = new User( userInfo );

    //encryptar contraseña
    user.password = encriptarPassword( password );

    //registrar nuevo usuario en db
    await user.save();

    return user;

}

const updateUserRefreshToken = async( user, refreshToken ) => {

    //Actualizar refreshToken del usuiario en la db
    user.refreshToken = refreshToken;     
    await user.save();

}

const findUserByRefreshToken = ( refreshToken ) => {

    return User.findOne({ refreshToken: refreshToken })

}


module.exports = { 
    createNewUser,
    updateUserRefreshToken,
    findUserByRefreshToken
}