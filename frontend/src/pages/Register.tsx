import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { registerUser, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">🏦 BankingApp</h1>
        <p className="text-slate-400 mb-6 text-sm">Create your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-2 rounded mb-4 text-sm">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 rounded-lg font-semibold transition"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-slate-400 text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;