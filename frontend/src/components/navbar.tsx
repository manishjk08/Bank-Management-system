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
    <div className="sticky top-0 z-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
      
    
      <div className="flex-shrink-0">
        <Link to="/dashboard" className="text-blue-600 font-extrabold text-2xl tracking-tight hover:text-blue-700 transition-colors">
          BankApp
        </Link>
      </div>

      
      <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
        <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
          Dashboard
        </Link>
        <Link to="/accounts" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
          Accounts
        </Link>
        <Link to="/transfer" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
          Transfer
        </Link>
        <Link to="/transactions" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
          Transactions
        </Link>
        
        {user?.role === 'admin' && (
          <Link to="/admin" className="px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200">
            Admin 
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center justify-center px-3 py-1.5 bg-gray-100 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {user ? (user.full_name).toUpperCase() : ''}
          </span>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/50">
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>
    </div>
  )
}

export default navbar
