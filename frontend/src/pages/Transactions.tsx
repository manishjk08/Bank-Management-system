import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchMyTransactions } from '../store/slices/transactionSlice';

const statusStyle: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
};

const Transactions = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchMyTransactions());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-slate-400 text-sm mt-1">Your full transaction history</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-slate-400">No transactions yet.</p>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">From</th>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 capitalize font-medium">{txn.transaction_type}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{txn.from_account ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{txn.to_account ?? '—'}</td>
                  <td className="px-4 py-3 text-blue-400 font-semibold">
                    ${parseFloat(txn.amount.toString()).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyle[txn.status]}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;