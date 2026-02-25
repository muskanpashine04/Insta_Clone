
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'
import MainPage from './MainPage'
import CreatePost from './CreatePost'   // ← NEW IMPORT
import Profile from './Profile'
import ChatPage from "./ChatPage";
import CloseFriends from "./CloseFriends";
const App = () => {
  return (
    <div>
      <Routes>

        {/* Default page should be login */}
        <Route path='/' element={<Login />} />

        {/* Signup page */}
        <Route path='/signup' element={<SignUp />} />

        {/* Main Instagram feed */}
        <Route path='/home' element={<MainPage />} />

        {/* ⭐ Create Post Page */}
        <Route path='/create' element={<CreatePost />} />
        <Route path='/profile' element={<Profile />} />

        <Route path="/chat" element={<ChatPage />} />
        <Route path="/close-friends" element={<CloseFriends />} /> {/* ⭐ */}

      </Routes>
    </div>
  )
}

export default App
