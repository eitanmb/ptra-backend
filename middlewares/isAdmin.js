const { response } = require("express");
const User = require("../models/Users.model");


const isAdmin = async( req, res=response, next ) => {

    const user = await User.findById( req.uid );

    if( user.rol !== "ADMIN" ) {
        res.status(400).json({
            ok:false,
            msg:('No tiene privilegios de administrador')
        });
    
    } else {
        next();
    }

}

module.exports = isAdmin;