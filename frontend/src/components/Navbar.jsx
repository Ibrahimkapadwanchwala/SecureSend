import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api.js";

const Navbar = ({ setSidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
    setMobileMenu(false);
  };

const handleLogout = async () => {
  try {
    await api.post("/auth/logout");   
    setUser(null);                    
    setOpen(false);
    navigate("/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 relative">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-600"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-gray-800">
          Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">

        <button className="hidden sm:block text-gray-500 hover:text-black transition">
          🔔
        </button>

        {/* Avatar */}
        <div className="relative flex items-center justify-center w-10 h-10">
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium"
          >
            {getInitials(user?.name)}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-44 bg-white shadow-lg rounded-xl border border-gray-100 py-2 z-50">

              <div className="px-4 py-2 text-xs text-gray-400">
                Signed in as
              </div>

              <div className="px-4 pb-2 text-sm font-medium border-b">
                {user?.email}
              </div>

              <button
                onClick={() => handleNavigate("/") }
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavigate("/settings")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-500"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-sm md:hidden">
          <div className="flex flex-col p-4 space-y-3">

            <button
              onClick={() => handleNavigate("/")}
              className="text-left text-gray-700"
            >
              Dashboard
            </button>

            <button
              onClick={() => handleNavigate("/transactions")}
              className="text-left text-gray-700"
            >
              Transactions
            </button>

            <button
              onClick={() => handleNavigate("/settings")}
              className="text-left text-gray-700"
            >
              Settings
            </button>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
