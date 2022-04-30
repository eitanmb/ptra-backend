import { Document } from 'mongoose';

export interface IUser extends Document {
    _id:string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    organization?: string,
    status: boolean,
    rol: string[],
    google: boolean,
    refreshToken: string
}