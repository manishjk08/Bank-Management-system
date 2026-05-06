import { getExchangeRate, convertAmount } from '../config/fxService.js';
import pool from '../config/db.js';

// GET /api/fx/rate?from=USD&to=NPR
const getRate = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'from and to currency codes are required.' });
  }

  try {
    const rateData = await getExchangeRate(from.toUpperCase(), to.toUpperCase());
    res.json(rateData);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch exchange rate.' });
  }
};

// GET /api/fx/convert?from=USD&to=NPR&amount=100
const convert = async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'from, to, and amount are required.' });
  }

  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  try {
    const result = await convertAmount(
      parseFloat(amount),
      from.toUpperCase(),
      to.toUpperCase()
    );

    res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      originalAmount: parseFloat(amount),
      convertedAmount: result.convertedAmount,
      rate: result.rate
    });
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed.' });
  }
};

// GET /api/fx/my-balances — show user's balances converted to NPR
const getMyBalancesConverted = async (req, res) => {
  const { target = 'NPR' } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, account_number, account_type, balance, currency
       FROM accounts WHERE user_id = $1`,
      [req.user.id]
    );

    const accounts = result.rows;

    // Convert each account balance to target currency
    const converted = await Promise.all(
      accounts.map(async (acc) => {
        const { convertedAmount, rate } = await convertAmount(
          parseFloat(acc.balance),
          acc.currency,
          target.toUpperCase()
        );
        return {
          ...acc,
          converted_balance: convertedAmount,
          converted_currency: target.toUpperCase(),
          exchange_rate: rate
        };
      })
    );

    res.json({ accounts: converted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch converted balances.' });
  }
};

export { getRate, convert, getMyBalancesConverted };