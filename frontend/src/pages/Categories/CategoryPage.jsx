import { Link } from "react-router-dom";
import allCategories from "../../api/categories.js"; // recommended fix


export default function CategoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        All Categories
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {allCategories.map((cat, index) => (
          <Link
            key={index}
            to={`/category/${encodeURIComponent(cat.title)}`}
            className="bg-white border rounded-xl p-4 hover:shadow-md transition"
          >
            {/* Category Title */}
            <h2 className="font-semibold text-gray-900 mb-3 text-sm">
              {cat.title}
            </h2>

            {/* Subcategories */}
            <ul className="space-y-1 text-sm text-gray-600">
              {cat.items.slice(0, 6).map((item, i) => (
                <li key={i} className="hover:text-green-600">
                  {item}
                </li>
              ))}

              {cat.items.length > 6 && (
                <li className="text-green-600 font-medium">
                  + {cat.items.length - 6} more
                </li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}