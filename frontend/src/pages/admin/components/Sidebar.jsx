import { useEffect, useState } from "react";
import {
  FiHome,
  FiBarChart2,
  FiList,
  FiUsers,
  FiBox,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Sidebar({ onChangePage }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { id: "products", label: "Products", icon: <FiBox /> },
    { id: "orders", label: "Orders", icon: <FiList /> },
    { id: "customers", label: "Customers", icon: <FiUsers /> },
  ];

  const handleClick = (id) => {
    setActive(id);
    onChangePage(id);
    setOpen(false);
  };

  /* 🔒 Prevent body scroll on mobile */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  return (
    <>
      {/* 📱 Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-yellow-400 px-4 py-3 shadow">
        <h1 className="text-lg font-bold">Deonde</h1>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <FiMenu size={26} />
        </button>
      </div>

      {/* 🌑 Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 📂 Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64
          bg-yellow-400 p-6 shadow-lg
          z-10
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Deonde</h1>
          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`
                flex items-center w-full space-x-3 px-4 py-2.5 rounded-xl
                transition-all duration-200
                ${
                  active === item.id
                    ? "bg-white text-black shadow"
                    : "hover:bg-white/80 hover:text-black"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
