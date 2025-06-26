import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import HelpPage from './pages/Help'
import LoginPage from './pages/Loginpage'
import ChatPage from './pages/Chat'
import DashboardPage from './pages/Dashboard'
import MeetingPage from './pages/Meetingid'
import AboutPage from './pages/About'
import ContactForm from './pages/ContactUs'

import { AuthProvider } from './context/AuthProvider'
import PrivateRoute from './components/PrivateRoute'
import { UserProvider } from './context/UserContext'


function App() {
 

  return (
    <>
     <BrowserRouter>
     <AuthProvider>
      <UserProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute>
          <DashboardPage />
          </PrivateRoute>} />
          <Route path="/contactus" element={<PrivateRoute>
          <ContactForm />
          </PrivateRoute>} />
        <Route path="/meeting/:id" element={<PrivateRoute>
          <MeetingPage />
          </PrivateRoute>} />
      
      <Route path="/about" element={
        <PrivateRoute>
        <AboutPage />
        </PrivateRoute>} />
        <Route path="/help" element={
          <PrivateRoute>
          <HelpPage />
          </PrivateRoute>} />
        <Route path="/meeting:id" element={<PrivateRoute>
          <MeetingPage />
          </PrivateRoute>} />
        <Route path="/chat" element={
          <PrivateRoute>
            <ChatPage />
            </PrivateRoute>} />
      </Routes>
      </UserProvider>
      </AuthProvider>
    </BrowserRouter>

    </>
  )
}

export default App
