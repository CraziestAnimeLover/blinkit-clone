import { useState } from "react";
import Sidebar from "../components/Sidebar";

import StatsCards from "../sections/StatsCards";
import RecentOrders from "../sections/RecentOrders";
import TrendingMenu from "../sections/TrendingMenu";

import Analytics from "./Analytics";
import AdminProducts from "./AdminProducts";

export default function Dashboard() {
  const [page, setPage] = useState("dashboard");
  
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <RecentOrders />
              </div>
              <TrendingMenu />
            </div>
          </>
        );

      case "analytics":
        return <Analytics/>
      case "products":
        return <AdminProducts/>

      case "orders":
        return <h1 className="text-2xl font-bold">Orders Section</h1>;

      case "customers":
        return <h1 className="text-2xl font-bold">Customers Section</h1>;

      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar onChangePage={setPage} />
      <main className="flex-1 p-8">
        {renderPage()}
      </main>
    </div>
  );
}
