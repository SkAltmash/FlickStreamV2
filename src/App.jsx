import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";  // <-- import useLocation
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import SearchResults from './pages/SearchResults';
import MovieDetail from './pages/MovieDetail';
import SeriesDetail from './pages/SeriesDetail';
import PersonDetail from './pages/PersonDetail';
import About from './pages/About';
import Signup from './pages/Signup';
import Login from './pages/Login';
import FavoritesPage from './pages/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfileSetup from './pages/ProfileSetup';
import FlickChat from './pages/FlickChat';
import Profile from './pages/ Profile';
const App = () => {
  const [user, setUser] = useState(null);
  const isFirstRender = useRef(true);
  const location = useLocation();  // get current path

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isFirstRender.current) {
        if (currentUser && !user) {
          toast.success(`Welcome, ${currentUser.email}`);
        } else if (!currentUser && user) {
          toast.info('You have logged out.');
        }
      } else {
        isFirstRender.current = false;
      }

      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      {location.pathname !== '/chat' && <Navbar user={user} />}

      <ToastContainer position="top-center" autoClose={2000} />

      <Routes>
        <Route index element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<FlickChat />} />
      </Routes>

      {location.pathname !== '/chat' && <Footer user={user} />}
    </>
  );
};

export default App;
