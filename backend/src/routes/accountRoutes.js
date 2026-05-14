import express from 'express';
import { getMyAccounts, getAccountById, getAllAccounts, createNewAccount, } from '../controllers/accountController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { approveAccount,rejectAccount,getAllPendingAccounts } from '../controllers/adminController.js';

const router = express.Router();

router.get('/my', authenticate, getMyAccounts);
router.post('/create', authenticate, createNewAccount);

// specific routes first
router.get('/pending_accounts', authenticate, authorizeAdmin, getAllPendingAccounts);
router.patch('/approve/:request_id', authenticate, authorizeAdmin, approveAccount);
router.patch('/reject/:request_id', authenticate, authorizeAdmin, rejectAccount);
router.get('/', authenticate, authorizeAdmin, getAllAccounts);

// generic route last
router.get('/:id', authenticate, getAccountById);


export default router;