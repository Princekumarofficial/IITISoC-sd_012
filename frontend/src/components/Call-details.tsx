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
import { getEmojiFromEmotion } from "../utils/getEmoji"
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





  const emotionToEmoji = (emotion: string): string => {
  const map: Record<string, string> = {
    neutral: "😐",
    happy: "😄",
    sad: "😢",
    angry: "😠",
    fear: "😨",
    disgusted: "🤢",
    surprised: "😲",
  }
  return map[emotion] || "❓"
}

  const calculateDuration = (start: string, participants: any[]) => {
  if (!start || !participants?.length) return "Unknown";

  const leaveTimes = participants
    .map(p => p.leaveTime)
    .filter(Boolean)
    .map(t => new Date(t).getTime());

  if (!leaveTimes.length) return "Unknown";

  const maxLeave = new Date(Math.max(...leaveTimes));
  const diffMs = maxLeave.getTime() - new Date(start).getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  return hours ? `${hours}h ${minutes}min` : `${minutes} min`;
};


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
                      <span className="text-sm font-medium">
                      {calculateDuration(meeting.startTime, participants)}
                    </span>
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
                    
                  </CardContent>
                </Card>
                
                <Card className="glass">
  <CardHeader>
    <CardTitle className="flex items-center text-lg">
      <Smile className="w-5 h-5 mr-2" /> Emotion Analytics
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    <div className="text-sm text-muted-foreground">
      Total Emotions Detected:{" "}
      <span className="font-semibold">{meeting.emotionAnalytics.totalEmotions}</span>
    </div>

    {meeting.emotionAnalytics.topEmotions.map((emotion, index) => {
      const percentage = ((emotion.count / meeting.emotionAnalytics.totalEmotions) * 100).toFixed(1)

      return (
        <div key={index} className="flex items-center space-x-3">
          <span className="text-2xl">{getEmojiFromEmotion(emotion.emoji)}</span>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize">{emotion.emoji} ({emotion.count}x)</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      )
    })}
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
                          <div className="flex-1 space-y-1">
  <div className="flex items-center space-x-2">
    <h4 className="font-medium">{p.name}</h4>
    
  </div>
  <div className="text-xs text-muted-foreground">
    Joined: {p.joinTime ? format(new Date(p.joinTime), "HH:mm") : "N/A"} | Left: {p.leaveTime ? format(new Date(p.leaveTime), "HH:mm") : "N/A"}
  </div>
  {p.emotions?.length > 0 && (
  <div className="flex items-center gap-1 text-sm text-muted-foreground">
    <Smile className="w-4 h-4" />
    <span>{p.emotions.map(emotionToEmoji).join(" ")}</span>
  </div>
)}
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
