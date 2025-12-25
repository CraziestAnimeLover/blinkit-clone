import { useEffect, useState } from "react";
import axios from "axios";

export default function RecommendedProducts() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProducts(res.data.products))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-3 rounded shadow">
            <img src={p.image} alt={p.name} className="w-full h-32 object-cover"/>
            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
