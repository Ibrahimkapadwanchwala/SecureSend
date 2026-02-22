import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // close on mobile
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-black font-semibold"
      : "text-gray-600 hover:text-black";

  return (
    <>
    
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

     
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full
          w-64
          bg-white
          border-r border-gray-200
          p-6
          z-50
          transform
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h1 className="text-2xl font-semibold mb-8">
          SecureSend Admin
        </h1>

        <nav className="space-y-4 text-sm">
          <div
            onClick={() => handleNavigate("/admin")}
            className={`cursor-pointer transition ${isActive("/admin")}`}
          >
            All Users
          </div>

          <div
            onClick={() => handleNavigate("/admin/audit")}
            className={`cursor-pointer transition ${isActive("/admin/audit")}`}
          >
            Audit Logs
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
