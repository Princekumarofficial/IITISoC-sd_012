"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { ScrollArea } from "../components/ui/Scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Separator } from "../components/ui/Separator"
import {
  Users,
  Clock,
  Smile,
  MessageSquare,
  Phone,
  Video,
  UserCheck,
  UserX,
  Download,
  Share,
  Star,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"

interface CallDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  call: {
    id: string
    title: string
    participants: string[]
    duration: string
    time: string
    emotions: string[]
    type: string
    mood: string
  }
}

// Mock detailed call data
const getCallDetails = (callId: string) => ({
  id: callId,
  title: "Team Standup",
  startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  endTime: new Date(Date.now() - 1000 * 60 * 60 * 1.25), // 1.25 hours ago
  duration: "45 min",
  type: "group",
  mood: "positive",
  overallRating: 4.5,
  participants: [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/profile.jpg?height=40&width=40",
      joinTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      leaveTime: new Date(Date.now() - 1000 * 60 * 60 * 1.25),
      status: "attended",
      emotions: ["😊", "🤔", "👍"],
      speakingTime: "12 min",
      happinessScore: 85,
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/profile.jpg?height=40&width=40",
      joinTime: new Date(Date.now() - 1000 * 60 * 60 * 1.95),
      leaveTime: new Date(Date.now() - 1000 * 60 * 60 * 1.25),
      status: "attended",
      emotions: ["👏", "💡", "😄"],
      speakingTime: "8 min",
      happinessScore: 92,
    },
    {
      id: "3",
      name: "Charlie Brown",
      avatar: "/profile.jpg?height=40&width=40",
      joinTime: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
      leaveTime: new Date(Date.now() - 1000 * 60 * 60 * 1.3),
      status: "attended",
      emotions: ["🎉", "✨", "👍"],
      speakingTime: "15 min",
      happinessScore: 88,
    },
    {
      id: "4",
      name: "Diana Prince",
      status: "invited",
      emotions: [],
      speakingTime: "0 min",
      happinessScore: 0,
    },
    {
      id: "5",
      name: "Eve Wilson",
      status: "declined",
      emotions: [],
      speakingTime: "0 min",
      happinessScore: 0,
    },
  ],
  chatMessages: [
    {
      id: "1",
      sender: "Alice Johnson",
      message: "Good morning everyone! Ready for the standup?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "text",
    },
    {
      id: "2",
      sender: "Bob Smith",
      message: "Yes! I have some exciting updates to share 🚀",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.95),
      type: "text",
    },
    {
      id: "3",
      sender: "Charlie Brown",
      message: "The new feature is working perfectly!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
      type: "text",
    },
    {
      id: "4",
      sender: "Alice Johnson",
      message: "Great work team! Client feedback has been amazing 👏",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8),
      type: "text",
    },
    {
      id: "5",
      sender: "Bob Smith",
      message: "Should we schedule a demo for next week?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7),
      type: "text",
    },
    {
      id: "6",
      sender: "Charlie Brown",
      message: "I'll prepare the presentation slides",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.6),
      type: "text",
    },
    {
      id: "7",
      sender: "Alice Johnson",
      message: "Perfect! Thanks everyone for the productive meeting 🎉",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.3),
      type: "text",
    },
  ],
  emotionAnalytics: {
    totalEmotions: 156,
    topEmotions: [
      { emoji: "😊", count: 45, percentage: 29 },
      { emoji: "👍", count: 38, percentage: 24 },
      { emoji: "🤔", count: 32, percentage: 21 },
      { emoji: "👏", count: 25, percentage: 16 },
      { emoji: "🎉", count: 16, percentage: 10 },
    ],
    averageHappiness: 88,
    engagementLevel: 92,
  },
  recording: {
    available: true,
    duration: "45:32",
    size: "125 MB",
    quality: "HD 1080p",
  },
})

export function CallDetailsModal({ open, onOpenChange, call }: CallDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const callDetails = getCallDetails(call.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "attended":
        return "bg-green-100 text-green-700 border-green-200"
      case "invited":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "declined":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attended":
        return <UserCheck className="w-3 h-3" />
      case "invited":
        return <Clock className="w-3 h-3" />
      case "declined":
        return <UserX className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {callDetails.title} - Call Details
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="chat">Meeting Chat</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Call Info */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Video className="w-5 h-5 mr-2" />
                      Call Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Start Time:</span>
                      <span className="text-sm font-medium">
                        {format(callDetails.startTime, "MMM dd, yyyy 'at' HH:mm")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-medium">{callDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="outline">{callDetails.type === "group" ? "Group Call" : "1-on-1"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Overall Mood:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {callDetails.mood}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(callDetails.overallRating)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium ml-1">{callDetails.overallRating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Participants Joined:</span>
                      <span className="text-sm font-medium">
                        {callDetails.participants.filter((p) => p.status === "attended").length} /{" "}
                        {callDetails.participants.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Happiness:</span>
                      <span className="text-sm font-medium text-green-600">
                        {callDetails.emotionAnalytics.averageHappiness}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engagement Level:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {callDetails.emotionAnalytics.engagementLevel}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Emotions:</span>
                      <span className="text-sm font-medium">{callDetails.emotionAnalytics.totalEmotions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Chat Messages:</span>
                      <span className="text-sm font-medium">{callDetails.chatMessages.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recording Info */}
              {callDetails.recording.available && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Video className="w-5 h-5 mr-2" />
                      Recording Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Duration: {callDetails.recording.duration} • Size: {callDetails.recording.size}
                        </p>
                        <p className="text-xs text-muted-foreground">Quality: {callDetails.recording.quality}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="glass">
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button size="sm" className="glass">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="participants" className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Participants ({callDetails.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 custom-scrollbar">
                    <div className="space-y-3">
                      {callDetails.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50"
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={participant.avatar || "/profile.jpg"} />
                            <AvatarFallback>
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{participant.name}</h4>
                              <Badge variant="outline" className={getStatusColor(participant.status)}>
                                {getStatusIcon(participant.status)}
                                <span className="ml-1 capitalize">{participant.status}</span>
                              </Badge>
                            </div>

                            {participant.status === "attended" && (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>Joined: {format(participant.joinTime!, "HH:mm")}</span>
                                  <span>Left: {format(participant.leaveTime!, "HH:mm")}</span>
                                  <span>Speaking: {participant.speakingTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground">Emotions:</span>
                                  <div className="flex space-x-1">
                                    {participant.emotions.map((emoji, index) => (
                                      <span key={index} className="text-sm">
                                        {emoji}
                                      </span>
                                    ))}
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    <Smile className="w-3 h-3 mr-1" />
                                    {participant.happinessScore}%
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>

                          {participant.status === "attended" && (
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                <Phone className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Meeting Chat ({callDetails.chatMessages.length} messages)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 custom-scrollbar">
                    <div className="space-y-4">
                      {callDetails.chatMessages.map((message) => (
                        <div key={message.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {message.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium">{message.sender}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(message.timestamp, "HH:mm")}
                              </span>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smile className="w-5 h-5 mr-2" />
                      Top Emotions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {callDetails.emotionAnalytics.topEmotions.map((emotion, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-2xl">{emotion.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{emotion.count} times</span>
                            <span>{emotion.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${emotion.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Happiness</span>
                        <span className="font-medium">{callDetails.emotionAnalytics.averageHappiness}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${callDetails.emotionAnalytics.averageHappiness}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Level</span>
                        <span className="font-medium">{callDetails.emotionAnalytics.engagementLevel}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${callDetails.emotionAnalytics.engagementLevel}%` }}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {callDetails.participants.filter((p) => p.status === "attended").length}
                        </div>
                        <div className="text-xs text-muted-foreground">Attended</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {callDetails.participants.filter((p) => p.status === "invited").length}
                        </div>
                        <div className="text-xs text-muted-foreground">Invited</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t text-black">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="glass glow ">
            <Download className="w-4 h-4 mr-2 " />
            Export Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
