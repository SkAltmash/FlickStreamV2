import React from 'react';

const MovieCardSkeleton = () => {
  return (
    <div className="w-40 sm:w-48 h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse">
      <div className="h-56 bg-gray-300 dark:bg-gray-700 rounded-t-lg" />
      <div className="p-2 space-y-2">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
