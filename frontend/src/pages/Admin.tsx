import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { fetchAllAccounts, makeDeposit, clearDepositStatus, ApproveAccounts, PendingAccounts,  } from "../store/slices/adminSlice";
import toast from 'react-hot-toast';

const Admin = () => {
  const { allAccounts, loading, error, depositSuccess,pendingAccounts } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  const [depositAccountId, setDepositAccountId] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDesc, setDepositDesc] = useState("");
 

  useEffect(() => {
    dispatch(fetchAllAccounts());
  }, [dispatch]);

  useEffect(()=>{
    dispatch(PendingAccounts())
  },[dispatch])

  useEffect(() => {
    if (depositSuccess) {
      toast.success("Deposit successful!");
      setDepositAccountId(null);
      setDepositAmount("");
      setDepositDesc("");
      dispatch(clearDepositStatus());
      dispatch(fetchAllAccounts());
    }
  }, [depositSuccess, dispatch]);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAccountId && depositAmount) {
      dispatch(
        makeDeposit({
          to_account_id: depositAccountId,
          amount: parseFloat(depositAmount),
          description: depositDesc,
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Manage all user accounts</p>
      </div>

      {loading && allAccounts.length === 0 ? (
        <p className="text-slate-400">Loading accounts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
                    {acc.account_type}
                  </p>
                  <p className="text-lg font-mono font-semibold mt-1">
                    {acc.account_number}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs px-3 py-1 rounded-full font-mono">
                  {acc.currency}
                </span>
              </div>

              <div>
                <p className="text-slate-500 text-xs font-mono">Available Balance</p>
                <p className="text-3xl font-bold mt-1 font-mono">
                  ${parseFloat(acc.balance.toString()).toFixed(2)}
                </p>
              </div>

              {depositAccountId === acc.id ? (
                <form onSubmit={handleDeposit} className="mt-4 space-y-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded text-sm bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={depositDesc}
                    onChange={(e) => setDepositDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded text-sm bg-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm w-full font-medium transition-colors"
                    >
                      {loading ? "Processing..." : "Confirm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositAccountId(null)}
                      className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded text-sm w-full font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setDepositAccountId(acc.id)}
                  className="w-full mt-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Make Deposit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div>
        {pendingAccounts.map((p)=>(
          <div key={p.id}>
            <p>{p.user_id}</p>
            <p>{p.status}</p>
            <p>{p.account_type}</p>
            
          </div>


        )
      
      
      
      )}
        
      </div>
      
    </div>
  );
};

export default Admin;
