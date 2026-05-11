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
      
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
  
  {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
  
  <form onSubmit={handleSubmit(onSubmit)}>
   

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
            value: 2,
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
      {loading ? "Loging..." : "Login"}
    </button>
  </form>
 <p className="mt-4 text-center text-gray-600">
    Dont have account? <Link to="/register" className="text-blue-500 hover:text-blue-600">Register here</Link>
  </p>
  
  <p className="mt-4 text-center text-gray-600">
    Forget Password? <Link to="/forget-password" className="text-blue-500 hover:text-blue-600">Reset here</Link>
  </p>
</div>
      
    )
}
export default Login