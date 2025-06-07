import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchResultCard from '../components/SearchResultCard';
import SkeletonCard from '../components/SkeletonCard';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const filter = queryParams.get('filter') || 'all';
  const genre = queryParams.get('genre');
  const type = queryParams.get('type') || 'multi';

  // Reset when search params change
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [location.search]);

  // Load data
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let newResults = [];
        let url = '';

        if (query) {
          const encoded = encodeURIComponent(query);
          if (filter === 'all' || filter === 'movie') {
             url = `/.netlify/functions/tmdb-proxy?endpoint=search/movie&query=${encoded}&page=${page}`;
            const res = await fetch(url);
            const data = await res.json();
            newResults.push(...data.results.map((r) => ({ ...r, type: 'movie' })));
            setHasMore(data.page < data.total_pages);
          }

          if (filter === 'all' || filter === 'series') {
             url = `/.netlify/functions/tmdb-proxy?endpoint=search/tv&query=${encoded}&page=${page}`;
            const res = await fetch(url);
            const data = await res.json();
            newResults.push(...data.results.map((r) => ({ ...r, type: 'series' })));
            setHasMore(data.page < data.total_pages);
          }

          if (filter === 'all' || filter === 'cast') {
             url = `/.netlify/functions/tmdb-proxy?endpoint=search/person&query=${encoded}&page=${page}`;
            const res = await fetch(url);
            const data = await res.json();
            newResults.push(...data.results.map((r) => ({ ...r, type: 'cast' })));
            setHasMore(data.page < data.total_pages);
          }
        } else if (genre) {
          url = `/.netlify/functions/tmdb-proxy?endpoint=discover/${type}&with_genres=${genre}&page=${page}`;

          const res = await fetch(url);
          const data = await res.json();
          newResults.push(
            ...data.results.map((item) => ({
              ...item,
              type: type === 'tv' ? 'series' : 'movie',
            }))
          );
          setHasMore(data.page < data.total_pages);
        }

        setResults((prev) => [...prev, ...newResults]);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [page, query, filter, genre, type]);

  return (

    <div className="p-6 dark:bg-black dark:text-gray-200 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">
        {query
          ? `Search Results for "${query}"`
          : genre
          ? `Genre-Based Results (${genre})`
          : 'Search Results'}
      </h2>

      {results.length === 0 && loading && <SkeletonCard/> }
      {results.length === 0 && !loading && <p>No results found.</p>}

      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {results.map((item) => (
          <SearchResultCard key={`${item.type}-${item.id}-${item.name || item.title}`} item={item} />
        ))}
      </div>

      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}

      {loading && <SkeletonCard />}
    </div>
  );
}

export default SearchResults;
