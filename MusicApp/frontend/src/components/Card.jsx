import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddSong, RemoveSong } from "../redux/PlaylistSlice";
import { songsData } from "../songs";
import { MdOutlinePlaylistAdd, MdOutlinePlaylistRemove } from "react-icons/md";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { datacontext } from "../context/UserContext";
import { AddLiked, RemoveLiked } from "../redux/LikedSlice"; // 👈 ADD THIS LINE

function Card({ name, image, singer, songIndex }) {
  console.log("Card:", name, singer, songIndex);

  let { playSong, index, setIndex } = useContext(datacontext);
  let dispatch = useDispatch();
  let gaana = useSelector((state) => state.playlist);
  const songExistInPlaylist = gaana.some(
    (song) => song.songIndex === songIndex
  );
  let likedSong = useSelector((state) => state.liked);
  const songExistInLiked = likedSong.some(
    (song) => song.songIndex === songIndex
  );

  return (
    <div className="w-[90%] h-[70px] md:h-[90px] bg-gray-800 rounded-lg flex justify-center items-center hover:bg-gray-600 transition-all">
      <div
        className="flex justify-start items-center gap-[30px] w-[70%] h-[100%] p-[2px] md:p-[5px] cursor-pointer"
        onClick={() => {
          setIndex(songIndex);
          playSong(songIndex);
        }}
      >
        <div>
          <img
            src={image}
            alt=""
            className="w-[60px] max-h-[60px] md:max-h-[80px] md:w-[80px] rounded-lg"
          />
        </div>
        <div className="text-[15px] md:text-[20px]">
          <div className="text-white text-[1.1em] font-semibold">{name}</div>
          <div className="text-white text-[0.6em] font-semibold">{singer}</div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-[30px] w-[30%] h-[100%] p-[2px] md:p-[5px] text-[15px] md:text-[20px]">
        
        <div
          onClick={() => {
            if (songExistInPlaylist) {
              dispatch(RemoveSong(songIndex));
            } else {
              dispatch(AddSong({ name, image, singer, songIndex }));
            }
          }}
        >
          {songExistInPlaylist ? (
            <MdOutlinePlaylistRemove className="text-white text-[1.5em] cursor-pointer" />
          ) : (
            <MdOutlinePlaylistAdd className="text-white text-[1.5em] cursor-pointer" />
          )}
        </div>

      
        <div
          onClick={() => {
            if (songExistInLiked) {
              dispatch(RemoveLiked(songIndex));
            } else {
              dispatch(AddLiked({ name, image, singer, songIndex }));
            }
          }}
        >
          {songExistInLiked ? (
            <IoMdHeart className="text-white text-[1.3em] cursor-pointer" />
          ) : (
            <IoMdHeartEmpty className="text-white text-[1.3em] cursor-pointer" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;

