import bcryptjs from 'bcryptjs';
import express from 'express';

import { createDeployTokens } from '../helpers/jwt';
import { User } from '../models/Users.model';

export const logout = async( req:express.Request, res:express.Response ) => {
    return
}