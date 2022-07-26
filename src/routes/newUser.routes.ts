import { Router } from 'express';
import { check } from 'express-validator';
 
import { emailExist, passwordMatched } from '../helpers/dbValidators';
import { newUser } from '../controllers/newUser.controller';
import validarCampos from '../middlewares/validarCampos';

const router = Router();

router.post(
    '/', 
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

module.exports = router;