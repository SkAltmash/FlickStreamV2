import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getUsernameFromEmail = (email) => {
    if (!email) return "User";
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-20 top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/home" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                FlickStream<span className="text-red-600">V2</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium ${
                    isActive ? 'text-blue-600 dark:text-blue-400 font-bold underline' : ''
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium ${
                    isActive ? 'text-blue-600 dark:text-blue-400 font-bold underline' : ''
                  }`
                }
              >
                Movies
              </NavLink>
              <NavLink
                to="/series"
                className={({ isActive }) =>
                  `text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium ${
                    isActive ? 'text-blue-600 dark:text-blue-400 font-bold underline' : ''
                  }`
                }
              >
                Series
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium ${
                    isActive ? 'text-blue-600 dark:text-blue-400 font-bold underline' : ''
                  }`
                }
              >
                About
              </NavLink>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    Welcome, {getUsernameFromEmail(user.email)}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-white dark:bg-gray-900 px-2 pt-2 pb-3 space-y-1 shadow-md"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 font-bold' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 font-bold' : ''
                }`
              }
            >
              Movies
            </NavLink>
            <NavLink
              to="/series"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 font-bold' : ''
                }`
              }
            >
              Series
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 font-bold' : ''
                }`
              }
            >
              About
            </NavLink>

            {user ? (
              <div className="px-3 py-2">
                <span className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
                  Welcome, {getUsernameFromEmail(user.email)}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link
                  to="/login"
                  className="block text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      <SearchBar />
    </>
  );
};

export default Navbar;
