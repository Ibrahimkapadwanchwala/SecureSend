import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const baseClasses =
    "block px-3 py-2 rounded-lg transition-colors duration-200";

  const activeClasses = "bg-black text-white";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

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
        <h1 className="text-2xl font-semibold mb-8">SecureSend</h1>

        <nav className="space-y-3">

          <NavLink
            to="/"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/transactions"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            Transactions
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            Settings
          </NavLink>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
