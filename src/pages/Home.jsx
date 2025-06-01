import React from 'react';
import MediaSection from '../components/MediaSection';
import SearchBar from '../components/SearchBar';
const Home = () => {
  return (
  <>
    
    <div className="p-4">
      <MediaSection
        title="Now Playing Movies"
        fetchUrl="https://api.themoviedb.org/3/movie/now_playing"
      />
      <MediaSection
        title="Popular Web Shows"
        fetchUrl="https://api.themoviedb.org/3/tv/popular"
      />
      <MediaSection
        title="Top Rated Movies"
        fetchUrl="https://api.themoviedb.org/3/movie/top_rated"
      />
      <MediaSection
        title="Currently Airing Shows"
        fetchUrl="https://api.themoviedb.org/3/tv/on_the_air"
      />
    </div>
    </>
  );
};

export default Home;
