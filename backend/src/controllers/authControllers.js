import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';
import accountModel from '../models/accountModels.js';
import auditModel from '../models/auditModel.js';
import refreshTokenModel from '../models/RefreshTokenModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/GenerateToken.js';
import {refreshCookieOptions} from '../utils/CookieOptions.js';

// POST /api/auth/register
const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(full_name,email,password_hash,role);
    

    const accountNumber = 'ACC' + Date.now();
    if (user.role === 'customer') {
      await accountModel.createDefaultAccount(user.id, accountNumber);
    }

    
    await auditModel.log(user.id, 'User registered','users',user.id)

    res.status(201).json({ message: 'Registration successful.', user });

  } catch (err) {
    console.error("Register error:", err.message, err.stack)
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await userModel.findByEmail(email)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Sign JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
  
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
        
    await refreshTokenModel.revokeTokenByUser(user.id);
    await refreshTokenModel.storeToken(user.id, refreshToken,refreshExpiry,false);

    res.cookie("refreshToken",refreshToken,refreshCookieOptions);

    await auditModel.log(user.id, 'User logged in','users',user.id);

    res.json({
      message: 'Login successful.',
      accessToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// post /api/auth/logout

const logout=async(req,res)=>{
  try{
  const refreshToken=req.cookies.refreshToken

if(refreshToken){
  await refreshTokenModel.revokeToken(refreshToken)
  res.clearCookie("refreshToken",refreshCookieOptions)
  }
return res.json({message:"Logout successfully"})
  }
  catch(error){
    console.error(error);
    res.status(500).json({error:'Server error'})
  }
}


export { register, login, logout }