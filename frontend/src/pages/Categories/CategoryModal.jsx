export function CategoryModal({ category, onClose }) {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white bg-opacity-95 rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">{category.title}</h2>
        <ul className="space-y-2">
          {category.items.map((item, index) => (
            <li
              key={index}
              className="p-2 border rounded hover:bg-green-50 cursor-pointer transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
