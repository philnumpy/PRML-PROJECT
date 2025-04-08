import React, { useContext } from 'react';
import { songsData } from '../songs';
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { IoPlay } from "react-icons/io5";
import { MdOutlinePause } from "react-icons/md";
import { datacontext } from '../context/UserContext';

function Player() {
  const {
    playingSong,
    playSong,
    pauseSong,
    prevSong,
    nextSong,
    index,
  } = useContext(datacontext);

  return (
    <div className="w-[90%] md:w-[60%] h-[80px] bg-gray-900 fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 flex justify-between items-center rounded-lg shadow-lg px-6">
      
      <div className="flex items-center gap-3 overflow-hidden">
        <img
          src={songsData[index].image}
          alt={songsData[index].name}
          className="w-[50px] h-[50px] rounded-md object-cover"
        />
        <div className="text-white text-sm md:text-base leading-tight">
          <div className="font-semibold truncate w-[120px] md:w-[180px]">
            {songsData[index].name}
          </div>
          <div className="text-gray-400 text-xs truncate w-[120px] md:w-[180px]">
            {songsData[index].singer}
          </div>
        </div>
      </div>

      
      <div className="flex items-center gap-4">
        <MdSkipPrevious
          className="text-white w-6 h-6 md:w-7 md:h-7 cursor-pointer hover:text-gray-400"
          onClick={prevSong}
        />
        {!playingSong ? (
          <div
            className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
            onClick={playSong}
          >
            <IoPlay className="w-5 h-5" />
          </div>
        ) : (
          <div
            className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
            onClick={pauseSong}
          >
            <MdOutlinePause className="w-5 h-5" />
          </div>
        )}
        <MdSkipNext
          className="text-white w-6 h-6 md:w-7 md:h-7 cursor-pointer hover:text-gray-400"
          onClick={nextSong}
        />
      </div>
    </div>
  );
}

export default Player;