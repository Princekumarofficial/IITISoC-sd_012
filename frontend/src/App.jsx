import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import HelpPage from './pages/Help'
import LoginPage from './pages/Loginpage'
import ChatPage from './pages/Chat'
import DashboardPage from './pages/Dashboard'
import MeetingPage from './pages/Meetingid'
import AboutPage from './pages/About'


function App() {
 

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meeting/:id" element={<MeetingPage />} />
        <Route path="/chat" element={<ChatPage />} />
      
      <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/meeting:id" element={<MeetingPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
