export default function CategoryCard({ category, onClick }) {
  return (
    <div
      onClick={() => onClick(category)}
      className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-lg cursor-pointer flex-shrink-0 transition flex flex-col items-center"
    >
      {/* <img
        src={category.image}
        alt={category.title}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
      /> */}
      <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center">
        {category.title}
      </h2>
    </div>
  );
}
