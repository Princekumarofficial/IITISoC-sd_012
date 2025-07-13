"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { ScrollArea } from "../components/ui/Scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { MessageSquare, Phone, UserCheck, UserX, Clock, Video, Download, Share, Star, Users, Smile } from "lucide-react"
import { format } from "date-fns"
import { useMeetingChatStore } from "../store/useMeetingStore"

interface CallDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meetingId: string
}

export function CallDetailsModal({ open, onOpenChange, meetingId }: CallDetailsModalProps) {
  const { fetchMeetingById, meeting, messages, participants } = useMeetingChatStore()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (open && meetingId) {
      fetchMeetingById(meetingId)
    }
  }, [open, meetingId, fetchMeetingById])

  if (!meeting) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "attended": return "bg-green-100 text-green-700 border-green-200"
      case "invited": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "declined": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attended": return <UserCheck className="w-3 h-3" />
      case "invited": return <Clock className="w-3 h-3" />
      case "declined": return <UserX className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {meeting.title} - Call Details
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="chat">Meeting Chat</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {/* ✅ Overview */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Video className="w-5 h-5 mr-2" /> Call Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Start Time:</span>
                      <span className="text-sm font-medium">
                        {meeting.startTime ? format(new Date(meeting.startTime), "MMM dd, yyyy 'at' HH:mm") : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-medium">{meeting.duration || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="outline">{meeting.type === "group" ? "Group Call" : "1-on-1"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Overall Mood:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {meeting.mood || "Neutral"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(meeting.overallRating || 0) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-sm font-medium ml-1">{meeting.overallRating || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ✅ Participants */}
            <TabsContent value="participants" className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Participants ({participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 custom-scrollbar">
                    <div className="space-y-3">
                      {participants.map((p) => (
                        <div key={p.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={p.avatar || "/profile.jpg"} />
                            <AvatarFallback>{p.name?.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{p.name}</h4>
                              <Badge variant="outline" className={getStatusColor(p.status)}>
                                {getStatusIcon(p.status)}
                                <span className="ml-1 capitalize">{p.status}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ✅ Chat */}
            <TabsContent value="chat" className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Meeting Chat ({messages.length} messages)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 custom-scrollbar">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {msg.sender?.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium">{msg.sender}</span>
                              <span className="text-xs text-muted-foreground">
                                {msg.timestamp ? format(new Date(msg.timestamp), "HH:mm") : ""}
                              </span>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t text-black">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="glass glow">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
