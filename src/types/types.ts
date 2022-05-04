import { Document } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';


export interface IUser extends Document {
    _id:string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    organization?: string,
    status: boolean,
    rol: string,
    google: boolean,
    refreshToken: string
}

export interface ITokens {
    accessToken: string | undefined,
    refreshToken: string | undefined
}

export interface ITokenPayload {
    uid?: string,
    firstName?: string,
    iat?: number,
    exp?: number
}
