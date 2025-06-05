import React from 'react';

const PersonDetailsSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-black transition-colors duration-300 min-h-screen animate-pulse">
      {/* Profile Info */}
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Profile Image */}
        <div className="w-36 h-52 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg" />

        {/* Name + Meta */}
        <div className="space-y-2 w-full max-w-md">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mx-auto" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto" />
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-11/12" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-10/12" />
          </div>
        </div>
      </div>

      {/* Known For */}
      <div className="mt-10">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mx-auto mb-6" />
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="w-40 sm:w-48 rounded-lg overflow-hidden shadow bg-gray-200 dark:bg-gray-800"
            >
              <div className="w-full h-56 bg-gray-300 dark:bg-gray-700 shimmer" />
              <div className="p-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4 shimmer" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 shimmer" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <div className="h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default PersonDetailsSkeleton;
