import React, { useState } from 'react';

const SeasonWithEpisodes = ({ tvId, season }) => {
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // show first 10 initially
  const [loading, setLoading] = useState(false);

  const toggleEpisodes = async () => {
    if (!showEpisodes && episodes.length === 0) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/season/${season.season_number}?api_key=d1becbefc947f6d6af137051548adf7f`
        );
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error('Failed to fetch episodes', err);
      } finally {
        setLoading(false);
      }
    }
    setShowEpisodes(!showEpisodes);
  };

  const loadMoreEpisodes = () => {
    setVisibleCount((prev) => prev + 5); // load next 10
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-6">
      <div className="flex gap-4 flex-col sm:flex-row">
        <img
          src={
            season.poster_path
              ? `https://image.tmdb.org/t/p/w200${season.poster_path}`
              : 'https://via.placeholder.com/100x150?text=No+Image'
          }
          alt={season.name}
          className="w-24 h-36 object-cover rounded-md mx-auto sm:mx-0"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{season.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">Air Date: {season.air_date}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Episodes: {season.episode_count}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{season.overview || 'No overview available'}</p>
          <button
            onClick={toggleEpisodes}
            className="mt-3 px-4 py-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded"
          >
            {showEpisodes ? 'Hide Episodes' : 'Show Episodes'}
          </button>
        </div>
      </div>

      {/* Episodes */}
      {showEpisodes && (
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading episodes...</p>
          ) : episodes.length > 0 ? (
            <>
              <ul className="space-y-6">
                {episodes.slice(0, visibleCount).map((ep) => (
                  <li key={ep.id} className="flex flex-col sm:flex-row gap-4 border-t pt-4">
                    <div className="w-full sm:w-80 h-50 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                      {ep.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                          alt={ep.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                          No Preview
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                        {ep.episode_number}. {ep.name}
                      </h4>
                      <p className="text-sm text-gray-500">Runtime: {ep.runtime || 'N/A'} min</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ep.overview || 'No description available.'}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Show more button */}
              {visibleCount < episodes.length && (
                <div className="mt-4 text-center">
                  <button
                    onClick={loadMoreEpisodes}
                    className="px-4 py-1 text-sm font-medium text-indigo-600 border border-indigo-500 rounded hover:bg-indigo-100 dark:hover:bg-gray-700"
                  >
                    Show More Episodes
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">No episodes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SeasonWithEpisodes;
