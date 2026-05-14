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
 
  return (
<>
  <div>
  <h5 className="text-lg font-bold mb-4">Your Accounts</h5>
  <div className="flex flex-row gap-6 flex-wrap">
    {accounts.map((a) => (
      <div
        key={a.account_number}
        className="w-64 h-36 rounded-xl shadow-lg bg-linear-to-r from-blue-400 to-indigo-600 text-white p-4 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Account</p>
          <p className="text-xs">{a.account_type}</p>
        </div>
        <div>
          <p className="tracking-widest text-lg font-bold">{a.account_number}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">Balance</p>
          <p className="text-lg font-semibold">$ {a.balance}</p>
        </div>
      </div>
    ))}
  </div>
</div>

{loading ? (
  <p>Data is fetching...</p>
):
<div className="w-75 border-2 mt-4">
    <Pie data={data} options={options} />
  </div>
}
  
</>
  );
};

export default Dashboard;
