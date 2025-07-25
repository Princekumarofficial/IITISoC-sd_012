"use client"

import { useState, useEffect, useRef, useMemo } from "react"
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
  Sun,
  Moon,
  MoreVertical,
  Maximize,
  Minimize,
  Share,
  RepeatIcon as Record,
  Sparkles,
  Zap,
  Clock,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import { VideoTile } from "../components/VideoTile"
import { EmotionFeed } from "../components/Emotion-feed"
import { ChatPanel } from "../components/Chat-panel"
import { TailCursor } from "../components/Tail-cursor"
import { useSFUClient } from "../hooks/useSFUClient";
import { NotificationProvider, useNotifications } from "../components/Notification-system"
import { getEmojiFromEmotion } from "../utils/getEmoji";
import { useParams } from "react-router-dom";
import type { FaceLandmarks68 } from "@vladmandic/face-api";
import { ParticipantsList } from "../components/Participants";
import { useMeetingChatStore } from "../store/useMeetingStore";


import type { LandmarkSection } from "../hooks/useSFUClient";
import { useMediaStore } from "../store/useMediaStore";
import { useAuthStore } from "../store/useAuthStore";
import RemoteStreamTiles from "../components/RemoteStreamTiles";
import useMaxTilesByScreen from "../hooks/useMaxTilesByScreen";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/Dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { signOut } from "firebase/auth";
import { auth } from "../service/firebase";


function MeetingContent() {
  //pull data from meetingstore
  const {
    meeting,
    participants,
    fetchMeetingById,
    subscribeToMeetingMessages,
    unsubscribeFromMeetingMessages,
    addleaveTime,
    addEmotion,
  } = useMeetingChatStore()

  console.log(participants);


  const { id } = useParams();
  const { isAudioEnabled, isVideoEnabled } = useMediaStore.getState()
  const [isMuted, setIsMuted] = useState(!isAudioEnabled)
  const [isVideoOn, setIsVideoOn] = useState(isVideoEnabled)
  const [isEmotionDetectionOn, setIsEmotionDetectionOn] = useState(true)
  const [isEmojiOverlayOn, setIsEmojiOverlayOn] = useState(true)
  const isEmojiOverlayOnRef = useRef(isEmojiOverlayOn);
  const [isFaceSwapOn, setIsFaceSwapOn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState("emotions")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [emotionList, setEmotionList] = useState<
    { id: string; name: string; emotion: string; confidence: number }[]
  >([]);
  const [userEmotions, setUserEmotions] = useState<{
    [userId: string]: { emotion: string; confidence: number, landmarks: LandmarkSection, isOverlayOn: boolean };
  }>({});
  const navigate = useNavigate();
  const { addNotification } = useNotifications()
  const { localStream, remoteStreams, toggleMic, toggleCam, sendEmotionUpdate, startScreenShare, stopScreenShare } = useSFUClient(id || "", (userId, emotion, confidence, landmarks, isOverlayOn) => {
    setUserEmotions((prev) => ({
      ...prev,
      [userId]: { emotion, confidence, landmarks, isOverlayOn },
    }));
    setEmotionList((prev) => {
      // Find the last entry for this user
      const lastEmotion = [...prev].reverse().find(e => e.id === userId);

      // Only add if emotion is different
      if (!lastEmotion || lastEmotion.emotion !== emotion) {
        return [
          ...prev,
          {
            id: userId,
            name: remoteStreams.find(p => p.peerId === userId)?.peerName || "Unknown",
            emotion,
            confidence,
          },
        ];
      }

      return prev; // No change if emotion is the same
    });
  });
  const [localEmotion, setLocalEmotion] = useState<string>("");
  const [localEmotionConfidence, setLocalEmotionConfidence] = useState<number>(0);
  const [localLandmarks, setlocalLandmarks] = useState<FaceLandmarks68 | LandmarkSection | undefined>();
  const [isScreenSharing, setIsScreenSharing] = useState<Boolean>(false);
  const [theme, setTheme] = useState("light");
  const { authUser, logout } = useAuthStore();

  const maxTiles = useMaxTilesByScreen();
  const participantsList = [
    {
      id: "local",
      name: "You",
    },
    ...remoteStreams.map((remote) => ({
      id: remote.peerId,
      name: remote.peerName,
    })),
  ];

  useEffect(() => {
    if (!localEmotion || localEmotionConfidence === null) return;

    setEmotionList((prev) => {
      // Find the last entry from the same user (you)
      const lastEmotion = [...prev].reverse().find(e => e.id === authUser._id);

      // Only add if emotion is different
      if (!lastEmotion || lastEmotion.emotion !== localEmotion) {
        return [
          ...prev,
          { id: authUser._id, name: "You", emotion: localEmotion, confidence: localEmotionConfidence },
        ];
      }

      return prev; // No change if emotion is the same
    });
  }, [localEmotion, localEmotionConfidence]);


  useEffect(() => {
    const { stream } = useMediaStore.getState();
    if (!stream) {
      console.warn("Stream is null, skipping join.");
      stopMediaTracks(localStream);
      navigate("/dashboard");
    }
  }, []);

  // Meeting timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    isEmojiOverlayOnRef.current = isEmojiOverlayOn;
  }, [isEmojiOverlayOn]);


  const handleLocalEmotionDetected = ({
    emotion,
    confidence,
    landmarks
  }: {
    emotion: string;
    confidence: number;
    landmarks: FaceLandmarks68;
  }) => {
    console.log("Local emotion:", emotion, confidence.toFixed(2));
    setLocalEmotion(emotion);
    setLocalEmotionConfidence(confidence);
    setlocalLandmarks(landmarks);
    sendEmotionUpdate(id || null, emotion, confidence, landmarks, isEmojiOverlayOnRef.current);

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

  const handleLeaveMeeting = async () => {
    const stream = useMediaStore.getState().stream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      useMediaStore.getState().setStream(null); // Clear from store
    }
    addNotification({
      type: "info",
      title: "Leaving Meeting",
      message: "Thanks for joining! Meeting summary will be sent to your email.",
    })
    stopMediaTracks(localStream)

    try {
      await addleaveTime(meeting.meetingId);

    } catch (error) {
      console.error(error);

    }

    setTimeout(() => {
      navigate("/dashboard")
    }, 1000)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      addNotification({
        type: "info",
        title: "Signing Out",
        message: "See you next time!",
      });
      await logout();

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Sign out error:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to sign out. Please try again.",
      });
    }

  };
  // Handling setting stream to null on reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const stream = useMediaStore.getState().stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        useMediaStore.getState().setStream(null); // Clear from store
      }
      stopMediaTracks(localStream);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);


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



  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);



  return (
    <>
      <div className="meeting-container bg-gradient-to-br from-background via-primary/5 to-blue-600/5 flex flex-col relative overflow-hidden  h-full">
        {/* <Navbar /> */}
        <TailCursor />


        {/* Header */}
        <header className="glass  z-[50] backdrop-blur-sm border-b h-[10vh] px-4 py-3 flex  md:flex-nowrap items-center justify-between gap-4 md:gap-0 animate-slide-in-left">
          {/* Left side: Logo + Title + Info */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center glow">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-base sm:text-lg truncate">
                  {meeting?.title || "Meeting Room"}
                </h1>
                <p className="text-xs text-muted-foreground truncate ">ID: {id}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:space-x-4">
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

          {/* Right side: Buttons */}
          <div className="flex header-buttons   items-center gap-2 animate-slide-in-right">
            <div className="header-buttons-0 flex  gap-2" > <DropdownMenu  >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className=" glass   glow ripple">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authUser?.photoURL || "/profile.jpg"} />
                    <AvatarFallback>
                      {authUser?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background  border absolute z-[100] border-border rounded-md shadow-md  w-56 ">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authUser?.photoURL || "/profile.jpg"} />
                    <AvatarFallback>
                      {authUser?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{authUser?.username}</p>
                    <p className="text-xs text-muted-foreground">{authUser?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profilepage")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="glass glow ripple"
              >
                <Sun className={`h-4 w-4 transition-all ${theme === "dark" ? "scale-0" : "scale-100"}`} />
                <Moon className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "scale-100" : "scale-0"}`} />
              </Button>
            </div>
            <div className="header-buttons-1">
              {isScreenSharing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsScreenSharing((prev) => !prev);
                    stopScreenShare();
                  }}
                  className="glass glow ripple"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsScreenSharing((prev) => !prev);
                    startScreenShare();
                  }}
                  className="glass glow ripple"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
            <div className="flex gap-2 header-buttons-2 ">
              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="glass glow ripple">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="glass glow ripple">
                <MoreVertical className="w-4 h-4" />
              </Button>

            </div>
          </div>
        </header>


        <div className="flex flex-1 main-container  h-[75vh]">
          {/* Main Video Area */}
          <div className="flex-1 meeting-main">
            {/* 🛠️ Modified: Responsive dynamic grid */}
            <div className="h-full w-full p-4 overflow-auto">
              <div className="grid gap-4 w-full h-full"
                style={{
                  gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
                  gridAutoRows: "minmax(200px, 1fr)" // Ensures consistent row height
                }}
              >      {/* Local video with camera manager */}

                {localStream && (
                  <VideoTile
                    key="local"
                    stream={localStream}
                    name="You"
                    isLocal
                    muted={isMuted}
                    emotion={getEmojiFromEmotion(localEmotion)}
                    emotionConfidence={localEmotionConfidence}
                    showEmoji={isEmojiOverlayOnRef.current}
                    showFaceSwap={isFaceSwapOn}
                    onLocalEmotionDetected={handleLocalEmotionDetected}
                    enableLocalEmotionDetection={isEmotionDetectionOn}
                    landmarks={localLandmarks}
                  />
                )}

                {/* Other participants */}

                {remoteStreams.map((remote, index) => {
                  if (index + 1 > maxTiles - 1) return null; // +1 for local tile
                  return (
                    <RemoteStreamTiles
                      key={remote.peerId}
                      remote={remote}
                      emotionData={userEmotions[remote.peerId]}
                      isFaceSwapOn={isFaceSwapOn}
                    />)
                }
                )}

                {isFaceSwapOn && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <div className="text-6xl animate-pulse">🦸‍♂️</div>
                  </div>
                )}


              </div>
            </div>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <aside className="w-80 glass border-l flex flex-col meeting-sidebar animate-slide-out animate-slide-in-right">
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
                  <Button
                    variant={activeTab === "participants" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("participants")}
                    className="flex-1 ripple"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Participants
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => (setShowSidebar(!showSidebar))} className="">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">

                {activeTab === "emotions" && <EmotionFeed participants={emotionList} participantList={participants} />}
                {activeTab === "chat" && <ChatPanel />}
                {activeTab === "participants" && <ParticipantsList participants={participantsList} />}
              </div>
            </aside>
          )}
        </div>

        {/* Control Bar */}
        <div className="glass  backdrop-blur-sm border-t px-6  animate-slide-in-up ">
          <div className="flex control-bar items-center justify-center gap-8">
            {/* Primary Controls */}
            <div className="controlbar-firstdiv flex items-center space-x-4">
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
                className="controlbar-firstdiv-button rounded-full w-14 h-14 glow2 ripple"
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
                className="controlbar-firstdiv-button rounded-full w-14 h-14 glow2 ripple"
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              <Button variant="secondary" className="controlbar-firstdiv-button rounded-full w-14 h-14 glass glow2 ripple" onClick={shareScreen}>
                <Monitor className="w-6 h-6 " />

              </Button>
            </div>

            <Separator orientation="vertical" className="h-10" />

            {/* Feature Controls */}
            <div className="flex controlbar-middle-div items-center  ">
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
                className="controlbar-middlediv-button glass glow ripple"
              >
                <Smile className="w-4 h-4 mr-2" />
                <p>Emotions</p>
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
                className="controlbar-middlediv-button glass glow ripple"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <p>Overlay</p>
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
                className="controlbar-middlediv-button glass glow ripple"
              >
                <Zap className="w-4 h-4 mr-2" />
                <p>Face Swap</p>
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
                className="controlbar-middlediv-button glass glow ripple"
              >
                <Record className=" w-4 h-4 mr-2" />
                <p>{isRecording ? "Stop" : "Record"}</p>
              </Button>
            </div>

            <Separator orientation="vertical" className="h-10" />

            {/* Leave Button */}
            <Button
              variant="destructive"

              onClick={handleLeaveMeeting}
              className="rounded-full end-call w-14 h-14 glow2 ripple hover:scale-110 transition-transform"
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

