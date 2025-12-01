export default function RecentOrders() {
  const orders = [
    {
      img: "/pizza.png",
      name: "Cheese Margherita Pizza",
      customer: "Jimmy Kuai",
      price: "$7.2",
      status: "PENDING",
    },
    {
      img: "/vegnoodles.png",
      name: "Veg Hakka Noodles",
      customer: "Rick Wright",
      price: "$6.2",
      status: "DELIVERED",
    },
    {
      img: "/vegpizza.png",
      name: "Veggie Paradise Pizza",
      customer: "Murdock",
      price: "$3.5",
      status: "CANCELLED",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Order Request</h2>

      <table className="w-full">
        <tbody>
          {orders.map((o, i) => (
            <tr key={i} className="border-b">
              <td className="py-4 flex items-center space-x-4">
                <img src={o.img} className="w-12 rounded-xl" />
                <span className="font-medium">{o.name}</span>
              </td>
              <td className="text-gray-500">{o.customer}</td>
              <td>{o.price}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-xl text-sm font-semibold
                    ${o.status === "DELIVERED" && "bg-green-200 text-green-700"}
                    ${o.status === "PENDING" && "bg-yellow-200 text-yellow-700"}
                    ${o.status === "CANCELLED" && "bg-red-200 text-red-700"}
                  `}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
