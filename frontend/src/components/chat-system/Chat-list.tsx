"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
import { ScrollArea } from "../ui/Scroll-area"
import { Search, Plus, MoreVertical, Pin } from "lucide-react"

import { useAuthStore } from "../../store/useAuthStore"
import { useChatStore } from "../../store/useChatStore"

interface ChatListProps {
  onChatSelect: (chat: any) => void
  selectedChatId?: string 
}

export function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const { getUsers, users, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [pinnedChats, setPinnedChats] = useState<{ [id: string]: boolean }>({})

  useEffect(() => {
    getUsers()
  }, [getUsers])

  // Filter and map users
  const filteredChats = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((user) => ({
      id: user._id,
      name: user.username,
      avatar: user.avatar || "/profile.jpg",
      email: user.email || "",
      isOnline: onlineUsers.includes(user._id),
      isPinned: pinnedChats[user._id] || false,
      type: user.type || "direct"
    }))

  // Sort pinned first
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  const handleChatClick = (chat: any) => {
    onChatSelect(chat)
    setSelectedUser(chat)
  }

  const togglePin = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPinnedChats((prev) => ({ ...prev, [chatId]: !prev[chatId] }))
  }

  return (
    <Card className="h-full glass my-5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Messages</CardTitle>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="glass">
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="glass">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground " />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass glow"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)] custom-scrollbar">
          <div className="space-y-1 p-2 ">
            {sortedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 group ${
                  selectedChatId === chat.id ? "bg-primary/10 border border-primary/20" : ""
                }`}
              >
                <div className="flex items-center space-x-3 glow rounded-lg">
                  <div className="relative ">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
                        {chat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                        {chat.isPinned && <Pin className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => togglePin(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                      >
                        <Pin className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
