import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = () => {
    if (user?.photoURL) return '';
    const name = user?.displayName || user?.email?.split('@')[0] || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-blue-500"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {getInitial()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-30">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/favorites"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            Favorites
          </Link>
          <Link
            to="/watchlist"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            Watchlist
          </Link>
          <Link
            to="/history"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            Watch History
          </Link>
          <Link
            to="/my-comments"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            My Comments
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
