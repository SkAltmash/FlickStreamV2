<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const getRatingColor = (rating) => {
  if (rating >= 7.5) return 'bg-green-500';
  if (rating >= 6) return 'bg-yellow-400';
  return 'bg-red-500';
};

const UpcomingCard = ({ item }) => {
  const navigate = useNavigate();
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const imagePath = item.poster_path || item.profile_path||item.poster;

  const handleClick = () => {
=======

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
>>>>>>> c2e7a04d8f3450f2040fb4134739cf4051b15795
    if (item.type === 'cast') navigate(`/person/${item.id}`);
    else if (item.type === 'series') navigate(`/series/${item.id}`);
    else navigate(`/movie/${item.id}`);
  };
<<<<<<< HEAD
  if (item.adult === true) return null;

  return (
    <div
      className="relative w-36 md:w-46 h-[320px] rounded overflow-hidden shadow-lg grow-0 shrink-0 basis-auto hover:scale-105 transition duration-300 cursor-pointer bg-white dark:bg-[#1e1e1e] p-1"
      onClick={handleClick}
    >
      {imagePath ? (
          <div className='w-full'>
          <LazyLoadImage
          src={`${imageBaseUrl}${imagePath}`}
          alt={item.title || item.name}
          effect="blur"
          className="w-full h-60 object-cover"
        />
           </div>
      ) : (
        <div className="w-full h-65 bg-gray-300 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {item.type !== 'cast' && item.vote_average > 0 && (
        <div
          className={`absolute top-1 right-1 text-xs font-bold px-2 py-1 rounded ${getRatingColor(
            item.vote_average
          )}`}
        >
          ★ {item.vote_average.toFixed(1)}
        </div>
      )}

      <div className="absolute bottom-3 w-full bg-white dark:bg-[#1e1e1e] bg-opacity-90 text-black text-sm font-semibold text-center py-1">
        <p className="truncate dark:text-white">{item.title || item.name}</p>
        <p className="text-xs text-black capitalize dark:text-white">{item.type}</p>
=======
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
>>>>>>> c2e7a04d8f3450f2040fb4134739cf4051b15795
      </div>
    </div>
  );
};

export default UpcomingCard;
