import {configureStore} from "@reduxjs/toolkit"
import PlaylistSlice from "./PlaylistSlice"
import LikedSlice from "./LikedSlice"
export const store=configureStore({
 reducer:{
    playlist:PlaylistSlice,
    liked:LikedSlice

 }
}
) 
