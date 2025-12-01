import { FiHome, FiBarChart2, FiList, FiUsers, FiBox } from "react-icons/fi";

export default function Sidebar({ onChangePage }) {
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { id: "products", label: "Products", icon: <FiBox /> },
    { id: "orders", label: "Orders", icon: <FiList /> },
    { id: "customers", label: "Customers", icon: <FiUsers /> },
  ];

  return (
    <div className="w-64 bg-yellow-400 p-6 shadow-lg">
      <h1 className="text-3xl font-bold mb-10">Deonde</h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangePage(item.id)}
            className="flex items-center w-full space-x-3 px-4 py-2 rounded-xl
                       hover:bg-white hover:text-black"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
