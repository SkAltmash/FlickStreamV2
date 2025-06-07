import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const getRatingColor = (rating) => {
  if (rating >= 7.5) return 'bg-green-500';
  if (rating >= 6) return 'bg-yellow-400';
  return 'bg-red-500';
};

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const imagePath = movie.poster_path || movie.backdrop_path;

  const handleClick = () => {
    if (movie.first_air_date == null) navigate(`/movie/${movie.id}`);
    else navigate(`/series/${movie.id}`);
  };

  if (movie.adult === true) return null;

  return (
    <div
      className="relative w-38 h-[320px] md:w-46 rounded overflow-hidden shadow-lg grow-0 shrink-0 basis-auto hover:scale-105 transition duration-300 cursor-pointer bg-white dark:bg-[#1e1e1e] p-1">
      {imagePath ? (
        <LazyLoadImage
          src={`${imageBaseUrl}${imagePath}`}
          alt={movie.title || movie.name}
          effect="blur"
          className="w-full md:w-46 h-[250px] object-cover rounded"
          onClick={handleClick}
        />
      ) : (
        <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {movie.vote_average ? (
        <div className={`absolute top-1 right-1 text-xs font-bold px-2 py-1 rounded ${getRatingColor(movie.vote_average)}`}>
          ★ {movie.vote_average.toFixed(1)}
        </div>
      ) : null}

      <div className="absolute bottom-3 w-full bg-white dark:bg-[#1e1e1e] bg-opacity-90 text-black text-sm font-semibold text-center py-1">
        <p className="truncate dark:text-white">{movie.title || movie.name}</p>
      </div>
    </div>
  );
};

export default MovieCard;
