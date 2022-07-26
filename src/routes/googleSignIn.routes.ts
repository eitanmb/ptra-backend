import { Router } from 'express';
import { check } from 'express-validator';

import { googleSignIn } from '../controllers/googleSignIn.controller';
import validarCampos from '../middlewares/validarCampos';

const router = Router();

router.post(
    '/google', 
    [ 
        check('id_token','El token debe existir').not().isEmpty(),
        validarCampos
    ],
    googleSignIn 
);


module.exports = router;