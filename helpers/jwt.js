const jwt = require('jsonwebtoken');


const generateJWT = ( uid='', firstName='') => {

    return new Promise( (resolve, reject) => {
        
        const payload = { uid, firstName };

        jwt.sign( payload, process.env.SECRET_SEED, {
            expiresIn:'10s'
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


module.exports = generateJWT;