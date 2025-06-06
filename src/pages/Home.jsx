import React from 'react';
import MediaSection from '../components/MediaSection';
import HeroSection from '../components/HeroSection';
const Home = () => {
  return (
    <>
      <HeroSection />
      <div className="p-4 bg-gray-50 dark:bg-black transition-colors duration-300">
        <MediaSection
          title="Now Playing Movies"
       fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=tv/on_the_air"
        />
        <MediaSection
          title="Popular Web Shows"
          fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=tv/popular"
        />
        <MediaSection
          title="Top Rated Movies"
          fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=movie/top_rated"
        />
        <MediaSection
          title="Currently Airing Shows"
      fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=tv/on_the_air"
        />
      </div>
    </>
  );
};

export default Home;
