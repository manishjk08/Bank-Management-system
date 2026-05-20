import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import { useEffect } from "react";
import { refreshToken } from "./store/slices/authSlice";
import { useAppDispatch } from "./store/hook";


const router = createBrowserRouter([
  {
    element:<Layout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forget-password", element: <ForgetPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/accounts",
        element: (
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/transfer",
        element: (
          <ProtectedRoute>
            <Transfer />
          </ProtectedRoute>
        ),
      },
      {
 
},
      {
        path: "/admin",
        element: (
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
