import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchAllAccounts, makeDeposit, clearDepositStatus } from '../store/slices/adminSlice';
import type { AdminAccount } from '../types';

const Admin = () => {
  const dispatch = useAppDispatch();
  const { allAccounts, loading, error, depositSuccess } = useAppSelector((state) => state.admin);

  const [selectedAccount, setSelectedAccount] = useState<AdminAccount | null>(null);
  const [depositForm, setDepositForm] = useState({ amount: '', description: '' });
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAllAccounts());
    return () => { dispatch(clearDepositStatus()); };
  }, []);

  useEffect(() => {
    if (depositSuccess) {
      dispatch(fetchAllAccounts());
      setShowModal(false);
      setDepositForm({ amount: '', description: '' });
      setSelectedAccount(null);
    }
  }, [depositSuccess]);

  const handleDepositClick = (acc: AdminAccount) => {
    setSelectedAccount(acc);
    dispatch(clearDepositStatus());
    setShowModal(true);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    dispatch(makeDeposit({
      account_id: selectedAccount.id,
      amount: parseFloat(depositForm.amount),
      description: depositForm.description || undefined,
    }));
  };

  const filtered = allAccounts.filter((acc) =>
    acc.full_name.toLowerCase().includes(search.toLowerCase()) ||
    acc.email.toLowerCase().includes(search.toLowerCase()) ||
    acc.account_number.toLowerCase().includes(search.toLowerCase())
  );

  const totalDeposited = allAccounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance.toString()), 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Manage all customer accounts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Total Accounts</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{allAccounts.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Total Funds</p>
          <p className="text-3xl font-bold text-green-400 mt-1">${totalDeposited.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Unique Customers</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">
            {new Set(allAccounts.map(a => a.email)).size}
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email or account number..."
        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
      />

      {/* Accounts table */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Account No.</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Balance</th>
                <th className="px-4 py-3 text-left">Currency</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium">{acc.full_name}</p>
                    <p className="text-xs text-slate-500">{acc.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{acc.account_number}</td>
                  <td className="px-4 py-3 capitalize text-slate-400">{acc.account_type}</td>
                  <td className="px-4 py-3 font-semibold text-green-400">
                    ${parseFloat(acc.balance.toString()).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{acc.currency}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDepositClick(acc)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Deposit
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No accounts match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Deposit modal */}
      {showModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-1">Deposit Funds</h2>
            <p className="text-slate-400 text-sm mb-4">
              Into <span className="text-white font-mono">{selectedAccount.account_number}</span> — {selectedAccount.full_name}
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-2 rounded text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Description <span className="text-slate-600">(optional)</span>
                </label>
                <input
                  type="text"
                  value={depositForm.description}
                  onChange={(e) => setDepositForm({ ...depositForm, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Initial deposit, bonus, etc."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {loading ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;