
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import Navbar from "../components/navbar";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      {user && <Navbar />}
      <main className="p-6 max-w-6xl mx-auto">
        <Toaster position="top-right" reverseOrder={false} />
        
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
