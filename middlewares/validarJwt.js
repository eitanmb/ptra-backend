const jwt = require('jsonwebtoken');

const validarJwt = ( req, res=response, next ) => {

    const token = req.header('x-token');

    if(!token) {
        res.status(400).json({
            ok:false,
            msg:'No se ha recibido token'
        });
    }

    try {
        const { uid, firstName } = jwt.verify( token, process.env.SECRET_SEED);
    
        //AGREGAR EL UID Y EL FIRSTNAME AL REQUEST
        req.uid = uid;
        req.firstName = firstName;

    } catch (error) {
       console.log(error);
       return res.status(401).json({
           ok:false,
           msg: 'El token no es válido'
       });
    }

    next();

}


module.exports = validarJwt;