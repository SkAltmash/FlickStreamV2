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
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const filter = queryParams.get('filter') || 'all';
  const genre = queryParams.get('genre');
  const type = queryParams.get('type') || 'multi';

  // Reset state when query changes
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [location.search]);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query && !genre) return;

      if (page === 1) setLoading(true);
      else setLoadMoreLoading(true);

      try {
        let newResults = [];
        let url = '';

        const fetchAndPush = async (endpoint, typeTag) => {
          const res = await fetch(endpoint);
          const data = await res.json();
          newResults.push(...data.results.map((r) => ({ ...r, type: typeTag })));
          if (data.total_pages) {
            setHasMore(page < data.total_pages);
          }
        };

        if (query) {
          const encoded = encodeURIComponent(query);

          if (filter === 'all' || filter === 'movie') {
            await fetchAndPush(
              `/.netlify/functions/tmdb-proxy?endpoint=search/movie&query=${encoded}&page=${page}`,
              'movie'
            );
          }

          if (filter === 'all' || filter === 'series') {
            await fetchAndPush(
              `/.netlify/functions/tmdb-proxy?endpoint=search/tv&query=${encoded}&page=${page}`,
              'series'
            );
          }

          if (filter === 'all' || filter === 'cast') {
            await fetchAndPush(
              `/.netlify/functions/tmdb-proxy?endpoint=search/person&query=${encoded}&page=${page}`,
              'cast'
            );
          }
        } else if (genre) {
          await fetchAndPush(
            `/.netlify/functions/tmdb-proxy?endpoint=discover/${type}&with_genres=${genre}&page=${page}`,
            type === 'tv' ? 'series' : 'movie'
          );
          const res = await fetch(url);
          const data = await res.json();
          newResults.push(
            ...data.results.map((item) => ({
              ...item,
              type: type === 'tv' ? 'series' : 'movie',
            }))
          );
        }

        setResults((prev) => [...prev, ...newResults]);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
      } finally {
        setLoading(false);
        setLoadMoreLoading(false);
      }
    };

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

      {/* Initial loading skeletons */}
      {results.length === 0 && loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      )}

      {/* No results message */}
      {results.length === 0 && !loading && <p>No results found.</p>}

      {/* Result cards */}
      <div className="flex flex-wrap justify-center gap-3">
        {results.map((item, idx) => (
          <SearchResultCard key={`${item.id}-${idx}`} item={item} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && !loading && (
        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loadMoreLoading}
          >
            {loadMoreLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
