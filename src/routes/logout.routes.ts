import { Router } from 'express';
import { check } from 'express-validator';

import { logout } from '../controllers/logout.controller';
import validarCampos from '../middlewares/validarCampos';
 
const router = Router();

router.get(
    '/', 
    [ 
        check(['email', 'password'],'No pueden estar vacíos').not().isEmpty(),
        check(['email'],'No es un email correcto').isEmail(),
        validarCampos
    ],
    logout
);

module.exports = router;