export default function StatsCards() {
  const stats = [
    { title: "Menus", value: 44 },
    { title: "Orders", value: 244 },
    { title: "Customers", value: 56 },
    { title: "Income", value: "₹9244" },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <h2 className="text-gray-500">{s.title}</h2>
          <p className="text-3xl font-bold mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
