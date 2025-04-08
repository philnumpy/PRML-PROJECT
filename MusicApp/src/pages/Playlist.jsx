import React from "react";
import Player from "../components/Player";
import { useSelector } from "react-redux";
import Card from '../components/Card';


function Playlist() {
  let songs = useSelector((state) => state.playlist);
  return (
    <div className="w-full h-[100vh] bg-black flex justify-start items-center flex-col pt-[15px] md:pt-[70px] gap-[17px] pb-[100px]">
      <Player />

      {songs.length > 0 ? (
        <>
          <h1 className="text-white">Your Playlist</h1>
          <div className="w-full h-[65%] md:h-[100%] flex flex-col justify-start items-center gap-[15px] overflow-auto">
            {songs.map((song) => (
              <Card
                key={song.songIndex}
                name={song.name}
                image={song.image}
                singer={song.singer}
                songIndex={song.songIndex}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-white font-semibold text-[18px]"> No songs in playlist :(</div>
      )}
    </div>
  );
}

export default Playlist;