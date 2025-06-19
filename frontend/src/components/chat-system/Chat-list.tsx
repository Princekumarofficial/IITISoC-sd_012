"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
import { Badge } from "../ui/Badge"
import { ScrollArea } from "../ui/Scroll-area"
import { Search, Plus, Users, Phone, Video, MoreVertical, Pin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Chat {
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

interface ChatListProps {
  onChatSelect: (chat: Chat) => void
  selectedChatId?: string
}

// Mock chat data
const mockChats: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/profile.jpg?height=40&width=40",
    lastMessage: "Hey! How was your meeting today?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 2,
    isGroup: false,
    isOnline: true,
    isPinned: true,
    type: "direct",
  },
  {
    id: "2",
    name: "Team Standup",
    lastMessage: "Bob: Great work everyone! 👏",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 5,
    isGroup: true,
    isOnline: false,
    isPinned: true,
    participants: ["Bob", "Charlie", "Diana", "Eve"],
    type: "group",
  },
  {
    id: "3",
    name: "Sarah Wilson",
    avatar: "/profile.jpg?height=40&width=40",
    lastMessage: "Thanks for the presentation slides!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    isGroup: false,
    isOnline: false,
    isPinned: false,
    type: "direct",
  },
  {
    id: "4",
    name: "Project Alpha",
    lastMessage: "Charlie: Updated the timeline in the doc",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    unreadCount: 1,
    isGroup: true,
    isOnline: false,
    isPinned: false,
    participants: ["Charlie", "Diana", "Frank"],
    type: "group",
  },
  {
    id: "5",
    name: "Mike Chen",
    avatar: "/profile.jpg?height=40&width=40",
    lastMessage: "Let's schedule a call for tomorrow",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    isGroup: false,
    isOnline: true,
    isPinned: false,
    type: "direct",
  },
]

export function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats)

  // Filter chats based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredChats(filtered)
    }
  }, [searchQuery, chats])

  // Sort chats: pinned first, then by last message time
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
  })

  const handleChatClick = (chat: Chat) => {
    onChatSelect(chat)
    // Mark as read
    setChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)))
  }

  const togglePin = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat)))
  }

  return (
    <Card className="h-full glass">
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)] custom-scrollbar">
          <div className="space-y-1 p-2">
            {sortedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 group ${
                  selectedChatId === chat.id ? "bg-primary/10 border border-primary/20" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar || "/group.jpeg"} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
                        {chat.isGroup ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          chat.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {!chat.isGroup && chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                        {chat.isPinned && <Pin className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(chat.lastMessageTime, { addSuffix: true })}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => togglePin(chat.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                        >
                          <Pin className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">{chat.lastMessage}</p>
                      <div className="flex items-center space-x-2 ml-2">
                        {chat.unreadCount > 0 && (
                          <Badge
                            variant="default"
                            className="text-xs min-w-[20px] h-5 flex items-center justify-center"
                          >
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </Badge>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                            <Video className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {chat.isGroup && chat.participants && (
                      <div className="flex items-center mt-1">
                        <Users className="w-3 h-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{chat.participants.length} members</span>
                      </div>
                    )}
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
