
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import 'react-lazy-load-image-component/src/effects/blur.css';
const UpcomingCard = ({ item }) => {
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
  return (
 <div
      className="relative w-36 h-[320px] rounded overflow-hidden shadow-lg grow-0 shrink-0 basis-auto hover:scale-105 transition duration-300 cursor-pointer bg-white dark:bg-[#1e1e1e] p-1"
      onClick={handleClick}
    >      
    <img src={poster} alt={item.title || item.name} className="w-full h-72 object-cover" />
      <div className="p-4">
        <h2 className="font-bold text-lg mb-1">
          {item.title || item.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          Release {timeUntilRelease}
        </p>
        <p className="text-sm text-gray-400">
          {releaseDate.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default UpcomingCard;
