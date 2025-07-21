"use client"

import { useState ,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Video, History, Settings, Clock, Users, Smile, User, Zap, Star, Trophy, MessageSquare } from "lucide-react"
import { SettingsModal } from "../components/Setting-modal"
import { ProfileModal } from "../components/Profile-modal"
import { TailCursor } from "../components/Tail-cursor"
import { FloatingParticles } from "../components/Floating-particle"
import { NotificationProvider, useNotifications } from "../components/Notification-system"
import { CameraManager } from "../components/Camera-manager"
import { CallDetailsModal } from "../components/Call-details"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { createMeetingRoom } from "../utils/create-meeting";
import { useAuthStore } from "../store/useAuthStore";
import API from "../service/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { getEmojiFromEmotion } from "../utils/getEmoji";

function DashboardContent() {
  const { authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("history")

  const [showProfile, setShowProfile] = useState(false)
  const [showCameraTest, setShowCameraTest] = useState(false)
  const [showCallDetails, setShowCallDetails] = useState(false)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [allCalls, setAllCalls] = useState<any[]>([])
  const navigate = useNavigate();
  const { addNotification } = useNotifications()



useEffect(() => {
  const fetchMeetings = async () => {
    try {
      const res = await API.getMeetingsForUser();
      const meetings = res.data;
      
      const mapped = meetings.map((m: any) => {
        const duration = getDuration(m.startTime, m.participants);
        const topEmotions = m.emotionAnalytics?.topEmotions || [];
        const emotionEmojis = topEmotions.map((e: any) => getEmojiFromEmotion(e.emoji));
        return {
          id: m._id,
          title: m.title,
          participants: m.participants.map((p: any) => p.name),
          duration,
          time: dayjs(m.endTime || m.emotionAnalytics?.updatedAt || m.startTime).fromNow(),
          type: m.type,
          emotions: emotionEmojis,  // 🟢 important
    mood: getMood(m),         // optional: use analytics to calculate mood
          raw: m
        };
      });

      setAllCalls(mapped);
    } catch (err) {
      console.error("Error fetching meetings", err);
    }
  };

  fetchMeetings();
}, []);





const getDuration = (start: string, participants: any[]) => {
  if (!start || !participants || participants.length === 0) return "Unknown";

  const validLeaveTimes = participants
    .map(p => p.leaveTime)
    .filter(t => t !== null && t !== undefined)
    .map(t => dayjs(t));

  if (validLeaveTimes.length === 0) return "Unknown";

  // Find max manually
  const latest = validLeaveTimes.reduce((a, b) => (a.isAfter(b) ? a : b));
  const diffMin = latest.diff(dayjs(start), 'minute');
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
};





  const getMood = (meeting: any) => {
    // Tumhare meeting.emotionAnalytics se mood calculate kar sakte ho
    // Abhi demo: "positive" / "excited" / "celebratory"
    return "positive";
  }



  const handleJoinMeeting = async() => {
   
    
    addNotification({
      type: "info",
      title: "Joining Meeting",
      message: `Setting camera and mic access`,
    })
    setTimeout(() => {
      navigate(`/preJoin`);
    }, 1000)
  }

  const handleNewMeeting = async() => {
    const meetingId = await createMeetingRoom(authUser._id);
    addNotification({
      type: "success",
      title: "Meeting Created",
      message: `New meeting ${meetingId} created successfully!`,
    })

    setTimeout(() => {
      navigate(`/preJoin/${meetingId}`);
    }, 1000)
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive":
        return "text-green-500"
      case "excited":
        return "text-blue-500"
      case "celebratory":
        return "text-purple-500"
      default:
        return "text-muted-foreground"
    }
  }

  const handleViewDetails = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setShowCallDetails(true);
  }

  return (
    <div className="min-h-screen animated-bg color-wave relative text-black">
      <TailCursor />
      <FloatingParticles />
      <Navbar />

      <div className="pt-16">
        <div className="container mx-auto px-2 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 space-y-4 slide-in-left">
              <Card className=" glass glow breathe">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === "history" ? "secondary" : "ghost"}
                      className="w-full justify-start ripple"
                      onClick={() => setActiveTab("history")}
                    >
                      <History className="w-4 h-4 mr-2" />
                      Call History
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start ripple"
                      onClick={() => setShowProfile(true)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start ripple"
                      onClick={() => setShowCameraTest(!showCameraTest)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Camera Test
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start ripple"
                      onClick={() => navigate("/chat")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </nav>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass glow breathe">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Calls</span>
                    <Badge variant="secondary">{allCalls.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Happy Moments</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Smile className="w-3 h-3 mr-1" />
                      92%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Level</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Star className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-6">
              <div className="slide-in-up">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Welcome back, {authUser.username}! 👋
                </h2>
                <p className="text-muted-foreground">Ready for your next emotion-powered video call?</p>
              </div>

              {/* Camera Test Section */}
              {showCameraTest && (
                <Card className="glass glow slide-in-up breathe">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="w-5 h-5 mr-2" />
                      Camera & Microphone Test
                    </CardTitle>
                    <CardDescription>Test your camera and microphone before joining a meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CameraManager className="max-w-md mx-auto" />
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 slide-in-up">
                <Card
                  className="glass glow cursor-pointer hover:scale-105 transition-transform ripple breathe"
                  onClick={handleNewMeeting}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mr-3 glow ">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      Start New Meeting
                    </CardTitle>
                    <CardDescription className="text-base">
                      Create an instant meeting with AI-powered emotion recognition and face swap features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4" />
                      <span>Instant setup • HD video • Real-time emotions</span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="glass glow cursor-pointer hover:scale-105 transition-transform ripple breathe"
                  onClick={handleJoinMeeting}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 glow">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      Join Meeting
                    </CardTitle>
                    <CardDescription className="text-base">
                      Enter a meeting ID to join an existing call with advanced emotion analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Smile className="w-4 h-4" />
                      <span>Quick join • Emotion overlay • Smart reactions</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call History */}
              <Card className="glass glow slide-in-up breathe">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <History className="w-6 h-6 mr-2" />
                    Recent Calls
                  </CardTitle>
                  <CardDescription>Your latest video calls with emotion insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allCalls.map((call, index) => (
                      <Card
                        key={call.id}
                        className="glass hover:glow transition-all cursor-pointer ripple"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h4 className="font-semibold text-lg">{call.title}</h4>
                                <p className="font-semibold text-lg">{call.hostname}</p>
                                <Badge
                                  variant={call.type === "group" ? "default" : "secondary"}
                                  className="bg-gradient-to-r from-primary/20 to-blue-600/20"
                                >
                                  {call.type === "group" ? "Group" : "1-on-1"}
                                </Badge>
                                <Badge variant="outline" className={getMoodColor(call.mood)}>
                                  {call.mood}
                                </Badge>
                              </div>

                              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {call.participants.length} participant{call.participants.length > 1 ? "s" : ""}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {call.duration}
                                </div>
                                <span>{call.time}</span>
                              </div>

                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                  <Smile className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Top emotions:</span>
                                </div>
                                <div className="flex space-x-1">
                                  {call.emotions.map((emoji, index) => (
                                    <span
                                      key={index}
                                      className="text-xl hover:scale-125 transition-transform cursor-pointer"
                                    >
                                      {emoji}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="glass glow ripple"
                              onClick={() => handleViewDetails(call.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>

      <Footer />

    
      <ProfileModal open={showProfile} onOpenChange={setShowProfile} />
      <CallDetailsModal
        open={showCallDetails}
        onOpenChange={setShowCallDetails}
        meetingId={selectedMeetingId ?? ""}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  )
}
