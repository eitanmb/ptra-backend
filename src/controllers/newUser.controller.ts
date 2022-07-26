import express from 'express';

import { createDeployTokens } from '../helpers/jwt';
import { createNewUser } from '../database/db.operations';
import { IUser } from '../types/types';


export const newUser = async (req: express.Request, res: express.Response) => {

    try {
        const user: IUser = await createNewUser(req.body);
        const tokens = await createDeployTokens(user, res);

        if (!tokens) throw new Error("La operacion de generacion de tokens ha fallado");
        const { accessToken } = tokens;

        return res.status(201).json({
            ok: true,
            user,
            accessToken
        });


    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'No pudo registrarse el usuario. Comuníquese con el administrador'
        });
    }
}
