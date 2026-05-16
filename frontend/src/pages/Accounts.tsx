import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { createNewAccounts, fetchMyAccounts } from '../store/slices/accountSlice';
import toast from 'react-hot-toast';

type Account_Type='savings'|'current'|'fixed_deposit'

interface Inputs{
  account_type: Account_Type
}
const Accounts = () => {
  const dispatch = useAppDispatch();
  const { accounts, loading } = useAppSelector((state) => state.accounts);

  const [showInput,setShowInput]=useState(false)
  const[form,setForm]=useState<Inputs>({account_type:'savings'})

  useEffect(() => {
    dispatch(fetchMyAccounts());
  }, [dispatch]);


  const handleClick=()=>{
    setShowInput(true)
  }
  const handleSubmit=()=>{
    if(form.account_type.trim() !== ''){
      dispatch(createNewAccounts(form))
      toast.success('New account request is sent')
      setForm({account_type:'savings'})
      setShowInput(false)
    }
    
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Accounts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view all your bank accounts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {showInput && (
            <select
              value={form.account_type}
              onChange={(e) => setForm({ account_type: e.target.value as Account_Type})}
              className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-gray-700 transition-all duration-200"
            >
              <option value="" disabled>Select account type</option>
              <option value="current">Current</option>
              <option value="saving">Saving</option>
              <option value="fixed_deposit">Fixed Deposit</option>
            </select>
          )}
          <button
            onClick={showInput ? handleSubmit : handleClick}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            {showInput ? "Submit Request" : "+ New Account"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 animate-pulse font-medium">Loading accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No accounts found.</p>
          <p className="text-gray-400 text-sm mt-1">Create a new account to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-2xl p-6 shadow-lg shadow-gray-900/10 group hover:-translate-y-1 transition-all duration-300 border border-gray-800"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                    {acc.account_type}
                  </p>
                  <p className="text-lg font-mono tracking-wider font-medium mt-1 text-gray-100">
                    {acc.account_number}
                  </p>
                </div>
                <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                  {acc.currency}
                </span>
              </div>

              <div className="mt-8 relative z-10">
                <p className="text-gray-400 text-xs font-medium mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  ${parseFloat(acc.balance.toString()).toFixed(2)}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 relative z-10 flex justify-between items-center">
                <p className="text-xs text-gray-400 font-medium">
                  Opened {new Date(acc.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-[-8px]">
                  <div className="w-6 h-6 rounded-full bg-blue-500/80 mix-blend-screen"></div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500/80 mix-blend-screen"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;