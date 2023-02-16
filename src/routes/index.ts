import { Router } from 'express';
import { checkJwt } from '../middleware/checkJwt';

import auth from './auth';
import tweet from './tweet'
const router = Router();

router.use('/auth', auth);
router.use('/tweet', checkJwt,tweet)

export default router;
