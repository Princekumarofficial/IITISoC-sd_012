import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChatList } from "../components/chat-system/Chat-list"
import ChatWindow from "../components/chat-system/Chat-window"
import { TailCursor } from "../components/Tail-cursor"
import { FloatingParticles } from "../components/Floating-particle"
import { NotificationProvider } from "../components/Notification-system"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { MessageCircle, Users, Phone, Video, ArrowLeft } from "lucide-react"
import { Navbar } from "../components/Navbar"
// ✅ Define Chat type outside the component

function ChatContent() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen animated-bg color-wave relative">
      <TailCursor />
      <FloatingParticles />
        <Navbar/>
      

      {/* Main Content */}
      <div className="container mx-auto p-4 h-[calc(100vh-80px)] my-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <ChatList
            />
          </div>

          <div className="lg:col-span-2">
           
              <ChatWindow />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <NotificationProvider>
      <ChatContent />
    </NotificationProvider>
  )
}
