import React, { useState, useEffect } from 'react';
import UpcomingCard from '../components/UpcomingCard';
import SkeletonCard from '../components/SkeletonCard';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const languageOptions = [ 
  { label: 'All', value: '' },
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Bengali', value: 'bn' },
];

const Upcoming = () => {
  const [activeTab, setActiveTab] = useState('movie');
  const [language, setLanguage] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const fetchData = async (append = false) => {
    const endpoint = activeTab === 'movie' ? 'discover/movie' : 'discover/tv';
    const currentPage = append ? page + 1 : 1;
    const today = new Date().toISOString().split('T')[0];

    try {
      if (append) setLoadMoreLoading(true);
      else setLoading(true);

      const res = await fetch(
        `/.netlify/functions/tmdb-proxy?endpoint=${endpoint}&page=${currentPage}&sort_by=primary_release_date.asc&primary_release_date.gte=${today}${
          language ? `&with_original_language=${language}` : ''
        }`
      );

      const data = await res.json();

      if (append) {
        setItems((prev) => [...prev, ...data.results]);
        setPage(currentPage);
      } else {
        setItems(data.results);
        setPage(1);
      }

      setHasMore(currentPage < data.total_pages);
    } catch (err) {
      console.error('Error fetching upcoming data:', err);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, [activeTab, language]);

  return (
    <div className="p-6 dark:bg-black dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Upcoming Releases</h1>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('movie')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTab === 'movie'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTab === 'tv'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'
            }`}
          >
            Series
          </button>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3">
            {items.map((item) => (
              <UpcomingCard key={item.id} item={item} mediaType={activeTab} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => fetchData(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold disabled:opacity-60"
                disabled={loadMoreLoading}
              >
                {loadMoreLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Upcoming;
