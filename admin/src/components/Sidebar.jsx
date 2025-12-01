import { NavLink } from "react-router-dom";
import { FiHome, FiBarChart2, FiList, FiUsers, FiBox } from "react-icons/fi";

export default function Sidebar() {
  const menu = [
    { path: "/", label: "Dashboard", icon: <FiHome /> },
    { path: "/analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { path: "/products", label: "Products", icon: <FiBox /> },
    { path: "/orders", label: "Orders", icon: <FiList /> },
    { path: "/customers", label: "Customers", icon: <FiUsers /> },
  ];

  return (
    <div className="w-64 bg-yellow-400 p-6 shadow-lg">
      <h1 className="text-3xl font-bold mb-10">Deonde</h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink
            to={item.path}
            key={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer
              ${isActive ? "bg-black text-white" : "hover:bg-white hover:text-black"}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
