import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';

const API_KEY = 'd1becbefc947f6d6af137051548adf7f'; // Or from env

const SCROLL_AMOUNT = 300;

const MediaSection = ({ title, fetchUrl }) => {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  // State to track if scroll is at start/end
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${fetchUrl}?api_key=${API_KEY}&language=en-US&page=1`);
      const data = await res.json();
      setItems(data.results);
    };
    fetchData();
  }, [fetchUrl]);

  // Update scroll buttons disabled state
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();

    // Add scroll listener to update on user scroll
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, [items]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <div className="mb-5 px-2 relative">
      <h2 className="text-xl font-bold mb-3 text-blue-600">{title}</h2>

      {/* Left button */}
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`absolute top-1/2 left-0 z-10 -translate-y-1/2 p-2 rounded-r-md
          transition-opacity duration-300
          ${canScrollLeft ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
        aria-label="Scroll left"
      >
        &#8249;
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll gap-4 scrollbar-hide scroll-smooth py-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item) => (
          <MovieCard key={item.id} movie={item} />
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`absolute top-1/2 right-0 z-10 -translate-y-1/2 p-2 rounded-l-md
          transition-opacity duration-300
          ${canScrollRight ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
        aria-label="Scroll right"
      >
        &#8250;
      </button>
    </div>
  );
};

export default MediaSection;
