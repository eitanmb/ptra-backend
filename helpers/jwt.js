const jwt = require('jsonwebtoken');


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


module.exports = {
    generateJWT
}