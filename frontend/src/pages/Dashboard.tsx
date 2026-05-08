import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchMyAccounts } from '../store/slices/accountSlice';
import { fetchMyTransactions } from '../store/slices/transactionSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#BABF94', '#BFA28C', '#A98B76'];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { accounts } = useAppSelector((state) => state.accounts);
  const { transactions } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchMyAccounts());
    dispatch(fetchMyTransactions());
  }, [dispatch]);

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance.toString()), 0);

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

  const typeBreakdown = ['transfer', 'deposit', 'withdrawal'].map((type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: transactions.filter(t => t.transaction_type === type).length
  })).filter(t => t.value > 0);

  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3E4C9' }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#A98B76' }}>
            Welcome back, {user?.full_name} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#BFA28C' }}>
            Here's your financial overview
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#BFA28C' }}>
            <p className="text-sm" style={{ color: '#BFA28C' }}>Total Balance</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#A98B76' }}>
              ${totalBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#BFA28C' }}>
            <p className="text-sm" style={{ color: '#BFA28C' }}>Accounts</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#A98B76' }}>{accounts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#BFA28C' }}>
            <p className="text-sm" style={{ color: '#BFA28C' }}>Total Transactions</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#A98B76' }}>{transactions.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#BFA28C' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#A98B76' }}>7-Day Activity</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BFA28C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#BFA28C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBE0D0" />
                <XAxis dataKey="day" stroke="#A98B76" tick={{ fontSize: 12, fill: '#A98B76' }} />
                <YAxis stroke="#A98B76" tick={{ fontSize: 12, fill: '#A98B76' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #BFA28C', borderRadius: '8px', color: '#A98B76' }}
                  labelStyle={{ color: '#A98B76' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#A98B76" fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#BFA28C' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#A98B76' }}>Transaction Types</h2>
            {typeBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                    {typeBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #BFA28C', borderRadius: '8px', color: '#A98B76' }}
                  />
                  <Legend wrapperStyle={{ color: '#A98B76', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-sm" style={{ color: '#BFA28C' }}>
                No transactions yet
              </div>
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#BFA28C' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#A98B76' }}>Recent Transactions</h2>
          {recentTxns.length === 0 ? (
            <p className="text-sm" style={{ color: '#BFA28C' }}>No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentTxns.map((txn) => (
                <div key={txn.id} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: '#EBE0D0' }}>
                  <div>
                    <p className="text-sm font-medium capitalize" style={{ color: '#A98B76' }}>{txn.transaction_type}</p>
                    <p className="text-xs" style={{ color: '#BFA28C' }}>{txn.from_account_id ?? '—'} → {txn.to_account_id ?? '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: '#A98B76' }}>${parseFloat(txn.amount.toString()).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      txn.status === 'completed' ? 'bg-[#BABF94] text-white' :
                      txn.status === 'failed' ? 'bg-[#A98B76] text-white' :
                      'bg-[#BFA28C] text-white'
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
    </div>
  );
};

export default Dashboard;