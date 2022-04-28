import { Schema, model, Model } from 'mongoose';
import { IUser } from '../types/types';

const UserSchema = new Schema( {
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido']
    } ,
    lastName: { 
        type: String,
        required: [true, 'El apellido es requerido']
    } ,
    password: {
        type: String,
        required: [true, 'Coloque una clave']
    },
    email: { 
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    } ,
    organization: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    rol : {
        type: String,
        default: 'USER_FREE',
        enum: ['USER_FREE', 'USER_PAID', 'ADMIN'],
        required: true
    },
    google: {
        type: Boolean,
        default: false,
        require: true
    },
    refreshToken: {
        type: String,
        default: "",
        require: true
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export const User: Model<IUser> = model('User', UserSchema);
