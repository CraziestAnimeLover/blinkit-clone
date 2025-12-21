import { Link } from "react-router-dom";

const SearchDropdown = ({ results, onClose }) => {
  if (!results.length) {
    return (
      <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md p-4 text-sm text-gray-500 z-50">
        No results found
      </div>
    );
  }

  return (
    <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      {results.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/100?text=No+Image";
              }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/100?text=No+Image"
              alt="No Image"
              className="w-10 h-10 object-contain"
            />
          )}

          <div>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">{item.type}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchDropdown;
