// src/components/CategoriesSection.jsx
import { Link } from "react-router-dom";

const categories = [
  "Vegetables & Fruits",
  "Dairy & Breakfast",
  "Munchies",
  "Cold Drinks & Juices",
  "Instant & Frozen Food",
  "Tea, Coffee & Health Drinks",
  "Bakery & Biscuits",
  "Sweet Tooth",
  "Atta, Rice & Dal",
  "Dry Fruits, Masala & Oil",
  "Sauces & Spreads",
  "Chicken, Meat & Fish",
];

export default function CategoriesSection() {
  return (
    <div className="px-6 py-8 bg-white rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.slice(0, 8).map((item, index) => (
          <div
            key={index}
            className="p-3 border rounded-lg text-center text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to="/all-categories"
          className="text-green-600 font-medium hover:underline"
        >
          See All →
        </Link>
      </div>
    </div>
  );
}
