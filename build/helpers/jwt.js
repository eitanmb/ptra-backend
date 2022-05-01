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
exports.verificarToken = exports.createDeployTokens = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_operations_1 = require("../database/db.operations");
const SECRET_SEED = process.env.SECRET_SEED;
const generateJWT = (uid = '', firstName = '', exp = '15s') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, firstName };
        if (!SECRET_SEED)
            throw new Error("La clave privada no existe");
        jsonwebtoken_1.default.sign(payload, SECRET_SEED, {
            expiresIn: exp
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject('No pudo generarse el token');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
const createDeployTokens = function (user, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create accesToken and refreshToken
        const accessToken = yield (0, exports.generateJWT)(user._id, user.firstName, '15s');
        const refreshToken = yield (0, exports.generateJWT)(user._id, user.firstName, '1d');
        //Sending the refreshToken
        if (!refreshToken)
            throw new Error("No existe el Token");
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: false, maxAge: 24 * 60 * 60 * 1000 });
        //Actualizar refreshToken del usuiario en la db
        (0, db_operations_1.updateUserRefreshToken)(user, refreshToken);
        if (!accessToken)
            throw new Error("No existe el Token");
        return {
            accessToken,
            refreshToken
        };
    });
};
exports.createDeployTokens = createDeployTokens;
const verificarToken = function (token) {
    if (!SECRET_SEED)
        throw new Error("La clave privada no existe");
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, SECRET_SEED, (err, decoded) => {
            if (err)
                return reject(err);
            resolve(decoded);
        });
    });
};
exports.verificarToken = verificarToken;
