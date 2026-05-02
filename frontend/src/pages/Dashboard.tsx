import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchMyAccounts } from '../store/slices/accountSlice';
import { fetchMyTransactions } from '../store/slices/transactionSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { accounts } = useAppSelector((state) => state.accounts);
  const { transactions } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchMyAccounts());
    dispatch(fetchMyTransactions());
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance.toString()), 0);

  // Build last 7 days activity for area chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const label = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTxns = transactions.filter(t => {
      const txDate = new Date(t.created_at);
      return txDate.toDateString() === date.toDateString();
    });
    const amount = dayTxns.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    return { day: label, amount };
  });

  // Transaction type breakdown for pie chart
  const typeBreakdown = ['transfer', 'deposit', 'withdrawal'].map((type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: transactions.filter(t => t.transaction_type === type).length
  })).filter(t => t.value > 0);

  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.full_name} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Here's your financial overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-slate-400 text-sm">Total Balance</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-slate-400 text-sm">Accounts</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{accounts.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-slate-400 text-sm">Total Transactions</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{transactions.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">7-Day Activity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmt)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Transaction Types</h2>
          {typeBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {typeBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
              No transactions yet
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Recent Transactions</h2>
        {recentTxns.length === 0 ? (
          <p className="text-slate-500 text-sm">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {recentTxns.map((txn) => (
              <div key={txn.id} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium capitalize">{txn.transaction_type}</p>
                  <p className="text-xs text-slate-500">{txn.from_account ?? '—'} → {txn.to_account ?? '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-400">${parseFloat(txn.amount.toString()).toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    txn.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    txn.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;