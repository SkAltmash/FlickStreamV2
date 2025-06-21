import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton'; 

const series= () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (pageNum) => {
    setLoading(true); 
   const res = await fetch(  
  `/.netlify/functions/tmdb-proxy?endpoint=tv/airing_today&language=en-US&page=${pageNum}`
);
    const data = await res.json();
    setMovies((prev) => [...prev, ...data.results]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="p-6 bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Now Playing Series</h1>

      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {loading && page === 1 &&
          Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-5 py-2 bg-yellow-500 dark:bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 transition disabled:opacity-50"
        >
          {loading && page > 1 ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  );
};

export default series;
