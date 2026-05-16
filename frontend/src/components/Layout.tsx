
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import Navbar from "../components/navbar";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {user && <Navbar />}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Toaster position="top-right" reverseOrder={false} />
        
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
