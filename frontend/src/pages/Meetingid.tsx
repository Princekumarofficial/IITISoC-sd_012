"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Separator } from "../components/ui/Separator"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Smile,
  MessageSquare,
  Users,
  MoreVertical,
  Maximize,
  Minimize,
  Share,
  RepeatIcon as Record,
  Sparkles,
  Zap,
  Clock,
} from "lucide-react"
import { VideoTile } from "../components/VideoTile"
import { EmotionFeed } from "../components/Emotion-feed"
import { ChatPanel } from "../components/Chat-panel"
import { TailCursor } from "../components/Tail-cursor"
import { useSFUClient } from "../hooks/useSFUClient";
import { NotificationProvider, useNotifications } from "../components/Notification-system"
import { getEmojiFromEmotion } from "../utils/getEmoji";
import { useParams } from "react-router-dom";
// Mock participants data
const participants = [
  {
    id: "1",
    name: "You",
    isLocal: true,
    isMuted: false,
    isVideoOn: true,
    emotion: "",
    emotionConfidence: 0.85,
    stream: null,
  },
  {
    id: "2",
    name: "Alice Johnson",
    isLocal: false,
    isMuted: false,
    isVideoOn: true,
    emotion: "",
    emotionConfidence: 0.72,
    stream: null,
  },
  {
    id: "3",
    name: "Bob Smith",
    isLocal: false,
    isMuted: true,
    isVideoOn: true,
    emotion: "👍",
    emotionConfidence: 0.91,
    stream: null,
  },
  {
    id: "4",
    name: "Charlie Brown",
    isLocal: false,
    isMuted: false,
    isVideoOn: false,
    emotion: "😄",
    emotionConfidence: 0.68,
    stream: null,
  },
]

function MeetingContent() {
  const { id } = useParams();
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isEmotionDetectionOn, setIsEmotionDetectionOn] = useState(true)
  const [isEmojiOverlayOn, setIsEmojiOverlayOn] = useState(true)
  const [isFaceSwapOn, setIsFaceSwapOn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState("emotions")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [meetingDuration, setMeetingDuration] = useState(0)
  const navigate = useNavigate();
  const { addNotification } = useNotifications()
  const { localStream, remoteStreams, toggleMic, toggleCam } = useSFUClient(id || "");
  const [localEmotion, setLocalEmotion] = useState<string>("");
  const [localEmotionConfidence, setLocalEmotionConfidence] = useState<number>(0);
  // Meeting timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLocalEmotionDetected = ({
    emotion,
    confidence,
  }: {
    emotion: string;
    confidence: number;
  }) => {
    console.log("Local emotion:", emotion, confidence.toFixed(2));
    setLocalEmotion(emotion);
    setLocalEmotionConfidence(confidence);

    // Optionally send to backend or WebSocket:
    // sendEmotionUpdateToServer(emotion, confidence);
  };



  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const stopMediaTracks = (stream: MediaStream | null) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const handleLeaveMeeting = () => {
    addNotification({
      type: "info",
      title: "Leaving Meeting",
      message: "Thanks for joining! Meeting summary will be sent to your email.",
    })
    stopMediaTracks(localStream)
    setTimeout(() => {
      navigate("/dashboard")
    }, 1000)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    addNotification({
      type: isRecording ? "info" : "success",
      title: isRecording ? "Recording Stopped" : "Recording Started",
      message: isRecording ? "Meeting recording has been saved" : "Meeting is now being recorded with emotion data",
    })
  }

  const shareScreen = () => {
    addNotification({
      type: "info",
      title: "Screen Share",
      message: "Screen sharing feature will be available soon!",
    })
  }



  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])


  return (
    <>
      <Navbar />
      <div className="meeting-container bg-gradient-to-br from-background via-primary/5 to-blue-600/5 flex flex-col relative overflow-hidden my-16">
        <TailCursor />


        {/* Header */}
        <header className="glass backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between animate-slide-in-left">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center glow">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Meeting Room</h1>
                <p className="text-xs text-muted-foreground">ID: {id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="glass animate-scale-in">
                <Users className="w-3 h-3 mr-1" />
                {remoteStreams.length + 1} participants
              </Badge>
              <Badge variant="outline" className="glass animate-scale-in">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(meetingDuration)}
              </Badge>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <Record className="w-3 h-3 mr-1" />
                  Recording
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 animate-slide-in-right">
            <Button variant="ghost" size="sm" onClick={shareScreen} className="glass glow ripple">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="glass glow ripple">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="glass glow ripple">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Video Area */}
          <div className="flex-1 meeting-main">
            <div className="h-full p-6">
              <div className="h-full grid grid-cols-2 gap-6">
                {/* Local video with camera manager */}
                <div className="relative animate-fade-in">
                  {localStream && (
                    <VideoTile
                      key="local"
                      stream={localStream}
                      name="You"
                      isLocal
                      muted
                      emotion={getEmojiFromEmotion(localEmotion)}
                      emotionConfidence={localEmotionConfidence}
                      showEmoji={isEmojiOverlayOn}
                      showFaceSwap={isFaceSwapOn}
                      onLocalEmotionDetected={handleLocalEmotionDetected}
                      enableLocalEmotionDetection={isEmotionDetectionOn}
                    />
                  )}
                  {isFaceSwapOn && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <div className="text-6xl animate-pulse">🦸‍♂️</div>
                    </div>
                  )}
                </div>

                {/* Other participants */}
                {remoteStreams.map((remote) => (
                  <VideoTile
                    key={remote.peerId}
                    stream={remote.stream}
                    name={remote.peerId}
                    isLocal={false}
                    muted={false}
                    emotion="😃"
                    emotionConfidence={0.9}
                    showEmoji={isEmojiOverlayOn}
                    showFaceSwap={isFaceSwapOn}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <aside className="w-80 glass border-l flex flex-col meeting-sidebar animate-slide-in-right">
              <div className="p-4 border-b">
                <div className="flex space-x-1">
                  <Button
                    variant={activeTab === "emotions" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("emotions")}
                    className="flex-1 ripple"
                  >
                    <Smile className="w-4 h-4 mr-1" />
                    Emotions
                  </Button>
                  <Button
                    variant={activeTab === "chat" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("chat")}
                    className="flex-1 ripple"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === "emotions" ? <EmotionFeed participants={participants} /> : <ChatPanel />}
              </div>
            </aside>
          )}
        </div>

        {/* Control Bar */}
        <div className="glass backdrop-blur-sm border-t px-6 py-4 animate-slide-in-up">
          <div className="flex items-center justify-center space-x-6">
            {/* Primary Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant={isMuted ? "destructive" : "secondary"}

                onClick={() => {
                  toggleMic();
                  setIsMuted(!isMuted)
                  addNotification({
                    type: "info",
                    title: isMuted ? "Microphone On" : "Microphone Off",
                    message: isMuted ? "You are now unmuted" : "You are now muted",
                    duration: 2000,
                  })
                }}
                className="rounded-full w-14 h-14 glow2 ripple"
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                variant={isVideoOn ? "secondary" : "destructive"}

                onClick={() => {
                  toggleCam()
                  setIsVideoOn(!isVideoOn)
                  addNotification({
                    type: "info",
                    title: isVideoOn ? "Camera Off" : "Camera On",
                    message: isVideoOn ? "Your camera is now off" : "Your camera is now on",
                    duration: 2000,
                  })
                }}
                className="rounded-full w-14 h-14 glow2 ripple"
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              <Button variant="secondary" className="rounded-full w-14 h-14 glass glow2 ripple" onClick={shareScreen}>
                <Monitor className="w-6 h-6 " />

              </Button>
            </div>

            <Separator orientation="vertical" className="h-10" />

            {/* Feature Controls */}
            <div className="flex items-center space-x-3">
              <Button
                variant={isEmotionDetectionOn ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsEmotionDetectionOn(!isEmotionDetectionOn)
                  addNotification({
                    type: isEmotionDetectionOn ? "warning" : "success",
                    title: isEmotionDetectionOn ? "Emotion Detection Off" : "Emotion Detection On",
                    message: isEmotionDetectionOn ? "Emotion analysis disabled" : "AI emotion analysis activated",
                    duration: 3000,
                  })
                }}
                className="glass glow ripple"
              >
                <Smile className="w-4 h-4 mr-2" />
                Emotions
              </Button>

              <Button
                variant={isEmojiOverlayOn ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsEmojiOverlayOn(!isEmojiOverlayOn)
                  addNotification({
                    type: "info",
                    title: isEmojiOverlayOn ? "Emoji Overlay Off" : "Emoji Overlay On",
                    message: isEmojiOverlayOn ? "Emoji overlays hidden" : "Emoji overlays visible",
                    duration: 2000,
                  })
                }}
                className="glass glow ripple"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Overlay
              </Button>

              <Button
                variant={isFaceSwapOn ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsFaceSwapOn(!isFaceSwapOn)
                  addNotification({
                    type: isFaceSwapOn ? "info" : "success",
                    title: isFaceSwapOn ? "Face Swap Off" : "Face Swap On",
                    message: isFaceSwapOn ? "Face swap disabled" : "Superhero mode activated! 🦸‍♂️",
                    duration: 3000,
                  })
                }}
                className="glass glow ripple"
              >
                <Zap className="w-4 h-4 mr-2" />
                Face Swap
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
                className="glass glow ripple"
              >
                <Record className="w-4 h-4 mr-2" />
                {isRecording ? "Stop" : "Record"}
              </Button>
            </div>

            <Separator orientation="vertical" className="h-10" />

            {/* Leave Button */}
            <Button
              variant="destructive"

              onClick={handleLeaveMeeting}
              className="rounded-full w-14 h-14 glow2 ripple hover:scale-110 transition-transform"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function MeetingPage({ params }: { params: { id: string } }) {
  return (
    <NotificationProvider>
      <MeetingContent />
    </NotificationProvider>
  )
}

