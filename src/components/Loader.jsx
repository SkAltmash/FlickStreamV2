import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen dark:bg-black">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
        <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-blue-300 border-t-transparent animate-spin animation-delay-200"></div>
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full border-4 border-blue-200 border-t-transparent animate-spin animation-delay-400"></div>
      </div>
      <style>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Loader;
