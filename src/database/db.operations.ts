import {User} from '../models/Users.model';
import encriptarPassword from '../helpers/encriptarPassword';
import { IUser } from '../types/types';
import { OperationalErrors } from '../errors/OperationalErrors';

export const createNewUser = async( userInfo:IUser ) => {
    
    const { password } = userInfo;
    const user = new User( userInfo );
    
    user.password = encriptarPassword( password );
    
    try {
        await user.save();
        return user;
    } catch(error) {
        throw new OperationalErrors('Falló la creación del usuario en la db');
    }
}

export const updateUserRefreshToken = async( user: IUser, refreshToken:string ) => {
    user.refreshToken = refreshToken;     
    try {
        await user.save();
    } catch(error) {
        throw new OperationalErrors('Falló la renovación del token');
    }
}

export const findUserByRefreshToken = ( refreshToken:string ) => {
    return User.findOne({ refreshToken: refreshToken })

}
