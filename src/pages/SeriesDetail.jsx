import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SeasonWithEpisodes from '../components/SeasonWithEpisodes';
import DetailsLoader from '../components/DetailsLoader';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import WatchlistButton from '../components/WatchlistButton';
import CommentSection from '../components/CommentSection';
import ShareModal from '../components/ShareModal';
import { FaShare } from 'react-icons/fa';
import { db } from '../firebase';



const SeriesDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
  `/.netlify/functions/tmdb-proxy?endpoint=tv/${id}&append_to_response=videos,credits,similar`
);
        const data = await res.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (loading) return <DetailsLoader />
  if (!movie) return <div className="text-center mt-10">Movie not found.</div>;

  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
   window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
   <div className="bg-white text-black min-h-screen py-6 flex flex-col items-center mt-4 dark:bg-black dark:text-white">
        {/* Video or Backdrop with Effect */}
      <div className="relative w-full max-w-[600px] aspect-video rounded-md overflow-hidden shadow-md mb-8">
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50 pointer-events-none" />
    {trailer ? (
      <iframe
        src={`https://www.youtube.com/embed/${trailer.key}`}
        title="Trailer"
        allowFullScreen
        className="w-full h-full border-0"
        frameBorder="0"
      />
    ) : movie.backdrop_path ? (
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt="Backdrop"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gray-400 flex items-center justify-center text-gray-600 relative">
        No trailer or backdrop available
      </div>
    )}
  </div>
      {/* Movie Content */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
     
        

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{movie.name}</h1>
            <p className="text-black mb-1 dark:text-white">
            Total Seasons {movie.number_of_seasons} .
            Total Episodes {movie.number_of_episodes}</p>

            {/* Rating */}
            {movie.vote_average > 0 && (
              <>
              <p className="text-yellow-500 font-semibold mb-2">
                ★ {movie.vote_average.toFixed(1)} / 10
              </p>
              <div className='flex gap-5 w-full mb-2'>
                <WatchlistButton movie={movie} />
                <FavoriteButton movie={movie} />
                <button onClick={() => setShowShare(true)} className="flex items-center gap-2  text-black px-4 py-2 rounded hover:bg-gray-500 dark:text-gray-200">
                 <FaShare />
                 </button>

                </div>
              

              {/* Share Modal */}
             <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} movie={movie}/>
              </>
            )}

            {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres?.map((genre) => (
              <Link
                to={`/search?genre=${genre.id}&type=movie`} // or `tv` depending on the current media type
                key={genre.id}
              >
                <span className="cursor-pointer bg-gray-900 text-white px-2 py-1 text-xs rounded dark:bg-gray-200 dark:text-gray-950 hover:opacity-80 transition">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>

            {/* Overview */}
            <p className="text-gray-800 leading-relaxed dark:text-white">{movie.overview}</p>
          </div>
        </div>
      </div>
    {/* Cast Section */}
<div className=" px-4 py-6 w-screen">
  <h2 className="text-2xl font-semibold mb-4 px-4">Top Cast</h2>

  {/* Mobile: horizontal scroll | Desktop: grid */}
    <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-2">
   {movie.credits?.cast?.slice(0, 10).map((cast) => (
    <Link to={`/person/${cast.id}`} key={cast.id} className="min-w-[100px] md:min-w-0 flex-shrink-0 text-center">
    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-md mb-2 aspect-square">
      {cast.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
          alt={cast.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 dark:text-gray-200">
          No Image
        </div>
      )}
    </div>
    <p className="text-sm font-medium text-gray-800 truncate  dark:text-gray-200">{cast.name}</p>
    <p className="text-xs text-gray-500 truncate  dark:text-gray-50">{cast.character}</p>
  </Link>
))}

  </div>

</div>
 {/* TV show detail page */}
<div className="max-w-6xl mx-auto px-4 mt-10">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Seasons</h2>
  {movie.seasons?.map((season) => (
    <SeasonWithEpisodes key={season.id} season={season} tvId={movie.id} />
  ))}
</div>


</div>
<CommentSection mediaId={movie.id.toString()} />

{/* Similar Movies Section */}
<div className=" mx-auto mt-10 px-4">
  <h2 className="text-2xl font-semibold mb-4">Similar Movies</h2>
  {movie.similar?.results?.length > 0 ? (
    <div className="flex flex-wrap gap-4 justify-center">
      {movie.similar.results.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  ) : (
    <p className="text-gray-600">No similar movies found.</p>
  )}
</div>
</>

     
  );
};

export default SeriesDetail;
