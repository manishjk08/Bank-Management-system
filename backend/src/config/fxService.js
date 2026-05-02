import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}`;

// Get live exchange rate between two currencies
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await fetch(`${BASE_URL}/pair/${fromCurrency}/${toCurrency}`);

    if (!response.ok) {
      throw new Error(`FX API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error(`FX API returned failure: ${data['error-type']}`);
    }

    return {
      from: fromCurrency,
      to: toCurrency,
      rate: data.conversion_rate,
      timestamp: data.time_last_update_utc
    };
  } catch (err) {
    console.error('FX Service error:', err.message);
    throw err;
  }
};

// Convert an amount from one currency to another
const convertAmount = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, rate: 1 };
  }

  const { rate } = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = parseFloat((amount * rate).toFixed(2));

  return { convertedAmount, rate };
};

export { getExchangeRate, convertAmount };