import React, { useEffect, useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';
const API_KEY = 'd1becbefc947f6d6af137051548adf7f';

const HeroSection = () => {
  const [trending, setTrending] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const autoSlideRef = useRef();

  useEffect(() => {
    async function fetchTrending() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
        );
        const data = await res.json();
        setTrending(data.results || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error('Failed to fetch trending:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  useEffect(() => {
    autoSlideRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoSlideRef.current();
    };
    const interval = setInterval(play, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? trending.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === trending.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!trending.length) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 text-white">
        No trending items found.
      </div>
    );
  }

  const item = trending[currentIndex];
  const title = item.title || item.name || 'Untitled';
  const overview = item.overview || 'No description available.';
  const backdrop = item.backdrop_path;
  const poster = item.poster_path;

  return (
    <section className="relative w-full h-[480px] md:h-[600px] select-none overflow-hidden mt-10">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Desktop backdrop */}
        <img
          src={`https://image.tmdb.org/t/p/original${backdrop}`}
          alt={title}
          className="hidden md:block w-full h-full object-cover brightness-75 transition-opacity duration-700"
          key={backdrop}
        />
        {/* Mobile poster */}
        <img
          src={`https://image.tmdb.org/t/p/original${poster}`}
          alt={title}
          className="block md:hidden w-full h-full object-cover brightness-75 transition-opacity duration-700"
          key={poster}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      {/* Left/Right Buttons always visible on all screen sizes */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 bg-black/40 hover:bg-black/70 text-white rounded-full shadow-lg transition p-2 md:p-3 z-20"
      >
        <FaChevronLeft size={18} className="md:text-xl" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 bg-black/40 hover:bg-black/70 text-white rounded-full shadow-lg transition p-2 md:p-3 z-20"
      >
        <FaChevronRight size={18} className="md:text-xl" />
      </button>

      {/* Content container */}
      <div
        className="
          relative z-10 max-w-5xl mx-auto px-6 select-text
          h-full
          flex flex-col justify-end md:justify-center
          pb-20 md:pb-12
          text-white
        "
      >
        {/* On desktop: content left aligned */}
        {/* On mobile: content at bottom center */}
        <div className="md:max-w-3xl md:text-left text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{title}</h1>
          <p className="hidden md:block max-w-3xl text-lg md:text-xl mb-6 line-clamp-3 drop-shadow-md">
            {overview}
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href={`/${item.media_type === 'tv' ? 'series' : 'movie'}/${item.id}`}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold shadow-lg transition"
            >
              Watch Now
            </a>
            
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {trending.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-red-600' : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
