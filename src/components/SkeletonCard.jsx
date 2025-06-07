const SearchSkeleton = () => {
  const skeletonArray = new Array(10).fill(0);

  return (
    <div className="flex flex-wrap gap-5 justify-center animate-shimmer">
      {skeletonArray.map((_, i) => (
        <div
          key={i}
          className="w-38 sm:w-48 rounded-lg overflow-hidden shadow bg-white dark:bg-black animate-pulse"
        >
          {/* Poster */}
          <div className="w-full h-56 bg-gray-300 dark:bg-gray-700 shimmer" />
          
          {/* Title + Type */}
          <div className="p-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4 shimmer" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;
