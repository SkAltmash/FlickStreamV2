import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="mb-4 text-lg leading-relaxed">
        Welcome to our website! This project is built using React and TMDB API to provide movie and TV show details.
      </p>
      <p className="mb-4 text-lg leading-relaxed">
        Our goal is to create a rich and easy-to-use experience for movie lovers where you can explore actors, series, and much more.
      </p>
      <p className="mb-4 text-lg leading-relaxed">
        If you want to know more, feel free to contact us anytime.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Info</h2>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>Email: skaltmash3@gmail.com</li>
        <li>Location: Wardha, India</li>
      </ul>
    </div>
  );
};

export default About;
