import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hook';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;