import React, { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const FavoriteButton = ({ movie }) => {
  const [user] = useAuthState(auth);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (user && movie?.id) {
      const favRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString());
      getDoc(favRef).then((docSnap) => {
        if (docSnap.exists()) setIsFav(true);
      });
    }
  }, [user, movie]);

  const toggleFavorite = async () => {
    if (!user) return;

    const favRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString());

    if (isFav) {
      await deleteDoc(favRef);
      setIsFav(false);
    } else {
      await setDoc(favRef, {
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
        media_type: movie.media_type || 'movie',
        timestamp: new Date(),
      });
      setIsFav(true);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      className="text-red-600 hover:scale-110 transition text-xl md:text-2xl"
      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
    >
      {isFav ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default FavoriteButton;
