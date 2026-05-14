import { Link } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hook'

const navbar = () => {
const dispatch=useAppDispatch()

const{user}=useAppSelector((state)=>state.auth)
const handleLogout=()=>{
  dispatch(logout())
}

  return (
    <div>
      <nav className="bg-blue-100  shadow-md">
      <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
      
    
      <div className="text-black font-bold text-xl">
        BankApp
      </div>

      
      <div className="flex items-center space-x-2">
        <Link to="/dashboard" className="px-4 py-2 text-black  hover:text-[#8A7650] rounded-md transition">
          Dashboard
        </Link>
        <Link to="/accounts" className="px-4 py-2 text-black  hover:text-[#8A7650] rounded-md transition">
          Accounts
        </Link>
        <Link to="/transfer" className="px-4 py-2 text-black  hover:text-[#8A7650] rounded-md transition">
          Transfer
        </Link>
        <Link to="/transactions" className="px-4 py-2 text-black  hover:text-[#8A7650] rounded-md transition">
          Transaction
        </Link>
        
        {user?.role === 'admin' && (
          <Link to="/admin" className="px-4 py-2 text-indigo-700 font-semibold hover:text-indigo-900 rounded-md transition">
            Admin 
          </Link>
        )}
        
        <button onClick={handleLogout} className="px-4 py-2 text-black hover:bg-blue-200 rounded-md transition">
          Logout
        </button>
        <div className='px-4 py-2'>
          {user?(user.full_name).toUpperCase():''}
        </div>
      </div>
    </div>
  </div>
</nav>
    </div>
  )
}

export default navbar
