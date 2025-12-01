import StatsCards from "../sections/StatsCards";
import RecentOrders from "../sections/RecentOrders";
import TrendingMenu from "../sections/TrendingMenu";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <StatsCards />

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="col-span-2">
          <RecentOrders />
        </div>

        <TrendingMenu />
      </div>
    </>
  );
}
