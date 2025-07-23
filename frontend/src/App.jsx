import { useState ,useEffect} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import HelpPage from './pages/Help'
import LoginPage from './pages/Loginpage'
import ChatPage from './pages/Chat'
import DashboardPage from './pages/Dashboard'
import MeetingPage from './pages/Meetingid'
import AboutPage from './pages/About'
import ContactForm from './pages/ContactUs'
import ProfilePage from './pages/profile'
import PreJoinPage from './pages/PreJoin'

import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import LegalPage from './pages/LegalPage'


function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
 
  console.log({ onlineUsers  } , " online user from app.jsx");
  console.log( authUser);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <>
     <BrowserRouter>
    

      <Routes>
        <Route path="/" element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />}/>
        <Route path="/dashboard" element={authUser ? <DashboardPage /> : <Navigate to="/" />} />

         <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/" />} />
        <Route path="/about" element={authUser ? <AboutPage /> : <Navigate to="/" />} />
        <Route path="/help" element={authUser ? <HelpPage /> : <Navigate to="/" />} />
        <Route path="/meeting/:id" element={authUser ? <MeetingPage /> : <Navigate to="/" />} />
        <Route path="/profilepage" element={authUser ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/contactus" element={authUser ? <ContactForm /> : <Navigate to="/" />} />
        <Route path="/preJoin/:id?" element={authUser ? <PreJoinPage />: <Navigate to="/" />} />
          <Route path="/legal" element={<LegalPage />} />
      </Routes>
     
     
    </BrowserRouter>

    </>
  )
}

export default App
