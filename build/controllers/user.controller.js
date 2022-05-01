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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changeUserPassword = exports.updateUserProfile = exports.getUsers = exports.getUser = void 0;
const Users_model_1 = require("../models/Users.model");
const encriptarPassword_1 = __importDefault(require("../helpers/encriptarPassword"));
//Controllers: createUser, getUsers, updateUser, deleteUser, loginUserByEmail, loginByGoogle, renewJWT
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userData = yield Users_model_1.User.find({ _id: userId });
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
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Solo el administrador debe poder acceder al listado de usuarios
    //A través del JWT, podemos acceder al ID del usuario que está logueado
    try {
        const [users, totalUsers] = yield Promise.all([
            yield Users_model_1.User.find({ status: true }),
            yield Users_model_1.User.countDocuments({ status: true })
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
exports.getUsers = getUsers;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userUpdated = yield Users_model_1.User.findByIdAndUpdate(userId, req.body);
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
exports.updateUserProfile = updateUserProfile;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //determinar con el JWT si el usuario logeado es el mismo que quiere darse de baja
    const { userId } = req.params;
    try {
        const userDeleted = yield Users_model_1.User.findByIdAndUpdate(userId, { status: false });
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
exports.deleteUser = deleteUser;
const changeUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //determinar con el JWT si el usuario logeado es el mismo que quiere cambiar su password    
    const { userId } = req.params;
    const { password } = req.body;
    try {
        // //Determinar si el usuario está activo
        const user = yield Users_model_1.User.findById(userId);
        //encryptar nueva contraseña
        yield Users_model_1.User.findByIdAndUpdate(userId, { password: (0, encriptarPassword_1.default)(password) });
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
exports.changeUserPassword = changeUserPassword;
