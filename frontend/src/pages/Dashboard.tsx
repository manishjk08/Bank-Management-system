import { useAppDispatch, useAppSelector } from '../store/hook'

import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { fetchMyTransactions } from '../store/slices/transactionSlice'
import { useEffect, useMemo } from 'react';
import { fetchMyAccounts } from '../store/slices/accountSlice';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { loading, transactions } = useAppSelector((state) => state.transactions);
  const { accounts } = useAppSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchMyAccounts());
    dispatch(fetchMyTransactions());
  }, [dispatch]);

  const depositCount = transactions.filter((t) => t.transaction_type === 'deposit').length;
  const transferCount = transactions.filter((t) => t.transaction_type === 'transfer').length;

  const data = useMemo(()=>({
    labels: ["Deposits", "Transfer"],
    datasets: [
      {
        label: "Recent transactions",
        data: [depositCount, transferCount],
        backgroundColor: [
          "rgba(53, 162, 235, 0.5)",
          "rgba(255, 99, 132, 0.5)"
        ],
      },
    ],
  }) ,[depositCount,transferCount])
    
  
const options=useMemo(()=>({
   
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Recent Transactions",
      },
    },
  }

),[])
 

  const accountNumbers = accounts.map(a => a.account_number);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, here's your financial summary.</p>
      </div>

    <div className="flex gap-6">

  <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <p className="text-gray-500 text-sm">Total Balance</p>
    <p className="text-2xl font-semibold mt-2">
      ${accounts.reduce((a, c) => a + Number(c.balance), 0).toFixed(2)}
    </p>
  </div>

  <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <p className="text-gray-500 text-sm">Income</p>
    <p className="text-2xl font-semibold mt-2 text-green-600">
      ${transactions
        .filter(t => t.transaction_type === "deposit")
        .reduce((a, c) => a + Number(c.amount), 0)
        .toFixed(2)}
    </p>
  </div>

  <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <p className="text-gray-500 text-sm">Expenses</p>
    <p className="text-2xl font-semibold mt-2 text-red-500">
      ${transactions
        .filter(t =>
          t.transaction_type === "transfer" &&
          t.to_account &&
          !accountNumbers.includes(t.to_account)
        )
        .reduce((a, c) => a + Number(c.amount), 0)
        .toFixed(2)}
    </p>
  </div>

</div>
     
     

      <div className="space-y-4">
        <h5 className="text-lg font-semibold text-gray-800 px-1">Transaction Analytics</h5>
        {loading ? (
          <div className="flex justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm w-full md:w-1/2 lg:w-1/3">
            <p className="text-gray-500 animate-pulse font-medium">Loading analytics...</p>
          </div>
        ) : (
          <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
            <Pie data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Dashboard;
