import pool from '../config/db.js';
import accountModel from '../models/accountModels.js';

// GET /api/account/
const getMyAccounts = async (req, res) => {
  try {
    const accounts = await accountModel.findBYUserID(req.user.id)
    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/accounts/:id 
const getAccountById = async (req, res) => {
  try {
    const account = await accountModel.findByIdAndUserId(req.params.id, req.user.id);

    if (!account) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    res.json({account});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET all accounts /api/accounts 
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await accountModel.getAll();
    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

export { getMyAccounts, getAccountById, getAllAccounts };