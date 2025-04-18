import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import config from "../config"; 
console.log("🎤 SongInput component mounted");

const songOptions = {
  English: ["Shape of You", "Blinding Lights", "Someone Like You"],
  Hindi: ["Tum Hi Ho", "Kal Ho Naa Ho", "Kabira"],
  Tamil: ["Why This Kolaveri Di", "Vaathi Coming", "Rowdy Baby"],
  Korean: ["Butter", "Dynamite", "Kill This Love"],
  Others: ["Song A", "Song B", "Song C"],
};


const Input = () => {
  const [selectedLang, setSelectedLang] = useState(null);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [dropdownClicked, setDropdownClicked] = useState(false);

  const languages = Object.keys(songOptions);

  const toggleLang = (lang) => {
    setSearch("");
    setFocused(false);
    if (selectedLang === lang) {
      setSelectedLang(null);
    } else {
      setSelectedLang(lang);
    }
  };

  const handleDropdownClick = (song) => {
    setSearch(song);
    setFocused(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-black via-gray-900 to-blacktext-white overflow-hidden">
      <h2 className="text-white text-3xl font-semibold mb-6 tracking-wide drop-shadow-md">
        Choose Your Language
      </h2>

      {/* Language Buttons */}
      <div className="w-full max-w-4xl flex flex-wrap justify-center gap-4 bg-black/30 backdrop-blur-md px-8 py-6 rounded-2xl shadow-lg border border-white/20">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => toggleLang(lang)}
            className={`px-6 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 border ${
              selectedLang === lang
                ? "bg-white text-black shadow-inner"
                : "bg-black/40 text-white border-white/30 hover:bg-gradient-to-r hover:from-[#6a3093] hover:to-[#a044ff] hover:text-white"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Search Input with Dropdown */}
      <div className="relative flex items-center justify-center mt-8 w-full max-w-4xl z-10">
        {/* Search Icon */}
        <div className="z-10 relative p-3 rounded-lg bg-gradient-to-br from-[#6a3093] to-[#a044ff] shadow-xl text-white border-2 border-white/20">
          <FiSearch className="text-xl" />
        </div>

        {/* Expanding Input */}
        <div
          className={`relative transition-all duration-700 ease-in-out overflow-visible ${
            selectedLang ? "w-[80%] opacity-100 ml-4" : "w-0 opacity-0"
          }`}
        >
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() =>
                setTimeout(() => {
                  if (!dropdownClicked) setFocused(false);
                }, 200)
              }
              placeholder={`Search in ${selectedLang || "..."}`}
              className="w-full pl-2 pr-4 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none placeholder:text-gray-300 text-base"
            />

            {/* Dropdown */}
            {focused && selectedLang && (
              <div
                className="absolute left-0 right-0 top-full mt-3 bg-black/40 backdrop-blur-md rounded-lg p-2 max-h-40 overflow-y-auto border border-white/20 animate-fade-in z-50"
                onMouseEnter={() => setDropdownClicked(true)}
                onMouseLeave={() => setDropdownClicked(false)}
              >
                {songOptions[selectedLang]
                  .filter((song) =>
                    song.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((song, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 text-white hover:bg-gradient-to-r hover:from-[#a044ff] hover:to-[#6a3093] rounded-md cursor-pointer transition-all"
                      onClick={() => handleDropdownClick(song)}
                    >
                      {song}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

   {/* Submit Button */}
   <button
onClick={() => {
  console.log("🔔 Submit button clicked");
  console.log("🌐 Language:", selectedLang);
  console.log("🎵 Song:", search);

  fetch("http://127.0.0.1:5000/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: selectedLang,
      song: search,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Server response:", data.message);
    })
    .catch((err) => console.error("❌ Fetch error:", err));
}}

  className="mt-8 px-6 py-3 bg-gradient-to-r from-[#6a3093] to-[#a044ff] text-white rounded-xl shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300"
>
  Submit
</button>

    </div>
  );
};

export default Input;
