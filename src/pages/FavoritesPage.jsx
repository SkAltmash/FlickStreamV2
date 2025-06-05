import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import SearchResultCard from '../components/SearchResultCard';
const FavoritesPage = () => {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const favRef = collection(db, 'users', user.uid, 'favorites');
    const q = query(favRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const favs = [];
      querySnapshot.forEach((doc) => {
        favs.push({
          ...doc.data(),
          type: doc.data().media_type === 'tv' ? 'series' : doc.data().media_type,
        });
      });
      setFavorites(favs);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <p className="text-center mt-10">Please log in to see your favorites.</p>;
  if (favorites.length === 0) return <p className="text-center mt-10">You have no favorites yet.</p>;
  return (
    <div className="max-w-6xl mx-auto p-4 dark:bg-black dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Favorites</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map((item) => (
        <SearchResultCard key={`${item.type}-${item.id}`} item={item} />
 ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
