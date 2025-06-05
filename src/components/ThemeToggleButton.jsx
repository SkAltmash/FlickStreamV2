import React, { useEffect, useState } from 'react';

// Import Font Awesome core
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import specific icons
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white flex items-center gap-2"
    >
      {theme === 'dark' ? (
        <>
          <FontAwesomeIcon icon={faSun} />
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faMoon} />
        </>
      )}
    </button>
  );
};

export default ThemeToggleButton;
