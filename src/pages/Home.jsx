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
  fetchUrl="/.netlify/functions/tmdb?path=movie/now_playing"
/>

<MediaSection
  title="Popular Web Shows"
  fetchUrl="/.netlify/functions/tmdb?path=tv/popular"
/>

<MediaSection
  title="Top Rated Movies"
  fetchUrl="/.netlify/functions/tmdb?path=movie/top_rated"
/>

<MediaSection
  title="Currently Airing Shows"
  fetchUrl="/.netlify/functions/tmdb?path=tv/on_the_air"
/>

<MediaSection
  title="Trending Movies"
  fetchUrl="/.netlify/functions/tmdb?path=discover/movie&query=sort_by=popularity.desc"
/>
      </div>
    </>
  );
};

export default Home;
