import express from  'express';
import { forgetPassword } from '../controllers/forgetPassword.js';

const router =express.Router();

router.post('/forget-password',forgetPassword)

export default router;