import React from 'react'
import { TiHome } from "react-icons/ti";
import { FaSearch } from "react-icons/fa";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import {Link} from "react-router-dom"

function Nav() {
  return (
    <div className="w-full h-[70px] fixed bottom-0 md:top-0 text-white flex justify-center items-center gap-7
                    bg-black/30 backdrop-blur-md z-50 shadow-lg">
      <Link to={"/"}><TiHome className='w-[40px] h-[40px]'/></Link>
      {/* <Link to={"/search"}><FaSearch className='w-[30px] h-[30px]'/></Link> */}
      <Link to={"/playlist"}><MdOutlinePlaylistAdd className='w-[40px] h-[40px]'/></Link>
      <Link to={"/liked"}><FaHeart className='w-[30px] h-[30px]'/></Link>

    </div>
  )
}

export default Nav
