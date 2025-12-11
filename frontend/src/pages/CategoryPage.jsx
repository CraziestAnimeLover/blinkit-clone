import { useParams, Link } from "react-router-dom";
import { allCategories } from "./AllCategoriesPage";

export default function CategoryPage() {
  const { categoryTitle } = useParams();

  // Decode the URL parameter
  const category = allCategories.find(
    (cat) => cat.title === decodeURIComponent(categoryTitle)
  );

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-red-500">Category not found</h2>
        <Link to="/" className="text-green-600 hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-600">{category.title}</h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {category.items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <p className="text-gray-700 text-sm">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
