import express from 'express';
import { register, login,logout } from '../controllers/authControllers.js';
import accessRefreshToken from '../controllers/refreshTokenController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token',accessRefreshToken)

export default router;

