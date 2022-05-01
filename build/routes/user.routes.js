"use strict";
const { Router } = require('express');
const { check } = require('express-validator');
const { getUser, getUsers, updateUserProfile, changeUserPassword, deleteUser } = require('../controllers/user.controller');
const { emailExist, passwordMatched, isActiveUser, currentPasswordMatch, havePriviledges, isGoogleUser } = require('../helpers/dbValidators');
const isAdmin = require('../middlewares/isAdmin');
const validarCampos = require('../middlewares/validarCampos');
const validarJwt = require('../middlewares/validarJwt');
const router = Router();
//OBTENER DATO DE UN USUARIO ESPECÍFICO
router.get('/user/:userId', [
    check('userId', 'No es un id válido').isMongoId(),
    validarJwt,
    check('userId').custom(isActiveUser),
    check('userId').custom(havePriviledges),
    validarCampos
], getUser);
//OBTENER LISTADO DE USUARIOS REGISTRADOS EN LA DB
router.get('/users', [
    validarJwt,
    isAdmin,
    validarCampos
], getUsers);
//ACTUALIZAR DATOS DEL USUARIO
router.put('/update/:userId', [
    check('userId', 'No es un id válido').isMongoId(),
    validarJwt,
    check('userId').custom(isActiveUser),
    check('userId').custom(havePriviledges),
    validarCampos
], updateUserProfile);
//CAMBIAR CONTRASEÑA DEL USUARIO
router.put('/changePassword/:userId', [
    check('userId', 'No es un id válido').isMongoId(),
    validarJwt,
    check('userId').custom(isActiveUser),
    check('userId').custom(havePriviledges),
    check('userId').custom(isGoogleUser),
    check('currentPassword', 'Las claves no coinciden').custom(currentPasswordMatch),
    check('confirmPassword', 'Las claves no coinciden').custom(passwordMatched),
    validarCampos
], changeUserPassword);
//ELIMINAR USUARIO
router.delete('/delete/:userId', [
    check('userId', 'No es un id válido').isMongoId(),
    validarJwt,
    check('userId').custom(isActiveUser),
    check('userId').custom(havePriviledges),
    validarCampos
], deleteUser);
module.exports = router;
