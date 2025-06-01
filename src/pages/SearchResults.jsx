import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchResultCard from '../components/SearchResultCard';
const API_KEY = 'd1becbefc947f6d6af137051548adf7f';
import Loader from '../components/Loader';
function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract query and filter from URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const filter = queryParams.get('filter') || 'all';

  useEffect(() => {
    if (!query) return;

    async function fetchResults() {
      try {
        setLoading(true);
        const encodedTerm = encodeURIComponent(query);
        let results = [];

        if (filter === 'all' || filter === 'movie') {
          const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodedTerm}`);
          const data = await res.json();
          results.push(...data.results.map(item => ({ ...item, type: 'movie' })));
        }

        if (filter === 'all' || filter === 'series') {
          const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodedTerm}`);
          const data = await res.json();
          results.push(...data.results.map(item => ({ ...item, type: 'series' })));
        }

        if (filter === 'all' || filter === 'cast') {
          const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodedTerm}`);
          const data = await res.json();
          results.push(...data.results.map(item => ({ ...item, type: 'cast' })));
        }

        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        setResults(results);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, filter]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>
      {loading ? (
        <Loader />
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
      <div className="flex flex-wrap gap-4 justify-center sm:gap-2">
          {results.map(item => (
            <SearchResultCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
