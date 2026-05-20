import { useAppDispatch, useAppSelector } from "../store/hook"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { makeTransfer } from "../store/slices/transactionSlice"
import { fetchMyAccounts } from "../store/slices/accountSlice"
import { useEffect } from "react"
import toast from "react-hot-toast"

interface Inputs{
  from_account_id:number
  to_account_number:string,
  amount:number,
  description:string,
}

const Transfer = () => {
const {loading,error}=useAppSelector((state)=>state.transactions)
const {accounts}=useAppSelector((state)=>state.accounts)
const navigate=useNavigate()
const dispatch=useAppDispatch()


const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  useEffect(()=>{
    dispatch(fetchMyAccounts())
  },[])
  
  const onSubmit: SubmitHandler<Inputs> = async(data)=>{
    try {
      const result= await dispatch(makeTransfer({
        from_account_id:data.from_account_id,
        to_account_number:data.to_account_number,
        amount:data.amount,
        description:data.description
      }))
      if(makeTransfer.fulfilled.match(result)){
        toast.success('Transfer completed')
        navigate('/transactions')
      }else if(makeTransfer.rejected.match(result)){
        toast.error(result.payload as string)
      }
    } catch (error) {
      console.log('Transfer failed ',error)
      
    }
  }
  
 
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Send Money</h2>
          <p className="text-gray-500 mt-2 text-sm">Transfer funds instantly and securely</p>
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
              {...register("from_account_id", { required: "Account is required" })}
            >
              <option value="">Choose your account</option>
             { accounts.filter(account=>account.balance>0)
              .map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_type} - {account.account_number} (${account.balance})
                </option>
              ))}
            </select>
            {errors.from_account_id && <span className="text-red-500 text-sm mt-1.5 block">{errors.from_account_id.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
            <input
              type="text"
              placeholder="e.g. 1234567890"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200 font-mono"
              {...register("to_account_number", { required: "Account number is required" })}
            />
            {errors.to_account_number && <span className="text-red-500 text-sm mt-1.5 block">{errors.to_account_number.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200 font-semibold text-lg"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 1, message: "Amount must be a positive number" },
              })}
            />
            {errors.amount && <span className="text-red-500 text-sm mt-1.5 block">{errors.amount.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <input
              type="text"
              placeholder="What's this transfer for?"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <span className="text-red-500 text-sm mt-1.5 block">{errors.description.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-6 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : "Send Money Now"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Transfer
