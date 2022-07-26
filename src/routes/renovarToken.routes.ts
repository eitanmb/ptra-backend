import { Router } from 'express';
import { renovarToken } from '../controllers/renovarToken.controller';

const router = Router();

router.get(
    '/', renovarToken
);

module.exports = router;