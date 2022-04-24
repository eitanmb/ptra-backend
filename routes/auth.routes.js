const { Router } = require( 'express' );
const { check } = require('express-validator');

const { 
    loginByEmail,
    googleSignIn,
    renewJWT
 } = require('../controllers/auth.controller');

 const validarCampos = require('../middlewares/validarCampos');
const validarJwt = require('../middlewares/validarJwt');
 
 
const router = Router();


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

router.get('/renew', validarJwt, renewJWT );


module.exports = router;