import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddSong, RemoveSong } from "../redux/PlaylistSlice";
import { MdOutlinePlaylistAdd, MdOutlinePlaylistRemove } from "react-icons/md";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { datacontext } from "../context/UserContext";
import { AddLiked, RemoveLiked } from "../redux/LikedSlice";

function Card({ name, image, singer, songIndex, trackUrl, similarity }) {
  console.log("Card:", name, singer, songIndex, trackUrl, similarity);

  let { playSong, index, setIndex } = useContext(datacontext);
  let dispatch = useDispatch();
  let gaana = useSelector((state) => state.playlist);
  const songExistInPlaylist = gaana.some((song) => song.songIndex === songIndex);
  let likedSong = useSelector((state) => state.liked);
  const songExistInLiked = likedSong.some((song) => song.songIndex === songIndex);

  return (
    <div className="w-[250px] h-[350px] bg-gray-800 rounded-lg flex flex-col justify-between items-center p-6 hover:bg-gray-600 transition-all">
      {/* Image */}
      <div className="w-full h-[200px] flex justify-center mb-4">
        <img
          src={image}
          alt=""
          className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-lg object-cover"
        />
      </div>

      {/* Song Information */}
      <div className="text-center text-white">
        <div className="text-[1.2em] font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: '200px' }}>
          {name}
        </div>
        <div className="text-[1em] font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: '200px' }}>
          {singer}
        </div>
        {trackUrl && (
          <div className="text-[0.85em] text-gray-300 mt-2 truncate">
            <a href={trackUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Listen here
            </a>
          </div>
        )}
      </div>

      {/* Action buttons (Playlist and Like) */}
      <div className="flex justify-between items-center w-full mt-4">
        <div
          onClick={() => {
            if (songExistInPlaylist) {
              dispatch(RemoveSong(songIndex));
            } else {
              dispatch(AddSong({ name, image, singer, songIndex, trackUrl, similarity }));
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
              dispatch(AddLiked({ name, image, singer, songIndex, trackUrl, similarity }));
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


