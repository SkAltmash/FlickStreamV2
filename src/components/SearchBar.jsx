import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'd1becbefc947f6d6af137051548adf7f';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchResults(searchTerm) {
    try {
      const encodedTerm = encodeURIComponent(searchTerm);
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
      setResults(results.slice(0, 10));
      setShowDropdown(true);
    } catch (error) {
      console.error('Search fetch error:', error);
      setResults([]);
      setShowDropdown(false);
    }
  }

  function handleSelect(item) {
    setQuery('');
    setShowDropdown(false);
    if (item.type === 'cast') navigate(`/person/${item.id}`);
    else if (item.type === 'movie') navigate(`/movie/${item.id}`);
    else navigate(`/series/${item.id}`);
  }

  function DisplaySearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}&filter=${filter}`);
    setShowDropdown(false);
  }

  return (
    <div className="relative flex justify-center " ref={dropdownRef}>
      <form
        className="flex justify-center align-middle mt-10 w-full"
        onSubmit={DisplaySearch}
      >
        <select
          value={filter}
          onChange={(e) => {
            const newFilter = e.target.value;
            setFilter(newFilter);
            if (query.trim()) {
              navigate(`/search?query=${encodeURIComponent(query)}&filter=${newFilter}`, { replace: true });
            }
          }}
          className="border border-gray-700 px-2 rounded-l-md h-10 outline-0"
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="series">TV Series</option>
          <option value="cast">Cast</option>
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, series, cast..."
          className="pl-2 pr-4 py-2 border border-gray-700 border-l-0 border-r-0 outline-0 w-7/12 h-10"
        />

        <div className="rounded-md rounded-l-none border border-gray-700 border-l-0 outline-0 flex justify-center pr-2">
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z"
              />
            </svg>
          </button>
        </div>
      </form>

      {showDropdown && results.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-md w-9/12 overflow-auto mt-30 h-80 z-50 shadow-lg">
          {results.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
            >
              {item.poster_path || item.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w45${item.poster_path || item.profile_path}`}
                  alt={item.name || item.title}
                  className="w-8 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-8 h-12 bg-gray-300 rounded" />
              )}
              <div>
                <p className="text-sm font-medium">{item.title || item.name}</p>
                <p className="text-xs text-gray-500 capitalize">{item.type}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
