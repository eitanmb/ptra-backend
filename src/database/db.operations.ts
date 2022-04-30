import {User} from '../models/Users.model';
import encriptarPassword from '../helpers/encriptarPassword';
import { IUser } from '../types/types';

export const createNewUser = async( userInfo:IUser ) => {
    
    const { password } = userInfo;
    const user = new User( userInfo );
    
    //encryptar contraseña
    user.password = encriptarPassword( password );

    //registrar nuevo usuario en db
    await user.save();

    return user;

}

export const updateUserRefreshToken = async( user: IUser, refreshToken:string ) => {

    //Actualizar refreshToken del usuiario en la db
    user.refreshToken = refreshToken;     
    await user.save();

}

export const findUserByRefreshToken = ( refreshToken:string ) => {

    return User.findOne({ refreshToken: refreshToken })

}
