import { Router } from 'express';
import { check } from 'express-validator';

import { 
    getUser,
    getUsers,
    updateUserProfile,
    changeUserPassword,
    deleteUser
} from '../controllers/user.controller';

import { passwordMatched, isActiveUser, currentPasswordMatch, havePriviledges, isGoogleUser } from '../helpers/dbValidators';
import isAdmin from '../middlewares/isAdmin';
import validarCampos from '../middlewares/validarCampos';
import validarJwt from '../middlewares/validarJwt';
 

const router = Router();

//OBTENER DATO DE UN USUARIO ESPECÍFICO
router.get(
    '/user/:userId', 
    [
        check('userId', 'No es un id válido').isMongoId(),
        validarJwt,
        check('userId').custom(isActiveUser),
        check('userId').custom(havePriviledges),
        validarCampos
    ],
    getUser 
);

//OBTENER LISTADO DE USUARIOS REGISTRADOS EN LA DB
router.get(
    '/users',
    [
        validarJwt,
        isAdmin,
        validarCampos
    ],
    getUsers 
);

//ACTUALIZAR DATOS DEL USUARIO
router.put(
    '/update/:userId', 
    [ 
        check('userId', 'No es un id válido').isMongoId(),
        validarJwt,
        check('userId').custom(isActiveUser),
        check('userId').custom(havePriviledges),
        validarCampos
    ],
    updateUserProfile 
);

//CAMBIAR CONTRASEÑA DEL USUARIO
router.put(
    '/changePassword/:userId',
    [
        check('userId', 'No es un id válido').isMongoId(),
        validarJwt,
        check('userId').custom(isActiveUser),
        check('userId').custom(havePriviledges),
        check('userId').custom(isGoogleUser),
        check('currentPassword', 'Las claves no coinciden').custom(currentPasswordMatch),
        check('confirmPassword', 'Las claves no coinciden').custom(passwordMatched),
        validarCampos
    ],
    changeUserPassword 
);

//ELIMINAR USUARIO
router.delete(
    '/delete/:userId',
    [
        check('userId', 'No es un id válido').isMongoId(),
        validarJwt,
        check('userId').custom(isActiveUser),
        check('userId').custom(havePriviledges),
        validarCampos
    ],
    deleteUser 
 );


 module.exports = router;