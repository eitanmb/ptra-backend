import express from "express";
import { validationResult } from "express-validator";


const validarCampos = ( req:express.Request, res:express.Response, next: express.NextFunction ) => {

    const errors = validationResult( req );

    if( !errors.isEmpty() ) {
        
        return res.status(400).json({
            ok:false,
            errors: errors.mapped()
        })

    }

    next();
}


export default validarCampos;