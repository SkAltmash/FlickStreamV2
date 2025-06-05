import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const API_KEY = 'd1becbefc947f6d6af137051548adf7f';

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    async function fetchPerson() {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}`)
        ]);
        const personData = await res1.json();
        const creditsData = await res2.json();
        setPerson(personData);
        setCredits(creditsData.cast || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch person details', err);
        setLoading(false);
      }
    }
    fetchPerson();
  }, [id]);

  if (loading) return <Loader />;
  if (!person) return <div className="text-center mt-10 text-gray-800 dark:text-gray-200">Cast member not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-black transition-colors duration-300 min-h-screen">
      <div className="flex flex-col items-center gap-6 text-center">
        <img
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
              : 'https://via.placeholder.com/150x220?text=No+Image'
          }
          alt={person.name}
          className="w-36 h-auto rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{person.name}</h1>
          {person.birthday && <p className="text-sm text-gray-600 dark:text-gray-400">🎂 {person.birthday}</p>}
          {person.place_of_birth && <p className="text-sm text-gray-600 dark:text-gray-400">📍 {person.place_of_birth}</p>}

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {(person.biography?.length > 300 && !showFullBio)
              ? person.biography.slice(0, 300) + '...'
              : person.biography || 'No biography available.'}
          </p>

          {person.biography?.length > 300 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-blue-600 dark:text-blue-400 mt-2 text-sm hover:underline"
            >
              {showFullBio ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>

      {/* Known For Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">Known For</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {credits
            .filter((c) => c.poster_path)
            .sort((a, b) => new Date(b.release_date || b.first_air_date || '1900') - new Date(a.release_date || a.first_air_date || '1900'))
            .slice(0, showAll ? credits.length : 12)
            .map((c) => (
              <MovieCard key={c.id} movie={c} />
            ))}
        </div>

        {credits.filter((c) => c.poster_path).length > 12 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetail;
