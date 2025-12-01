import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/AdminProducts";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Analytics from "../pages/Analytics";

export default function AdminLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar onChangePage={setActivePage} />

      {/* Dynamic Page Area */}
      <main className="flex-1 p-10">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "products" && <Products />}
        {activePage === "orders" && <Orders />}
        {activePage === "customers" && <Customers />}
      </main>
    </div>
  );
}
