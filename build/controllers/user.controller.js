"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { response } = require('express');
const User = require('../models/Users.model');
const encriptarPassword = require('../helpers/encriptarPassword');
const generateJWT = require('../helpers/jwt');
const bcryptjs = require('bcryptjs');
//Controllers: createUser, getUsers, updateUser, deleteUser, loginUserByEmail, loginByGoogle, renewJWT
const getUser = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userData = yield User.find({ _id: userId });
        res.status(201).json({
            ok: true,
            userData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No pudo mostrarse la información del usuario. Inténtelo más tarde'
        });
    }
});
const getUsers = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    //Solo el administrador debe poder acceder al listado de usuarios
    //A través del JWT, podemos acceder al ID del usuario que está logueado
    try {
        const [users, totalUsers] = yield Promise.all([
            yield User.find({ status: true }),
            yield User.countDocuments({ status: true })
        ]);
        return res.json({
            ok: true,
            'Total usuarios': totalUsers,
            'Usuarios': users
        });
    }
    catch (error) {
        console.log(error);
        throw new Error('No pudo llevarse a acabo la consulta. Inténtelo más tarde');
    }
});
const updateUserProfile = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userUpdated = yield User.findByIdAndUpdate(userId, req.body);
        return res.status(201).json({
            ok: true,
            msg: 'user updated',
            userUpdated
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'No pudo actualizarse el usuario'
        });
    }
});
const deleteUser = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    //determinar con el JWT si el usuario logeado es el mismo que quiere darse de baja
    const { userId } = req.params;
    try {
        const userDeleted = yield User.findByIdAndUpdate(userId, { status: false });
        return res.json({
            ok: true,
            msg: 'user deletd',
            userDeleted
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'No pudo eliminarse el usuario'
        });
    }
});
const changeUserPassword = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    //determinar con el JWT si el usuario logeado es el mismo que quiere cambiar su password    
    const { userId } = req.params;
    const { password } = req.body;
    try {
        // //Determinar si el usuario está activo
        const user = yield User.findById(userId);
        //encryptar nueva contraseña
        yield User.findByIdAndUpdate(userId, { password: encriptarPassword(password) });
        return res.json({
            ok: true,
            user,
            msg: 'Password changed'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'No pudo actualizarse la contraseña'
        });
    }
});
module.exports = {
    getUser,
    getUsers,
    updateUserProfile,
    changeUserPassword,
    deleteUser
};
