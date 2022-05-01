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
exports.currentPasswordMatch = exports.passwordMatched = exports.havePriviledges = exports.isGoogleUser = exports.isActiveUser = exports.emailExist = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Users_model_1 = require("../models/Users.model");
const emailExist = (email = '') => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield Users_model_1.User.findOne({ email });
    if (existEmail) {
        throw new Error(`El usuario con email ${email}, ya existe`);
    }
});
exports.emailExist = emailExist;
const isActiveUser = (userId = '') => __awaiter(void 0, void 0, void 0, function* () {
    //Determinar si el usuario está activo
    const isActive = yield Users_model_1.User.findById(userId);
    if (!(isActive === null || isActive === void 0 ? void 0 : isActive.status)) {
        throw new Error(`El usuario con id ${userId} no existe`);
    }
});
exports.isActiveUser = isActiveUser;
const isGoogleUser = (userId = '') => __awaiter(void 0, void 0, void 0, function* () {
    const isGoogle = yield Users_model_1.User.findById(userId);
    //verifica que el usuario no se haya registrado a través de google
    if (isGoogle === null || isGoogle === void 0 ? void 0 : isGoogle.google) {
        throw new Error(`El usuario con id ${userId} se registro a través de Google`);
    }
});
exports.isGoogleUser = isGoogleUser;
const havePriviledges = (userId, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    //determinar si el usuario logeado es el mismo que quiere cambiar su profile o si tiene rol de administrador
    const user = yield Users_model_1.User.findById(req.uid);
    if (!user)
        throw new Error('El usuario no existe');
    if (user.rol === "ADMIN") {
        console.log('Es administrador');
        return true;
    }
    if (req.uid !== userId) {
        throw new Error('El usuario no tiene privilegios');
    }
    return true;
});
exports.havePriviledges = havePriviledges;
const passwordMatched = (confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
        throw new Error('Las claves no coinciden');
    }
    // Indicates the success of this synchronous custom validator
    return true;
};
exports.passwordMatched = passwordMatched;
const currentPasswordMatch = (currentPassword, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    //Determinar si el usuario está activo
    const user = yield Users_model_1.User.findById(userId);
    //verficar si el currentPassword enviado por el usuario a través del formulario
    const validPassword = bcryptjs_1.default.compareSync(currentPassword, user.password);
    if (!validPassword) {
        throw new Error('Las claves no coinciden');
    }
});
exports.currentPasswordMatch = currentPasswordMatch;
