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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onChangePage={setActivePage} />

      {/* Main Content */}
      <main
        className="
          md:ml-64        /* space for sidebar on desktop */
          pt-16 md:pt-6   /* space for mobile top bar */
          px-4 sm:px-6 md:px-8 lg:px-10
          pb-10
          transition-all
        "
      >
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "products" && <Products />}
        {activePage === "orders" && <Orders />}
        {activePage === "customers" && <Customers />}
      </main>
    </div>
  );
}
