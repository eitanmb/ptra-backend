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
exports.renovarToken = exports.googleSignIn = exports.loginByEmail = exports.newUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../helpers/jwt");
const googleVerify_1 = __importDefault(require("../helpers/googleVerify"));
const db_operations_1 = require("../database/db.operations");
const Users_model_1 = require("../models/Users.model");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //registrar nuevo usuario en db
        const user = yield (0, db_operations_1.createNewUser)(req.body);
        //Crear Tokens
        const tokens = yield (0, jwt_1.createDeployTokens)(user, res);
        if (!tokens)
            throw new Error("La operacion de generacion de tokens ha fallado");
        const { accessToken } = tokens;
        return res.status(201).json({
            ok: true,
            user,
            accessToken
        });
    }
    catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'No pudo registrarse el usuario. Comuníquese con el administrador'
        });
    }
});
exports.newUser = newUser;
const loginByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield Users_model_1.User.findOne({ email });
        //comparar el password del request con el que figura en la bbdd
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        //comparar las passwords
        const validPassword = bcryptjs_1.default.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        //Crear Tokens
        const tokens = yield (0, jwt_1.createDeployTokens)(user, res);
        if (!tokens)
            throw new Error("La operacion de generacion de tokens ha fallado");
        const { accessToken } = tokens;
        //Sending the accessToken to the frontend developer
        res.json({
            ok: true,
            msg: 'Login by email',
            uid: user._id,
            name: user.firstName,
            accessToken
        });
    }
    catch (error) {
    }
});
exports.loginByEmail = loginByEmail;
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    try {
        const { firstName, lastName, email } = yield (0, googleVerify_1.default)(id_token);
        //Si el usuario no existe, se registra en el db, utilizando los datos extraidos del token de google
        let user = yield Users_model_1.User.findOne({ email });
        if (!user) {
            user = yield new Users_model_1.User({
                firstName,
                lastName,
                email,
                password: '111111',
                google: true
            });
            yield user.save();
        }
        //Si el usuario existe en la db, comprobar que esté activo
        if (!user.status) {
            return res.status(401).json({
                ok: false,
                msg: 'No pudo ingresar, por favor comuníquese con el administrador'
            });
        }
        //Crear Tokens
        const { accessToken } = yield (0, jwt_1.createDeployTokens)(user, res);
        res.json({
            ok: true,
            msg: 'Login by Gmail',
            uid: user._id,
            name: user.firstName,
            accessToken
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'El token no pudo ser verificado'
        });
    }
});
exports.googleSignIn = googleSignIn;
const renovarToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        return res.sendStatus(403);
    }
    const refreshToken = cookies.jwt;
    const user = yield (0, db_operations_1.findUserByRefreshToken)(refreshToken);
    if (!user)
        return res.sendStatus(403);
    try {
        const decoded = yield (0, jwt_1.verificarToken)(refreshToken);
        if (user.firstName !== decoded.firstName)
            throw new Error("Los usarios no coinciden");
        const accessToken = yield (0, jwt_1.generateJWT)(decoded.uid, decoded.firstName, '15s');
        res.status(201).json({
            accessToken
        });
    }
    catch (err) {
        throw new Error("No pudo vericarse el token");
    }
});
exports.renovarToken = renovarToken;
