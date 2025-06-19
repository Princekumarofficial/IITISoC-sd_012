import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChatList } from "../components/chat-system/Chat-list"
import { ChatWindow } from "../components/chat-system/Chat-window"
import { TailCursor } from "../components/Tail-cursor"
import { FloatingParticles } from "../components/Floating-particle"
import { NotificationProvider } from "../components/Notification-system"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { MessageCircle, Users, Phone, Video, ArrowLeft } from "lucide-react"
import { Navbar } from "../components/Navbar"
// ✅ Define Chat type outside the component
type Chat = {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isGroup: boolean
  isOnline: boolean
  isPinned: boolean
  participants?: string[]
  type: "direct" | "group"
}

function ChatContent() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const currentUserId = "current"
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
              onChatSelect={setSelectedChat}
              selectedChatId={selectedChat?.id}
            />
          </div>

          {/* Chat Window or Welcome */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <ChatWindow chat={selectedChat} currentUserId={currentUserId} />
            ) : (
              <Card className="h-full glass flex items-center justify-center breathe">
                <CardContent className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto glow">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Welcome to MediCall Chat</h3>
                    <p className="text-muted-foreground">
                      Select a conversation to start messaging, or create a new chat to get started.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Group chats</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>Voice calls</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="w-4 h-4" />
                      <span>Video calls</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
