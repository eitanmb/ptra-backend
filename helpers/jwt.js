const jwt = require('jsonwebtoken');
const { updateUserRefreshToken } = require('../database/db.operations');


const generateJWT = ( uid='', firstName='', exp='15s') => {

    return new Promise( (resolve, reject) => {
        
        const payload = { uid, firstName };

        jwt.sign( payload, process.env.SECRET_SEED, {
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

const createDeployTokens = async( user, res ) => {

     // Create accesToken and refreshToken
     const accessToken = await generateJWT( user._id, user.firstName, '15s' );
     const refreshToken = await generateJWT( user._id, user.firstName, '1d' );

     //Sending the refreshToken
     res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });

     //Actualizar refreshToken del usuiario en la db
     await updateUserRefreshToken( user, refreshToken );

     return {
        accessToken,
        refreshToken
     }

}


module.exports = {
    generateJWT,
    createDeployTokens
}