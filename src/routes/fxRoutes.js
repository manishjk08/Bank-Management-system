import express from 'express';
import { getRate, convert, getMyBalancesConverted } from '../controllers/fxController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/rate', authenticate, getRate);
router.get('/convert', authenticate, convert);
router.get('/my-balances', authenticate, getMyBalancesConverted);

export default router;