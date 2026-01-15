import { useState } from "react";
import  allCategories  from "../../api/categories.js";
import {CategoryModal} from "./CategoryModal.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";


export default function AllCategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="max-w-8xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-600 text-center sm:text-left">
        All Categories
      </h1>

      <CategoryCarousel
        categories={allCategories}
        chunkSize={10}
        onCategoryClick={setSelectedCategory}
      />

      <CategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      
    </div>
  );
}
