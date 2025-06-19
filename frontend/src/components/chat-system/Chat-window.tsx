"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
import { Badge } from "../ui/Badge"
import { ScrollArea } from "../ui/Scroll-area"
import { Send, Paperclip, Smile, Phone, Video, ImageIcon, File, Mic, Camera, Users, Search, Info } from "lucide-react"
import { format } from "date-fns"
import { useNotifications } from "../Notification-system"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "audio" | "video" | "location"
  fileUrl?: string
  fileName?: string
  fileSize?: number
  isRead: boolean
  replyTo?: string
}

interface Chat {
  id: string
  name: string
  avatar?: string
  isGroup: boolean
  isOnline: boolean
  participants?: string[]
  type: "direct" | "group"
}

interface ChatWindowProps {
  chat: Chat
  currentUserId: string
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "alice",
    senderName: "Alice Johnson",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "Hey! How was your meeting today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    senderId: "current",
    senderName: "You",
    content: "It went really well! The client loved our presentation 🎉",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    type: "text",
    isRead: true,
  },
  {
    id: "3",
    senderId: "alice",
    senderName: "Alice Johnson",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "That's awesome! Can you share the slides?",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: "text",
    isRead: true,
  },
  {
    id: "4",
    senderId: "current",
    senderName: "You",
    content: "/placeholder.svg?height=200&width=300",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: "image",
    fileName: "presentation-slides.png",
    fileSize: 2048000,
    isRead: true,
  },
  {
    id: "5",
    senderId: "alice",
    senderName: "Alice Johnson",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "Perfect! Thanks for sharing 👍",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    type: "text",
    isRead: false,
  },
]

export function ChatWindow({ chat, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotifications()

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Mock typing indicator
  useEffect(() => {
    if (Math.random() > 0.7) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: "You",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
      isRead: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Mock response
    setTimeout(
      () => {
        const responses = [
          "Got it! 👍",
          "Thanks for letting me know",
          "Sounds good to me",
          "I'll check that out",
          "Perfect timing!",
        ]

        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: "alice",
          senderName: "Alice Johnson",
          senderAvatar: "/placeholder.svg?height=32&width=32",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: "text",
          isRead: false,
        }

        setMessages((prev) => [...prev, response])
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: "You",
      content: file.name,
      timestamp: new Date(),
      type: file.type.startsWith("image/") ? "image" : "file",
      fileName: file.name,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
      isRead: false,
    }

    setMessages((prev) => [...prev, message])

    addNotification({
      type: "success",
      title: "File Uploaded",
      message: `${file.name} has been sent`,
      duration: 3000,
    })
  }

  const startVideoCall = () => {
    addNotification({
      type: "info",
      title: "Starting Video Call",
      message: `Calling ${chat.name}...`,
      duration: 3000,
    })
  }

  const startVoiceCall = () => {
    addNotification({
      type: "info",
      title: "Starting Voice Call",
      message: `Calling ${chat.name}...`,
      duration: 3000,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === currentUserId

    return (
      <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-[70%]`}>
          {!isCurrentUser && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.senderAvatar || "/profile.jpg"} />
              <AvatarFallback className="text-xs">
                {message.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}

          <div className={`space-y-1 ${isCurrentUser ? "mr-2" : "ml-2"}`}>
            {!isCurrentUser && chat.isGroup && (
              <p className="text-xs text-muted-foreground px-3">{message.senderName}</p>
            )}

            <div
              className={`p-3 rounded-2xl ${
                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
              } ${message.type === "image" ? "p-1" : ""}`}
            >
              {message.type === "text" && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

              {message.type === "image" && (
                <div className="space-y-2">
                  <img
                    src={message.fileUrl || message.content}
                    alt="Shared image"
                    className="max-w-full h-auto rounded-lg"
                  />
                  {message.fileName && <p className="text-xs px-2 pb-1">{message.fileName}</p>}
                </div>
              )}

              {message.type === "file" && (
                <div className="flex items-center space-x-3 p-2">
                  <File className="w-8 h-8 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{message.fileName}</p>
                    {message.fileSize && (
                      <p className="text-xs text-muted-foreground">{formatFileSize(message.fileSize)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p className={`text-xs text-muted-foreground ${isCurrentUser ? "text-right" : "text-left"} px-3`}>
              {format(message.timestamp, "HH:mm")}
              {isCurrentUser && <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="h-full glass flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={chat.avatar || "/profile.jpg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
                {chat.isGroup ? (
                  <Users className="w-5 h-5" />
                ) : (
                  chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">{chat.name}</h3>
              <div className="flex items-center space-x-2">
                {!chat.isGroup && (
                  <Badge variant={chat.isOnline ? "default" : "secondary"} className="text-xs">
                    {chat.isOnline ? "Online" : "Offline"}
                  </Badge>
                )}
                {chat.isGroup && chat.participants && (
                  <span className="text-xs text-muted-foreground">{chat.participants.length} members</span>
                )}
                {isTyping && <span className="text-xs text-primary animate-pulse">typing...</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={startVoiceCall} className="glass">
              <Phone className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={startVideoCall} className="glass">
              <Video className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="glass">
              <Search className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="glass">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-300px)] p-4 custom-scrollbar" ref={scrollAreaRef}>
          <div className="space-y-1">{messages.map(renderMessage)}</div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={() => fileInputRef.current?.click()} className="glass">
            <Paperclip className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="ghost" className="glass">
            <Camera className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="ghost" className="glass">
            <ImageIcon className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder={`Message ${chat.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 glass"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()} className="glass glow">
            <Send className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="ghost" className="glass">
            <Mic className="w-4 h-4" />
          </Button>
        </div>

        {/* Emoji Picker Placeholder */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 p-4 bg-background border rounded-lg shadow-lg glass">
            <div className="grid grid-cols-8 gap-2">
              {["😀", "😂", "😍", "🤔", "👍", "👏", "🎉", "❤️", "🔥", "✨", "💡", "🚀", "😊", "😎", "🤗", "😘"].map(
                (emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setNewMessage((prev) => prev + emoji)
                      setShowEmojiPicker(false)
                    }}
                    className="text-xl hover:bg-muted p-1 rounded"
                  >
                    {emoji}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileUpload}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </Card>
  )
}
