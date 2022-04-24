const bcryptjs = require('bcryptjs');

const encriptarPassword = ( password ) => {

    const salt = bcryptjs.genSaltSync(); 
    
    return bcryptjs.hashSync( password, salt )
}


module.exports = encriptarPassword;