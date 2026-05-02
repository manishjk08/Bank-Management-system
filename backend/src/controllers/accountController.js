import pool from '../config/db.js';

// GET /api/accounts/my — get logged-in user's accounts
const getMyAccounts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, account_number, account_type, balance, currency, created_at
       FROM accounts WHERE user_id = $1`,
      [req.user.id]
    );
    res.json({ accounts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/accounts/:id — get single account (must belong to user)
const getAccountById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, account_number, account_type, balance, currency, created_at
       FROM accounts WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    res.json({ account: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/accounts — get ALL accounts (admin only)
const getAllAccounts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.account_number, a.account_type, a.balance,
              a.currency, a.created_at, u.full_name, u.email
       FROM accounts a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC`
    );
    res.json({ accounts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

export { getMyAccounts, getAccountById, getAllAccounts };