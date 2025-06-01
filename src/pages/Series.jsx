import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

const Series = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const API_KEY = 'd1becbefc947f6d6af137051548adf7f';

  const fetchMovies = async (pageNum) => {
    setLoading(true);
    const res = await fetch(
          `https://api.themoviedb.org/3/tv/on_the_air?api_key=d1becbefc947f6d6af137051548adf7f&language=en-US&page=${pageNum}`
    );
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Now Playing Movies</h1>
      <div className="flex flex-wrap gap-4 justify-center">
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
