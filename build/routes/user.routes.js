"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const dbValidators_1 = require("../helpers/dbValidators");
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const validarCampos_1 = __importDefault(require("../middlewares/validarCampos"));
const validarJwt_1 = __importDefault(require("../middlewares/validarJwt"));
const router = (0, express_1.Router)();
//OBTENER DATO DE UN USUARIO ESPECÍFICO
router.get('/user/:userId', [
    (0, express_validator_1.check)('userId', 'No es un id válido').isMongoId(),
    validarJwt_1.default,
    (0, express_validator_1.check)('userId').custom(dbValidators_1.isActiveUser),
    (0, express_validator_1.check)('userId').custom(dbValidators_1.havePriviledges),
    validarCampos_1.default
], user_controller_1.getUser);
//OBTENER LISTADO DE USUARIOS REGISTRADOS EN LA DB
router.get('/users', [
    validarJwt_1.default,
    isAdmin_1.default,
    validarCampos_1.default
], user_controller_1.getUsers);
//ACTUALIZAR DATOS DEL USUARIO
router.put('/update/:userId', [
    (0, express_validator_1.check)('userId', 'No es un id válido').isMongoId(),
    validarJwt_1.default,
    (0, express_validator_1.check)('userId').custom(dbValidators_1.isActiveUser),
    (0, express_validator_1.check)('userId').custom(dbValidators_1.havePriviledges),
    validarCampos_1.default
], user_controller_1.updateUserProfile);
//CAMBIAR CONTRASEÑA DEL USUARIO
router.put('/changePassword/:userId', [
    (0, express_validator_1.check)('userId', 'No es un id válido').isMongoId(),
    validarJwt_1.default,
    (0, express_validator_1.check)('userId').custom(dbValidators_1.isActiveUser),
    (0, express_validator_1.check)('userId').custom(dbValidators_1.havePriviledges),
    (0, express_validator_1.check)('userId').custom(dbValidators_1.isGoogleUser),
    (0, express_validator_1.check)('currentPassword', 'Las claves no coinciden').custom(dbValidators_1.currentPasswordMatch),
    (0, express_validator_1.check)('confirmPassword', 'Las claves no coinciden').custom(dbValidators_1.passwordMatched),
    validarCampos_1.default
], user_controller_1.changeUserPassword);
//ELIMINAR USUARIO
router.delete('/delete/:userId', [
    (0, express_validator_1.check)('userId', 'No es un id válido').isMongoId(),
    validarJwt_1.default,
    (0, express_validator_1.check)('userId').custom(dbValidators_1.isActiveUser),
    (0, express_validator_1.check)('userId').custom(dbValidators_1.havePriviledges),
    validarCampos_1.default
], user_controller_1.deleteUser);
module.exports = router;
