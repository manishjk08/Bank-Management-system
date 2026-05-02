import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hook';
import ProtectedRoute from './components/ProtectedRoutes';
import Navbar from './components/navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import Admin from './pages/Admin';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {user && <Navbar />}
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={
  <ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>
}>
</Route>
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;