import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { useForm, type SubmitHandler } from "react-hook-form"
import toast from 'react-hot-toast';


interface Inputs{
    email:string
}
const ForgetPassword = () => {
    const navigate=useNavigate()
    const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm<Inputs>()
      
const onSubmit:SubmitHandler<Inputs>=async(data)=>{
    try {
        const response=await api.post(`auth/forget-password`,data)
        console.log("Success:", response.data)
        navigate('/login')
        toast.success('Reset link has been sent to your email ')
    } catch (error:any) {
        console.error("Error:", error.response?.data || error.message);
    }
}


  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password</h2>
          <p className="text-gray-500 mt-2 text-sm">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="name@example.com"
              type="email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 font-semibold mt-6"
          >
            Send Reset Link
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            &larr; Back to Login
          </button>
        </div>
      </div>
    </div>

  )
}

export default ForgetPassword
