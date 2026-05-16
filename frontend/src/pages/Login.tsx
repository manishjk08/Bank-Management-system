import {useEffect} from 'react'
import { useNavigate,Link,  } from 'react-router-dom'
import { useAppDispatch,useAppSelector} from '../store/hook'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { RootState } from '../store'

import { login,clearError } from '../store/slices/authSlice'


interface Inputs{
  email:string,
  password:string
}

const Login=()=>{
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const{loading,error}=useAppSelector((state:RootState)=>state.auth)

   const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Inputs>()
  
    const onSubmit:SubmitHandler<Inputs>=async (data)=>{
      try {
        await dispatch(login({
          email:data.email,
          password:data.password
        })).unwrap()
        navigate('/dashboard')
      } catch (error) {
        console.error('Login failed',error)
      }
    }

     useEffect (()=>{
      return ()=>{
      dispatch(clearError())
    };
    },[dispatch])

    return(
      
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
            </div>
            
            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center">{error}</div>}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <span className="text-red-500 text-sm mt-1.5 block">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 2,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && <span className="text-red-500 text-sm mt-1.5 block">{errors.password.message}</span>}
                <div className="flex justify-end mt-2">
                  <Link to="/forget-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</Link>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-6"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      
    )
}
export default Login