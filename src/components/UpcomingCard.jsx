import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { formatDistanceToNow } from 'date-fns';
import 'react-lazy-load-image-component/src/effects/blur.css';

const getRatingColor = (rating) => {
  if (rating >= 7.5) return 'bg-green-500';
  if (rating >= 6) return 'bg-yellow-400';
  return 'bg-red-500';
};

const UpcomingCard = ({ item }) => {
  const navigate = useNavigate();
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const releaseDate = new Date(item.release_date || item.first_air_date);
  const timeUntilRelease = formatDistanceToNow(releaseDate, { addSuffix: true });

  const handleClick = () => {
    if (item.type === 'cast') navigate(`/person/${item.id}`);
    else if (item.type === 'series') navigate(`/series/${item.id}`);
    else navigate(`/movie/${item.id}`);
  };

  if (item.adult) return null;

  return (
    <div
      className="relative w-36 md:w-46 h-[340px] rounded overflow-hidden shadow-lg grow-0 shrink-0 basis-auto hover:scale-105 transition duration-300 cursor-pointer bg-white dark:bg-[#1e1e1e] p-1"
      onClick={handleClick}
    >
      <LazyLoadImage
        src={poster}
        alt={item.title || item.name}
        effect="blur"
        className="w-full md:w-46 h-60 object-cover rounded"
      />

      {item.vote_average > 0 && (
        <div
          className={`absolute top-1 right-1 text-xs font-bold px-2 py-1 rounded ${getRatingColor(
            item.vote_average
          )}`}
        >
          ★ {item.vote_average.toFixed(1)}
        </div>
      )}

      <div className="absolute bottom-0 w-full bg-white dark:bg-[#1e1e1e] bg-opacity-90 text-center p-2">
        <h2 className="text-sm font-semibold truncate dark:text-white">
          {item.title || item.name}
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">{releaseDate.toDateString()}</p>
        <p className="text-xs text-blue-600 dark:text-blue-400">Releasing {timeUntilRelease}</p>
      </div>
    </div>
  );
};

export default UpcomingCard;
