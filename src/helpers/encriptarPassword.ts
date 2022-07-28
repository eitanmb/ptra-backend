import bcryptjs from 'bcryptjs';

const encriptarPassword = ( password:string ) => {
    const salt = bcryptjs.genSaltSync(); 
    return bcryptjs.hashSync( password, salt )
}


export default encriptarPassword;