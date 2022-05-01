import { Router } from 'express';
import { check,CustomValidator } from 'express-validator';

import { 
    loginByEmail,
    googleSignIn,
    newUser,
    renovarToken
 }  from '../controllers/auth.controller';

import validarCampos from '../middlewares/validarCampos';

import { emailExist, passwordMatched } from '../helpers/dbValidators';

 
const router = Router();

//CREAR NUEVO USUARIOError
router.post(
    '/new', 
    [ 
        check(['firstName','lastName','email'],'Este campo es obligatorio').not().isEmpty(),
        check('email','No es un email válido').isEmail(),
        check('email').custom(emailExist),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min:6 }),
        check('confirmPassword').custom(passwordMatched),
        validarCampos
    ],
    newUser 
);

router.post(
    '/', 
    [ 
        check(['email', 'password'],'No pueden estar vacíos').not().isEmpty(),
        check(['email'],'No es un email correcto').isEmail(),
        validarCampos
    ],
    loginByEmail 
);

router.post(
    '/google', 
    [ 
        check('id_token','El token debe existir').not().isEmpty(),
        validarCampos
    ],
    googleSignIn 
);

router.get(
    '/refresh', 
    renovarToken
);

module.exports = router;