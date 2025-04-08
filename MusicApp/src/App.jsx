import React from 'react'
import Home from './pages/Home'
import Search from './pages/Search'
import Liked from './pages/Liked'
import Playlist from './pages/Playlist'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Nav from './components/Nav'

function App() {
  return (
    <BrowserRouter>
    <Nav/>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/playlist" element={<Playlist/>}/>
        <Route path="/liked" element={<Liked/>}/>
    </Routes>    
        </BrowserRouter>
  )
}

export default App
