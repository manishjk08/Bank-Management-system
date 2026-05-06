import express from 'express';
import { getMyAccounts, getAccountById, getAllAccounts, createNewAccount, } from '../controllers/accountController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { approveAccount,rejectAccount } from '../controllers/adminController.js';

const router = express.Router();

router.get('/my', authenticate, getMyAccounts);
router.get('/:id', authenticate, getAccountById);
router.post('/create',authenticate,createNewAccount);
router.patch('/approve/:request_id', authenticate, authorizeAdmin, approveAccount);
router.patch('/reject/:request_id', authenticate, authorizeAdmin, rejectAccount);
router.get('/', authenticate, authorizeAdmin, getAllAccounts);

export default router;