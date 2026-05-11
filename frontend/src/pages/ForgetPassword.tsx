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
    <div className="flex items-center justify-center min-h-screen">
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
  >
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Forget Password</h2>

    <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        {...register("email", { required: "Email is required" })}
        id="email"
        placeholder="Enter your email"
        type="email"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 sm:text-sm"
      />
      {errors.email && (
        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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

export default ForgetPassword
