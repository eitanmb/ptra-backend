"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_SEED = process.env.SECRET_SEED;
const validarJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }
    console.log(authHeader);
    // remove Bearer if using Bearer Authorization mechanism
    let token;
    if (authHeader.toLowerCase().startsWith('bearer')) {
        token = authHeader.slice('bearer'.length).trim();
    }
    else {
        token = authHeader;
    }
    if (!SECRET_SEED)
        throw new Error("La clave privada no existe");
    jsonwebtoken_1.default.verify(token, SECRET_SEED, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.uid = decoded.uid;
        req.firstName = decoded.firstName;
        next();
    });
};
exports.default = validarJwt;
