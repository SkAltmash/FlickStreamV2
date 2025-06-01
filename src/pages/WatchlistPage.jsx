import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import SearchResultCard from '../components/SearchResultCard';

const WatchlistPage = () => {
  const [user] = useAuthState(auth);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (!user) return;

    const watchlistRef = collection(db, 'users', user.uid, 'watchlist');
    const q = query(watchlistRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          ...doc.data(),
          type: doc.data().media_type === 'tv' ? 'series' : doc.data().media_type,
        });
      });
      setWatchlist(items);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <p className="text-center mt-10">Please log in to see your watchlist.</p>;
  if (watchlist.length === 0) return <p className="text-center mt-10">Your watchlist is empty.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Watchlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {watchlist.map((item) => (
          <SearchResultCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;
