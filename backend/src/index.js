import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import './config/db.js';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import fxRoutes from './routes/fxRoutes.js';
import forgetPasswordRoutes from './routes/forgetPasswordRoutes.js';
import resetPasswordRoutes from './routes/resetPasswordRoutes.js';

const app=express();
const PORT=process.env.PORT || 5000;

// Security & middleware
app.use(helmet());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Rate limiting , 100 requests per 15 minutes per IP


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/fx', fxRoutes);
app.use('/api/auth',forgetPasswordRoutes);
app.use('/api/auth',resetPasswordRoutes);



app.get('/', (req, res) => {
  res.json({ message: 'Banking API is running.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
