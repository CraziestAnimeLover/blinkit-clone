import { useState } from "react";
import allCategories from "../../api/categories.js";

export default function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openCategory = (title) => {
    const cat = allCategories.find((c) => c.title === title);
    setSelectedCategory(cat);
  };

  const closeModal = () => setSelectedCategory(null);

  return (
    <div className="px-6 py-8 bg-white rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Categories</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allCategories.slice(0, 8).map((cat, index) => (
          <div
            key={index}
            onClick={() => openCategory(cat.title)}
            className="p-3 border rounded-lg text-center text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition"
          >
            {cat.title}
          </div>
        ))}
      </div>

      {/* See All button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => openCategory("All Categories")}
          className="text-green-600 font-medium hover:underline"
        >
          See All →
        </button>
      </div>

      {/* Popup Modal */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-6 w-11/12 max-w-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing on content click
          >
            <h3 className="text-lg font-semibold mb-4">{selectedCategory.title}</h3>
            <ul className="list-disc list-inside space-y-1 max-h-96 overflow-y-auto">
              {selectedCategory.items.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
