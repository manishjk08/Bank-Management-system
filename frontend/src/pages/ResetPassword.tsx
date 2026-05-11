import { useParams,useNavigate } from "react-router-dom"
import api from "../services/api"
import { useForm, type SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"


interface Inputs{
    password:string
}
const ResetPassword = () => {
const {token}=useParams()
const navigate=useNavigate()
    const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm<Inputs>()
      
const onSubmit:SubmitHandler<Inputs>=async(data)=>{
    try {
        const response=await api.post(`auth/reset-password/${token}`,data)
        console.log("Success:", response.data)
        navigate('/login')
        toast.success('Password reset successfully')
    } catch (error:any) {
        console.error("Error:", error.response?.data || error.message);
    }
}


  return (
    <div className="flex items-center justify-center min-h-screen">
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
  >
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reset Password</h2>

    <div className="mb-4">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        {...register("password", { required: "New Password is required" })}
        id="password"
        placeholder="Enter your Password"
        type="password"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 sm:text-sm"
      />
      {errors.password && (
        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
      )}
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md 
                 hover:bg-blue-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:ring-offset-1"
    >
      Submit
    </button>
  </form>


</div>

  )
}

export default ResetPassword
