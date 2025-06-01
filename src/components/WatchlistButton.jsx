import React, { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const WatchlistButton = ({ movie }) => {
  const [user] = useAuthState(auth);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (user && movie?.id) {
      const watchlistRef = doc(db, 'users', user.uid, 'watchlist', movie.id.toString());
      getDoc(watchlistRef).then((docSnap) => {
        if (docSnap.exists()) setIsInWatchlist(true);
      });
    }
  }, [user, movie]);

  const toggleWatchlist = async () => {
    if (!user) return;

    const watchlistRef = doc(db, 'users', user.uid, 'watchlist', movie.id.toString());

    if (isInWatchlist) {
      await deleteDoc(watchlistRef);
      setIsInWatchlist(false);
    } else {
      await setDoc(watchlistRef, {
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
        media_type: movie.media_type || 'movie',
        timestamp: new Date(),
      });
      setIsInWatchlist(true);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleWatchlist}
      className="text-blue-600 hover:scale-110 transition text-xl md:text-2xl"
      title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default WatchlistButton;
