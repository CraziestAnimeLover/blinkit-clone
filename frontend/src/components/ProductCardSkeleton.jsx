const ProductCardSkeleton = () => {
  return (
    <div className="p-4 border rounded-xl bg-white animate-pulse">
      <div className="h-40 sm:h-48 md:h-52 bg-gray-200 rounded-lg" />

      <div className="mt-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-10" />
          <div className="h-4 bg-gray-300 rounded w-14" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
