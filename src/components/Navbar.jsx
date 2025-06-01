import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import SearchBar from './SearchBar';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-30 top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            FlickStream<span className="text-red-600">V2</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/" className={getLinkClass}>Home</NavLink>
            <NavLink to="/movies" className={getLinkClass}>Movies</NavLink>
            <NavLink to="/series" className={getLinkClass}>Series</NavLink>
            <NavLink to="/about" className={getLinkClass}>About</NavLink>

            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300">
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed top-0 left-0 h-full w-full z-20 bg-transparent backdrop-blur transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-30 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between py-6 px-4">
          <div className="space-y-6">
            <NavLink to="/" className={mobileLinkClass} onClick={toggleMenu}>Home</NavLink>
            <NavLink to="/movies" className={mobileLinkClass} onClick={toggleMenu}>Movies</NavLink>
            <NavLink to="/series" className={mobileLinkClass} onClick={toggleMenu}>Series</NavLink>
            <NavLink to="/about" className={mobileLinkClass} onClick={toggleMenu}>About</NavLink>

            {user && (
              <div className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-4 space-y-3">
                <Link to="/profile" className={mobileLinkClass} onClick={toggleMenu}>Profile</Link>
                <Link to="/favorites" className={mobileLinkClass} onClick={toggleMenu}>Favorites</Link>
                <Link to="/watchlist" className={mobileLinkClass} onClick={toggleMenu}>Watchlist</Link>
                <Link to="/history" className={mobileLinkClass} onClick={toggleMenu}>History</Link>
                <Link to="/my-comments" className={mobileLinkClass} onClick={toggleMenu}>My Comments</Link>
              </div>
            )}

            {!user && (
              <div className="space-y-3 border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
                <Link to="/login" className={mobileLinkClass} onClick={toggleMenu}>Login</Link>
                <Link to="/signup" className={mobileLinkClass} onClick={toggleMenu}>Sign Up</Link>
              </div>
            )}
          </div>

          {user && (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="text-red-600 text-2xl hover:text-red-700 text-left"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Push content down from navbar */}
      <div className="h-16" />
      <SearchBar />
    </>
  );
};

// Styles for NavLink
const getLinkClass = ({ isActive }) =>
  `text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium ${
    isActive ? 'underline text-blue-600 dark:text-blue-400 font-bold' : ''
  }`;

// Style for mobile links
const mobileLinkClass = `block text-gray-700 dark:text-gray-300 text-base font-medium hover:text-blue-600 dark:hover:text-blue-400`;

export default Navbar;
