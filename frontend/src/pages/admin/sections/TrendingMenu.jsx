export default function TrendingMenu() {
  const items = [
    { title: "Neapolitan Pizza", price: "$5.6", sales: 89 },
    { title: "Margherita Pizza", price: "$8.4", sales: 59 },
    { title: "Neapolitan Pizza", price: "$4.3", sales: 49 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Daily Trending Menus</h2>

      <div className="space-y-4">
        {items.map((i, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{i.title}</p>
              <p className="text-gray-500 text-sm">{i.sales} sales</p>
            </div>
            <p className="font-bold">{i.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
