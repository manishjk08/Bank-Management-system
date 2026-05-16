import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchMyTransactions } from '../store/slices/transactionSlice';

const statusStyle: Record<string, string> = {
  completed: 'bg-green-100 text-green-700 border border-green-200',
  failed: 'bg-red-100 text-red-700 border border-red-200',
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
};

const Transactions = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchMyTransactions());
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transactions</h1>
        <p className="text-gray-500 text-sm mt-1">Your full transaction history</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 animate-pulse font-medium">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No transactions yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4">To</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 capitalize font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${t.transaction_type === 'deposit' ? 'bg-green-100 text-green-600' : t.transaction_type === 'transfer' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                          {t.transaction_type === 'deposit' ? '↓' : t.transaction_type === 'transfer' ? '⇄' : '↑'}
                        </div>
                        {t.transaction_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{t.from_account ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{t.to_account ?? '—'}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${parseFloat(t.amount.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs max-w-[200px] truncate">{t.description ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;