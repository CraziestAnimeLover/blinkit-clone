// src/pages/Home.jsx
import React from "react";
import { useCart } from "../context/CartContext"; // ✅ import context
import Footer from "../components/Footer";

const categories = [
  { name: "Fruits", img: "https://source.unsplash.com/100x100/?fruits" },
  { name: "Vegetables", img: "https://source.unsplash.com/100x100/?vegetables" },
  { name: "Snacks", img: "https://source.unsplash.com/100x100/?snacks" },
  { name: "Dairy", img: "https://source.unsplash.com/100x100/?milk" },
  { name: "Bakery", img: "https://source.unsplash.com/100x100/?bread" },
];

const products = [
  { _id: 1, name: "Apple", price: 120, img: "https://source.unsplash.com/200x200/?apple" },
  { _id: 2, name: "Milk", price: 60, img: "https://source.unsplash.com/200x200/?milk" },
  { _id: 3, name: "Bread", price: 40, img: "https://source.unsplash.com/200x200/?bread" },
  { _id: 4, name: "Chips", price: 20, img: "https://source.unsplash.com/200x200/?chips" },
];

const Home = () => {
  const { addToCart } = useCart(); // ✅ get addToCart from context

  return (
    <div className="px-6 py-4">
      {/* Hero Section */}
      <div className="w-full h-48 bg-green-100 flex items-center justify-center text-3xl font-semibold text-green-700 rounded-md">
        Welcome to Blinkit Clone 🛒
      </div>

      {/* Categories */}
      <h2 className="text-xl font-bold mt-6 mb-3">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col items-center cursor-pointer">
            <img
              src={cat.img}
              alt={cat.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <span className="mt-2 text-sm">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Products */}
      <h2 className="text-xl font-bold mt-8 mb-3">Popular Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-3 flex flex-col items-center shadow hover:shadow-lg transition"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-32 h-32 object-cover rounded-md"
            />
            <h3 className="mt-2 font-medium">{item.name}</h3>
            <p className="text-gray-600">₹{item.price}</p>

            <button
              onClick={() => addToCart(item)} // ✅ now works
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div>
        <Footer/>
      </div>
    </div>

  );
};

export default Home;
