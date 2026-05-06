import express from 'express';
import { getMyTransactions, transfer, deposit } from '../controllers/transactionController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', authenticate, getMyTransactions);
router.post('/transfer', authenticate, transfer);
router.post('/deposit', authenticate, authorizeAdmin, deposit);

export default router;