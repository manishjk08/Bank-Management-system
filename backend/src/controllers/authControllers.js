import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';
import accountModel from '../models/accountModels.js';
import auditModel from '../models/auditModel.js';

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
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    
    await auditModel.log(user.id, 'User logged in','users',user.id);

    res.json({
      message: 'Login successful.',
      token,
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

export { register, login };