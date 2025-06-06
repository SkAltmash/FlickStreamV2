import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

const Series = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (pageNum) => {
    setLoading(true);
  const res = await fetch(`/.netlify/functions/tmdb-proxy?endpoint=tv/on_the_air&page=${pageNum}`);

    const data = await res.json();
    setMovies((prev) => [...prev, ...data.results]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]); // ✅ runs on first load & whenever page changes

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1); // ✅ safe increment
  };

  return (
    <div className="p-6 bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Now Playing Series</h1>
      <div className="flex flex-wrap gap-2 justify-center sm:gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  );
};

export default Series;
