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
        <p className="text-blue-400 text-sm mt-1">Your full transaction history</p>
      </div>

      {loading ? (
        <p className="text-blue-400">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-blue-400">No transactions yet.</p>
      ) : (
        <div className="border border-blue-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-100 text-blue-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">From</th>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y ">
              {transactions.map((t) => (
                <tr key={t.id} >
                  <td className="px-4 py-3 capitalize font-medium">{t.transaction_type}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{t.from_account ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{t.to_account ?? '—'}</td>
                  <td className="px-4 py-3 text-blue-400 font-semibold">
                    ${parseFloat(t.amount.toString()).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyle[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{t.description ?? '—'}</td>
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