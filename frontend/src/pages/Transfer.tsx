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
      dispatch(makeTransfer({
        from_account_id:data.from_account_id,
        to_account_number:data.to_account_number,
        amount:data.amount,
        description:data.description
      }))
      toast.success('Transfer completed')
      navigate('/transactions')
    } catch (error) {
      console.log('Transfer failed ',error)
    }
  }
  
 
  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Send Money</h2>
  
  {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
  
  <form onSubmit={handleSubmit(onSubmit)}>
    
<div className="mb-4">
  <select
    
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    {...register("from_account_id", {
      required: "Account is required",
    })}
  >
    <option value="">Choose your account</option>

    {accounts.map((account) => (
      <option key={account.id} value={account.id}>
        {account.account_number}
      </option>
    ))}
  </select>

  {errors.from_account_id && (
    <span className="text-red-500 text-sm mt-1 block">
      {errors.from_account_id.message}
    </span>
  )}
</div>

    <div className="mb-4">
      <input
        type="text"
        placeholder="Write account number you want to send money"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...register("to_account_number", { 
          required: "Account number is required",
          
        })}
      />
      {errors.to_account_number && <span className="text-red-500 text-sm mt-1 block">{errors.to_account_number.message}</span>}
    </div>

    <div className="mb-6">
      <input
  type="number"
  placeholder="Amount"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  {...register("amount", {
    required: "Amount is required",
    valueAsNumber: true,
    min: {
      value: 1,
      message: "Amount must be a positive number",
    },
  })}
/>
      {errors.amount && <span className="text-red-500 text-sm mt-1 block">{errors.amount.message}</span>}
    </div>
    <div className="mb-6">
      <input
        type="text"
        placeholder="Description"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...register("description", { 
          required: "Description is required",
          
        })}
      />
      {errors.description && <span className="text-red-500 text-sm mt-1 block">{errors.description.message}</span>}
    </div>

    <button 
      type="submit" 
      disabled={loading}
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
    >
      {loading ? "Sending..." : "Transfer"}
    </button>
  </form>
</div>
    </div>
  )
}

export default Transfer
