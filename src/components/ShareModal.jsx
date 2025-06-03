import React from 'react';
import {  toast } from 'react-toastify';

const ShareModal = ({ isOpen, onClose, movie }) => {
  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
   toast.success(`Copy to Clipboard`);
    
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-white">Share {movie.title || movie.name}</h2>

        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded text-center"
          >
            WhatsApp
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(movie.title || movie.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded text-center "
          >
            Telegram
          </a>
           <a href="/chat"
           target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-950  px-4 py-2 rounded text-center font-bold text-blue-600 dark:text-blue-400"
           >
            Flick<spam className="text-red-600">C</spam>hat
           </a>
          <button
            onClick={handleCopy}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Copy Link
          </button>
        </div>

        <button onClick={onClose} className="mt-4 text-sm text-gray-400 hover:text-gray-200">Close</button>
      </div>
    </div>
  );
};

export default ShareModal;
