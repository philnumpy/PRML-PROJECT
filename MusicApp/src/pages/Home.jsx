import React, { useContext, useEffect, useState, useRef } from "react";
import { songsData } from "../songs";
import musicImg from "../assets/musicanim.webp";
import { MdSkipPrevious, MdSkipNext, MdOutlinePause } from "react-icons/md";
import { IoPlay } from "react-icons/io5";
import { datacontext } from "../context/UserContext";
import Card from "../components/Card";
import Input from "../components/input";
import Header from "../components/Header";
import { Provider } from "react-redux"; 
import { store } from "../redux/store";

function Home() {
  return (
    <Provider store={store}>  {/* ✅ Properly wrapping component */}
      <HomeContent />
    </Provider>
  );
}

function HomeContent() {
  const inputSectionRef = useRef(null);

  const scrollToInput = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
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
  <Input />
</div>

      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left side */}
        <div className="w-full md:w-[50%] flex justify-start items-center pt-[30px] md:pt-[90px] flex-col gap-5">
          <h1 className="text-white font-semibold text-[20px]" style={{ marginTop: "-10px" }}>
            Now Playing
          </h1>
          <div className="w-[80%] max-w-[200px] h-[250px] object-fill rounded-md overflow-hidden relative">
            <img src={songsData[index].image} alt="" className="w-[100%] h-[80%]" />
            {playingSong && (
              <div className="w-full h-[80%] bg-black absolute top-0 opacity-[0.5] flex justify-center items-center">
                <img src={musicImg} alt="" className="w-[50%]" />
              </div>
            )}
          </div>
          <div>
            <div className="text-white font-bold text-[30px] text-center" style={{ marginTop: "-60px" }}>
              {songsData[index].name}
            </div>
            <div className="text-gray-400 font-bold text-[15px] text-center">
              {songsData[index].singer}
            </div>
          </div>
          <div className="w-[50%] flex justify-center items-center relative rounded-md">
            <input
              type="range"
              style={{ marginTop: "8px" }}
              className="appearance-none w-[100%] h-[7px] rounded-md bg-gray-600"
              value={range}
              onChange={handleRange}
              onMouseDown={() => setIsSeeking(true)}
              onMouseUp={handleSeekEnd}
              onTouchStart={() => setIsSeeking(true)}
              onTouchEnd={handleSeekEnd}
            />
            <div style={{ marginTop: "8px" }} className="bg-white h-[50%] absolute left-0 rounded-md transition-all" ref={progress}></div>
          </div>
          <div className="text-white flex justify-center items-center gap-5">
            <MdSkipPrevious className="w-[35px] h-[35px] hover:text-slate-600 transition-all cursor-pointer" onClick={prevSong} />
            {playingSong ? (
              <div className="w-[50px] h-[50px] rounded-full bg-white text-black flex justify-center items-center hover:bg-slate-600 transition-all cursor-pointer" onClick={pauseSong}>
                <MdOutlinePause className="w-[20px] h-[20px]" />
              </div>
            ) : (
              <div className="w-[50px] h-[50px] rounded-full bg-white text-black flex justify-center items-center hover:bg-slate-600 transition-all cursor-pointer" onClick={playSong}>
                <IoPlay className="w-[20px] h-[20px]" />
              </div>
            )}
            <MdSkipNext className="w-[35px] h-[35px] hover:text-slate-600 transition-all cursor-pointer" onClick={nextSong} />
          </div>
        </div>
  
        {/* Right side */}
        <div className="w-full md:w-[50%] flex flex-col gap-4 pb-[10px] overflow-y-auto h-[85vh] mt-[60px] pt-[20px]">
          {songsData.map((song, i) => (
            <Card key={i} name={song.name} image={song.image} singer={song.singer} songIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
  
}

export default Home;
