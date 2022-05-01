"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido']
    },
    password: {
        type: String,
        required: [true, 'Coloque una clave']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    organization: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    rol: {
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
UserSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, user = __rest(_a, ["__v", "_id"]);
    user.uid = _id;
    return user;
};
exports.User = (0, mongoose_1.model)('User', UserSchema);
