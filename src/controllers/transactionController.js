import pool from '../config/db.js';
import accountModels from '../models/accountModels.js';
import transactionModel from '../models/transactionModel.js';
import auditModel from '../models/auditModel.js';

// GET /api/transactions/my 
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.findUserById(req.user.id);
    res.json({ transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/transactions/transfer 
const transfer = async (req, res) => {
  const { from_account_id, to_account_number, amount, description } = req.body;
  if (!from_account_id || !to_account_number || !amount) {
    return res.status(400).json({ error: 'from_account_id, to_account_number and amount are required.' });
  }

  if (!Number.isFinite(amount)||Number(amount)<=0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  // Get a client from pool so we can use a transaction (rollback on failure)
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Verify the sender's account belongs to the logged-in user
    const sender = await accountModels.findByIdAndUserIdForUpdate(
      from_account_id,req.user.id,client)

    if (!sender) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Sender account not found or unauthorized.' });
    }

    // 2. Check sufficient balance
    if (parseFloat(sender.balance) < parseFloat(amount)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient balance.' });
    }

    // 3. Find the receiver account by account number
    const receiver = await accountModels.findByAccountNumber(
      to_account_number,client)
    

    if (!receiver) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Receiver account not found.' });
    }

    if (sender.id === receiver.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot transfer to the same account.' });
    }
      // deduct from sender and add to receiver
      const updatedSender=await accountModels.deductBalance(sender.id,amount,client);
      if(!updatedSender){
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'insufficient balance.' });
      }
      await accountModels.addBalance(receiver.id,amount,client);

    
    // 6. Record the transaction
    const txResult = await transactionModel.create(
      sender.id,receiver.id,amount,sender.currency,
      'transfer','completed',description,client,
    );
    
    // 7. Audit log
    await auditModel.log(req.user.id,'Transfer Completed','transactions',
      txResult.id,
      {amount,from:sender.account_number,to:receiver.account_number},client
    )
    

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Transfer successful.',
      transaction: txResult
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Transfer failed. Transaction rolled back.' });
  } finally {
    client.release();
  }
};

// POST /api/transactions/deposit  - admin only
const deposit = async (req, res) => {
  const {to_account_id, amount, description } = req.body;

  if (!to_account_id || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid account_id and amount are required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const account = await accountModels.findByIdforUpdate(
      to_account_id,client
    )

    if (!account) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Account not found.' });
    }

    await accountModels.addBalance(to_account_id, amount, client);

    const txResult = await transactionModel.createDeposit(
      to_account_id, amount, account.currency, description, client
    );

    await auditModel.log(req.user.id,'Deposit Completed','transactions',
      txResult.id,
      {amount,to:account.account_number},client
    )

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Deposit successful.',
      transaction: txResult
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