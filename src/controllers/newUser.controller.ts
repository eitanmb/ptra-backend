import express from 'express';

import { createDeployTokens } from '../helpers/jwt';
import { createNewUser } from '../database/db.operations';
import { IUser } from '../types/types';
import { OperationalErrors } from '../errors/OperationalErrors';


export const newUser = async (req: express.Request, res: express.Response) => {

    try {
        const user: IUser = await createNewUser(req.body);
        const tokens = await createDeployTokens(user, res); 
        const { accessToken } = tokens;

        return res.status(201).json({
            ok: true,
            user,
            accessToken
        });


    } catch (error) {
        if (error instanceof OperationalErrors) {
            return res.status(400).json({
                ok: false,
                type: error.name,
                message: error.message
            });
        } else {
            return res.status(400).json({
                ok: false,
                msg: error
            });
        }
        
    }
}
