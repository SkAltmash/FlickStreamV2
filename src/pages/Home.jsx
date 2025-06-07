import React from 'react';
import MediaSection from '../components/MediaSection';
import HeroSection from '../components/HeroSection';
const Home = () => {
  return (
    <>
      <HeroSection />
    <MediaSection
  title="Now Playing Movies"
  fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=movie/now_playing&page=1"
/>
<MediaSection
  title="Popular Web Shows"
  fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=tv/popular&page=1"
/>
<MediaSection
  title="Top Rated Movies"
  fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=movie/top_rated&page=1"
/>
<MediaSection
  title="Currently Airing Shows"
  fetchUrl="/.netlify/functions/tmdb-proxy?endpoint=tv/on_the_air&page=1"
/>
    </>
  );
};

export default Home;
