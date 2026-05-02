import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchMyAccounts } from '../store/slices/accountSlice';

const Accounts = () => {
  const dispatch = useAppDispatch();
  const { accounts, loading } = useAppSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchMyAccounts());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Accounts</h1>
        <p className="text-slate-400 text-sm mt-1">All your bank accounts</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <p className="text-slate-400">No accounts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{acc.account_type}</p>
                  <p className="text-lg font-mono font-semibold mt-1">{acc.account_number}</p>
                </div>
                <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full">
                  {acc.currency}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Available Balance</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  ${parseFloat(acc.balance.toString()).toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-slate-600">
                Opened {new Date(acc.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;