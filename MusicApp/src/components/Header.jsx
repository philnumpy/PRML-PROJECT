// components/Header.jsx
import React from "react";

const Header = () => {
    return (
      <div className="mt-[60px] w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md p-6 rounded-2xl">
        <h1 className="text-4xl font-bold tracking-wide text-center">
          🎵 Music Recommender System
        </h1>
        <p className="text-center text-lg mt-2 font-light">
          Get your recommendations by searching a song
        </p>
      </div>
    );
  };

export default Header;
