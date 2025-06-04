import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaRegCopy,
  FaTimes,
} from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, movie }) => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const currentUrl = window.location.href;

  const type = movie.first_air_date == null ? 'movie' : 'series';

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const userList = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();

    const user = auth.currentUser;
    if (user) setCurrentUserId(user.uid);
  }, []);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleFlickChatShare = async (user) => {
    if (!currentUserId || !user?.uid) return;

    const shareUrl = `${window.location.origin}/details/${type}/${movie.id}`;
    const text = ` Check this ${type === 'movie' ? 'movie' : 'series'}:  ${movie.name||movie.title}`;
    const chatId = [currentUserId, user.uid].sort().join('_');
    const messageRef = collection(db, 'chats', chatId, 'messages');
    
    await setDoc(
      doc(db, 'chats', chatId),
      {
        users: [currentUserId, user.uid],
      },
      { merge: true }
    );

    await addDoc(messageRef, {
      sender: currentUserId,
      avatar: user.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y',
      text,
      timestamp: serverTimestamp(),
      shared: {
        shareId: movie.id,
        type,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      },
    });

    toast.success(`Shared with ${user.username || user.displayName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-[95%] max-w-lg shadow-lg max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white text-center">
          Share <span className="text-pink-600">{movie.title || movie.name}</span>
        </h2>

        {/* Share via External */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-white">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 flex flex-col items-center justify-center py-3 rounded-xl hover:opacity-90"
          >
            <FaWhatsapp className="text-xl" />
            WhatsApp
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              currentUrl
            )}&text=${encodeURIComponent(movie.title || movie.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 flex flex-col items-center justify-center py-3 rounded-xl hover:opacity-90"
          >
            <FaTelegramPlane className="text-xl" />
            Telegram
          </a>

          <button
            onClick={handleCopy}
            className="bg-gray-700 flex flex-col items-center justify-center py-3 rounded-xl hover:opacity-90"
          >
            <FaRegCopy className="text-xl" />
            Copy Link
          </button>
        </div>

        {/* Share via FlickChat */}
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Share via <span className="text-pink-500">FlickChat</span>
        </h3>

        <div className="flex gap-4 overflow-x-auto pb-2">
  {users
    .filter((user) => user.uid !== currentUserId)
    .map((user) => (
      <button
        key={user.uid}
        onClick={() => handleFlickChatShare(user)}
        className="flex flex-col items-center text-xs text-center hover:opacity-90"
      >
        <img
          src={
            user.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y'
          }
          alt={user.username}
          className="w-14 h-14 rounded-full border-2 border-pink-500 object-cover"
        />
        <span className="mt-1 text-gray-800 dark:text-white truncate w-16">
          {user.username}
        </span>
      </button>
    ))}
</div>

      </div>
    </div>
  );
};

export default ShareModal;
