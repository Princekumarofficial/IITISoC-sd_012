"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { ScrollArea } from "../components/ui/Scroll-area"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"
import { Send } from "lucide-react"

// Mock chat messages
const initialMessages = [
  {
    id: "1",
    sender: "Alice Johnson",
    message: "Great presentation! The emotion data is really insightful.",
    time: "14:30",
    isLocal: false,
  },
  {
    id: "2",
    sender: "You",
    message: "Thanks! The real-time analysis is working perfectly.",
    time: "14:31",
    isLocal: true,
  },
  {
    id: "3",
    sender: "Bob Smith",
    message: "I love how we can see everyone's reactions in real-time 😊",
    time: "14:32",
    isLocal: false,
  },
  {
    id: "4",
    sender: "Charlie Brown",
    message: "This will be game-changing for our client meetings!",
    time: "14:33",
    isLocal: false,
  },
]

export function ChatPanel() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
        isLocal: true,
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col   h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar  ">
        <div className="space-y-4 ">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${message.isLocal ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  {message.sender
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${message.isLocal ? "text-right" : ""}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium">{message.sender}</span>
                  <span className="text-xs text-muted-foreground">{message.time}</span>
                </div>
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.isLocal ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon">
            <Send className="w-4 h-4 " />
          </Button>
        </div>
      </div>
    </div>
  )
}
