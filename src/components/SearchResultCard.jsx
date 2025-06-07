import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const getRatingColor = (rating) => {
  if (rating >= 7.5) return 'bg-green-500';
  if (rating >= 6) return 'bg-yellow-400';
  return 'bg-red-500';
};

const SearchResultCard = ({ item }) => {
  const navigate = useNavigate();
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const imagePath = item.poster_path || item.profile_path||item.poster;

  const handleClick = () => {
    if (item.type === 'cast') navigate(`/person/${item.id}`);
    else if (item.type === 'series') navigate(`/series/${item.id}`);
    else navigate(`/movie/${item.id}`);
  };
  if (item.adult === true) return null;

  return (
    <div
      className="relative w-36 h-[320px] rounded overflow-hidden shadow-lg grow-0 shrink-0 basis-auto hover:scale-105 transition duration-300 cursor-pointer bg-white dark:bg-[#1e1e1e] p-1"
      onClick={handleClick}
    >
      {imagePath ? (
          <div className='w-full'>
          <LazyLoadImage
          src={`${imageBaseUrl}${imagePath}`}
          alt={item.title || item.name}
          effect="blur"
          className="w-full h-full object-cover"
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
      </div>
    </div>
  );
};

export default SearchResultCard;
