import pool from '../config/db.js';

// GET /api/transactions/my — get all transactions for logged-in user
const getMyTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.amount, t.currency, t.transaction_type,
              t.status, t.description, t.created_at,
              fa.account_number AS from_account,
              ta.account_number AS to_account
       FROM transactions t
       LEFT JOIN accounts fa ON t.from_account_id = fa.id
       LEFT JOIN accounts ta ON t.to_account_id = ta.id
       WHERE fa.user_id = $1 OR ta.user_id = $1
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json({ transactions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/transactions/transfer — transfer between two accounts
const transfer = async (req, res) => {
  const { from_account_id, to_account_number, amount, description } = req.body;

  if (!from_account_id || !to_account_number || !amount) {
    return res.status(400).json({ error: 'from_account_id, to_account_number and amount are required.' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero.' });
  }

  // Get a client from pool so we can use a transaction (rollback on failure)
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Verify the sender's account belongs to the logged-in user
    const senderResult = await client.query(
      `SELECT * FROM accounts WHERE id = $1 AND user_id = $2 FOR UPDATE`,
      [from_account_id, req.user.id]
    );

    if (senderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Sender account not found or unauthorized.' });
    }

    const sender = senderResult.rows[0];

    // 2. Check sufficient balance
    if (parseFloat(sender.balance) < parseFloat(amount)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient balance.' });
    }

    // 3. Find the receiver account by account number
    const receiverResult = await client.query(
      `SELECT * FROM accounts WHERE account_number = $1 FOR UPDATE`,
      [to_account_number]
    );

    if (receiverResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Receiver account not found.' });
    }

    const receiver = receiverResult.rows[0];

    if (sender.id === receiver.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot transfer to the same account.' });
    }

    // 4. Deduct from sender
    await client.query(
      `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
      [amount, sender.id]
    );

    // 5. Credit to receiver
    await client.query(
      `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
      [amount, receiver.id]
    );

    // 6. Record the transaction
    const txResult = await client.query(
      `INSERT INTO transactions
        (from_account_id, to_account_id, amount, currency, transaction_type, status, description)
       VALUES ($1, $2, $3, $4, 'transfer', 'completed', $5)
       RETURNING *`,
      [sender.id, receiver.id, amount, sender.currency, description || null]
    );

    // 7. Audit log
    await client.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, meta)
       VALUES ($1, 'TRANSFER_COMPLETED', 'transactions', $2, $3)`,
      [
        req.user.id,
        txResult.rows[0].id,
        JSON.stringify({ amount, from: sender.account_number, to: receiver.account_number })
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Transfer successful.',
      transaction: txResult.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Transfer failed. Transaction rolled back.' });
  } finally {
    client.release();
  }
};

// POST /api/transactions/deposit — deposit into own account (admin only)
const deposit = async (req, res) => {
  const { account_id, amount, description } = req.body;

  if (!account_id || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid account_id and amount are required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const accountResult = await client.query(
      `SELECT * FROM accounts WHERE id = $1 FOR UPDATE`,
      [account_id]
    );

    if (accountResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Account not found.' });
    }

    await client.query(
      `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
      [amount, account_id]
    );

    const txResult = await client.query(
      `INSERT INTO transactions
        (to_account_id, amount, currency, transaction_type, status, description)
       VALUES ($1, $2, $3, 'deposit', 'completed', $4)
       RETURNING *`,
      [account_id, amount, accountResult.rows[0].currency, description || 'Admin deposit']
    );

    await client.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, meta)
       VALUES ($1, 'DEPOSIT_COMPLETED', 'transactions', $2, $3)`,
      [req.user.id, txResult.rows[0].id, JSON.stringify({ amount, account_id })]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Deposit successful.',
      transaction: txResult.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Deposit failed. Transaction rolled back.' });
  } finally {
    client.release();
  }
};

export { getMyTransactions, transfer, deposit };