import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { makeTransfer, clearTransferStatus } from '../store/slices/transactionSlice';
import { fetchMyAccounts } from '../store/slices/accountSlice';

const Transfer = () => {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.accounts);
  const { loading, error, transferSuccess } = useAppSelector((state) => state.transactions);

  const [form, setForm] = useState({
    from_account_id: '',
    to_account_number: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchMyAccounts());
    return () => { dispatch(clearTransferStatus()); };
  }, []);

  useEffect(() => {
    if (transferSuccess) {
      dispatch(fetchMyAccounts());
      setForm({ from_account_id: '', to_account_number: '', amount: '', description: '' });
    }
  }, [transferSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(makeTransfer({
      from_account_id: parseInt(form.from_account_id),
      to_account_number: form.to_account_number,
      amount: parseFloat(form.amount),
      description: form.description || undefined,
    }));
  };

  const selectedAccount = accounts.find(a => a.id === parseInt(form.from_account_id));

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transfer Funds</h1>
        <p className="text-slate-400 text-sm mt-1">Send money to another account</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {transferSuccess && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
          ✅ Transfer completed successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">From Account</label>
          <select
            value={form.from_account_id}
            onChange={(e) => setForm({ ...form, from_account_id: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_number} — ${parseFloat(acc.balance.toString()).toFixed(2)}
              </option>
            ))}
          </select>
          {selectedAccount && (
            <p className="text-xs text-slate-500 mt-1">
              Available: <span className="text-green-400">${parseFloat(selectedAccount.balance.toString()).toFixed(2)}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">To Account Number</label>
          <input
            type="text"
            value={form.to_account_number}
            onChange={(e) => setForm({ ...form, to_account_number: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
            placeholder="ACC1234567890"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Amount (USD)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Description <span className="text-slate-600">(optional)</span></label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="Rent, invoice #123, etc."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 rounded-lg font-semibold transition"
        >
          {loading ? 'Processing...' : 'Send Transfer'}
        </button>
      </form>
    </div>
  );
};

export default Transfer;