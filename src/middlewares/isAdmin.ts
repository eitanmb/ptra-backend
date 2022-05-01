import express from "express";
import { User } from "../models/Users.model";

const isAdmin = async( req:express.Request, res:express.Response, next: express.NextFunction ) => {

    const user = await User.findById( req.uid );

    if(!user) throw new Error("No existe el usuario");

    if( user.rol !== "ADMIN" ) {
        res.status(400).json({
            ok:false,
            msg:('No tiene privilegios de administrador')
        });
    
    } else {
        next();
    }

}

export default isAdmin;