import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';

const SCROLL_AMOUNT = 300;

const MediaSection = ({ title, fetchUrl }) => {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fetchUrl);
        const data = await res.json();
        if (data.results) {
          setItems(data.results);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Failed to fetch media:', error);
        setItems([]);
      }
    };
    fetchData();
  }, [fetchUrl]);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();

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

      {/* Left scroll button */}
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`absolute top-1/2 left-0 z-10 -translate-y-1/2 p-2 rounded-r-md
          transition-opacity duration-300
          ${
            canScrollLeft
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
        aria-label="Scroll left"
      >
        &#8249;
      </button>

      {/* Media items container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll gap-4 scrollbar-hide scroll-smooth py-2 bg-white text-black dark:bg-black dark:text-white"
      >
        {items.map((item) => (
          <MovieCard key={item.id} movie={item} />
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`absolute top-1/2 right-0 z-10 -translate-y-1/2 p-2 rounded-l-md
          transition-opacity duration-300
          ${
            canScrollRight
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
        aria-label="Scroll right"
      >
        &#8250;
      </button>
    </div>
  );
};

export default MediaSection;
