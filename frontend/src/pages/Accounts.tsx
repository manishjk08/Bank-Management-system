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
      <button
        onClick={showInput ? handleSubmit : handleClick}
        type="button"
        className="px-6 py-3 rounded-lg shadow-md text-black font-semibold bg-blue-100 hover:bg-blue-200"
      >
        {showInput ? "Submit" : "Create New Account"}
      </button>

      {showInput && (
        <select
    value={form.account_type}
    onChange={(e) => setForm({ account_type: e.target.value as Account_Type})}
    className="px-6 py-3 rounded-lg shadow-md border-2 text-sm mt-2"
  >
    <option value="" disabled>
      Select account type
    </option>
    <option value="current">Current</option>
    <option value="saving">Saving</option>
    <option value="fixed_deposit">Fixed Deposit</option>
  </select>
      )}

      <div>
        <h1 className="text-2xl font-bold">My Accounts</h1>
        <p className="text-slate-400 text-sm mt-1">All your bank accounts</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <p className="text-slate-400">No accounts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {accounts.map((acc) => (
    <div
      key={acc.id}
      className="bg-linear-to-r from-blue-400 to-indigo-600 border-2 border-blue-100 rounded-xl p-6 space-y-4 shadow-lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-white uppercase tracking-widest font-mono">
            {acc.account_type}
          </p>
          <p className="text-lg font-mono font-semibold mt-1 text-white">
            {acc.account_number}
          </p>
        </div>
        <span className="bg-blue-100 text-black text-xs px-3 py-1 rounded-full font-mono">
          {acc.currency}
        </span>
      </div>

      <div>
        <p className="text-white text-xs font-mono">Available Balance</p>
        <p className="text-3xl font-bold text-white mt-1 font-mono">
          ${parseFloat(acc.balance.toString()).toFixed(2)}
        </p>
      </div>

      <p className="text-xs text-white font-mono">
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