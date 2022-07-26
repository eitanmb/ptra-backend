import { Router } from 'express';
import { refreshToken } from '../controllers/refreshToken.controller';

const router = Router();

router.get(
    '/', refreshToken
);

module.exports = router;