import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="text-xl font-bold text-blue-400">
        🏦 BankingApp
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
        <Link to="/accounts" className="hover:text-blue-400 transition">Accounts</Link>
        <Link to="/transactions" className="hover:text-blue-400 transition">Transactions</Link>
        <Link to="/transfer" className="hover:text-blue-400 transition">Transfer</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="hover:text-yellow-400 transition">Admin</Link>
        )}
        <div className="flex items-center gap-3 ml-4 border-l border-slate-700 pl-4">
          <span className="text-slate-400">{user?.full_name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;