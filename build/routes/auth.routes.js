"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const validarCampos_1 = __importDefault(require("../middlewares/validarCampos"));
const dbValidators_1 = require("../helpers/dbValidators");
const router = (0, express_1.Router)();
//CREAR NUEVO USUARIOError
router.post('/new', [
    (0, express_validator_1.check)(['firstName', 'lastName', 'email'], 'Este campo es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'No es un email válido').isEmail(),
    (0, express_validator_1.check)('email').custom(dbValidators_1.emailExist),
    (0, express_validator_1.check)('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    (0, express_validator_1.check)('confirmPassword').custom(dbValidators_1.passwordMatched),
    validarCampos_1.default
], auth_controller_1.newUser);
router.post('/', [
    (0, express_validator_1.check)(['email', 'password'], 'No pueden estar vacíos').not().isEmpty(),
    (0, express_validator_1.check)(['email'], 'No es un email correcto').isEmail(),
    validarCampos_1.default
], auth_controller_1.loginByEmail);
router.post('/google', [
    (0, express_validator_1.check)('id_token', 'El token debe existir').not().isEmpty(),
    validarCampos_1.default
], auth_controller_1.googleSignIn);
router.get('/refresh', auth_controller_1.renovarToken);
module.exports = router;
