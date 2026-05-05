import express from 'express';
import { getMyAccounts, getAccountById, getAllAccounts, createNewAccount } from '../controllers/accountController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', authenticate, getMyAccounts);
router.get('/:id', authenticate, getAccountById);
router.post('/new',authenticate,createNewAccount);
router.get('/', authenticate, authorizeAdmin, getAllAccounts);

export default router;