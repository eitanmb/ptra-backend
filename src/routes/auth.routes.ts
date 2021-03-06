import { Router } from 'express';
import { check } from 'express-validator';

import { auth } from '../controllers/auth.controller';
import validarCampos from '../middlewares/validarCampos';
 
const router = Router();

router.post(
    '/', 
    [ 
        check(['email', 'password'],'No pueden estar vacíos').not().isEmpty(),
        check(['email'],'No es un email correcto').isEmail(),
        validarCampos
    ],
    auth
);

module.exports = router;