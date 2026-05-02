import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// POST /api/auth/register
const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, role, created_at`,
      [full_name, email, password_hash, role || 'customer']
    );

    const user = result.rows[0];

    // Auto-create a default savings account for new customers
    if (user.role === 'customer') {
      const accountNumber = 'ACC' + Date.now();
      await pool.query(
        `INSERT INTO accounts (user_id, account_number, account_type, balance)
         VALUES ($1, $2, 'savings', 1000.00)`,
        [user.id, accountNumber]
      );
    }

    // Log the action
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id)
       VALUES ($1, 'USER_REGISTERED', 'users', $2)`,
      [user.id, user.id]
    );

    res.status(201).json({ message: 'Registration successful.', user });

  } catch (err) {
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
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];

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

    // Log the action
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id)
       VALUES ($1, 'USER_LOGIN', 'users', $2)`,
      [user.id, user.id]
    );

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