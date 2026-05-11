import { useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { useAppDispatch,useAppSelector } from "../store/hook";
import  {registerUser,clearError} from '../store/slices/authSlice';
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form";
import type { RootState } from "../store";

interface Inputs {
  full_name:string,
  email:string,
  password:string
}

  const Register=()=>{
  const navigate=useNavigate();
  const dispatch=useAppDispatch();
  const {loading,error}= useAppSelector((state:RootState)=>state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async(data)=>{
    try {
      await dispatch(registerUser({ 
       full_name: data.full_name,
       email: data.email,
       password: data.password 
      })).unwrap()

      navigate('/login')

    } catch (error) {
      console.error('Registration failed',error)
    }
  }

    useEffect (()=>{
      return ()=>{
      dispatch(clearError())
    };
    },[dispatch])

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
  
  {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
  
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...register("full_name", { 
          required: "Full name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters"
          }
        })}
      />
      {errors.full_name && <span className="text-red-500 text-sm mt-1 block">{errors.full_name.message}</span>}
    </div>

    <div className="mb-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
      />
      {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
    </div>

    <div className="mb-6">
      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...register("password", { 
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters"
          }
        })}
      />
      {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>}
    </div>

    <button 
      type="submit" 
      disabled={loading}
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
    >
      {loading ? "Registering..." : "Register"}
    </button>
  </form>
  
  <p className="mt-4 text-center text-gray-600">
    Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-600">Login here</Link>
  </p>
</div>
  )
}
export default Register;