import React, { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../songs";
export const datacontext = createContext();

function UserContext({ children }) {
  let audioRef = useRef(new Audio());
  let [index, setIndex] = useState(0);
  let [playingSong, setplayingSong] = useState(false);

  useEffect(() => {
    audioRef.current.src = songsData[index].song;
    audioRef.current.load();
    if(playingSong){
      playSong()
    }
  }, [index]);

  function playSong() {
    setplayingSong(true);
    audioRef.current.play();
  }

  function pauseSong() {
    setplayingSong(false);
    audioRef.current.pause();
  }

  function nextSong() {
    setIndex((prev)=>(prev+1)%songsData.length)
  }

  function prevSong() {
    setIndex((prev)=>{
      if(prev===0){
        return songsData.length - 1 
      }
      else{
        return prev-1
      }
    })
  }

  let value = {
    audioRef,
    playSong,
    pauseSong,
    playingSong,
    setplayingSong,
    nextSong,
    index,
    setIndex,
    prevSong
  }
  return (
    <div>
      <datacontext.Provider value={value}>{children}</datacontext.Provider>
    </div>
  );
}

export default UserContext;

