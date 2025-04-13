import React, { useState, useRef, useContext, useEffect } from "react";
import { MdSkipPrevious, MdSkipNext, MdOutlinePause } from "react-icons/md";
import { datacontext } from "../context/UserContext";
import Card from "../components/Card";
import SongInput from "../components/SongInput";
import Header from "../components/Header";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { songsData } from "../songs"; // Import songsData from song.js

function Home() {
  return (
    <Provider store={store}> {/* ✅ Properly wrapping component */}
      <HomeContent />
    </Provider>
  );
}

function HomeContent() {
  const [showRecommendations, setShowRecommendations] = useState(false); // State to control when to show recommendations
  const inputSectionRef = useRef(null);
  const recommendationsSectionRef = useRef(null); // Ref for recommendations section

  const scrollToInput = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToRecommendations = () => {
    // Smooth scroll to the recommendations section
    recommendationsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let {
    audioRef,
    playingSong,
    playSong,
    pauseSong,
    nextSong,
    index,
    prevSong,
  } = useContext(datacontext);

  let [range, setRange] = useState(0);
  const progress = useRef(null);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      if (!audioRef.current || isSeeking) return;
      let duration = audioRef.current.duration || 0;
      let currentTime = audioRef.current.currentTime || 0;
      let progressPercentage = (currentTime / duration) * 100 || 0;
      setRange(progressPercentage);

      if (progress.current) {
        progress.current.style.width = `${progressPercentage}%`;
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, [isSeeking]);

  function handleRange(e) {
    let newRange = e.target.value;
    setRange(newRange);
    setIsSeeking(true);
    let duration = audioRef.current.duration;
    audioRef.current.currentTime = (newRange / 100) * duration;

    if (progress.current) {
      progress.current.style.width = `${newRange}%`;
    }
  }

  function handleSeekEnd() {
    setIsSeeking(false);
  }

  // Function to handle Submit button click and show recommendations
  const handleSubmit = () => {
    setShowRecommendations(true); // Show recommendations when submit is clicked
    scrollToRecommendations(); // Scroll to recommendations after showing them
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-gray-900 to-black text-white text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
          🎵 Music Recommender System
        </h1>
        <p className="text-lg md:text-2xl mt-4 font-light max-w-2xl text-gray-300">
          Get your recommendations by selecting a language and searching a song
        </p>
        <button
          onClick={scrollToInput}
          className="mt-12 px-10 py-6 text-white rounded-full font-bold text-2xl md:text-3xl bg-gradient-to-r from-[#6a3093] to-[#a044ff] hover:from-[#a044ff] hover:to-[#6a3093] shadow-2xl transition-all duration-500 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      <div
        ref={inputSectionRef}
        className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-gray-900 to-black text-white"
      >
        <SongInput />
        <button 
          onClick={handleSubmit} 
          className="mt-4 px-8 py-4 text-white rounded-full font-bold text-xl md:text-2xl bg-gradient-to-r from-[#6a3093] to-[#a044ff] hover:from-[#a044ff] hover:to-[#6a3093] shadow-2xl transition-all duration-500 transform hover:scale-105"
        >
          Show recommendations
        </button>
      </div>

      <div
        ref={recommendationsSectionRef}
        className="w-full h-full flex flex-col justify-start items-center py-4"
      >
{showRecommendations && (
  <>
    <h2 className="text-white text-3xl font-semibold mb-8 text-center">
      Following are your recommendations
    </h2>

    {/* Grid container: 4 columns, 2 rows max */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
      {songsData.slice(0, 8).map((song, i) => (
        <Card
          key={i}
          name={song.name}
          image={song.image}
          singer={song.singer}
          songIndex={i}
          trackUrl={song.trackUrl}
          similarity={song.similarity}
          className="w-[250px] h-[350px] overflow-hidden rounded-xl shadow-md"
        />
      ))}
    </div>
  </>
)}

      </div>
    </div>
  );
}

export default Home;
