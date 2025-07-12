"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { TailCursor } from "../components/Tail-cursor"
import { NotificationProvider, useNotifications } from "../components/Notification-system"
import { CameraManager } from "../components/Camera-manager"
import { Mic, MicOff, Video, VideoOff, Users } from "lucide-react"
import { CopyableText } from "../components/ui/CopyableText"


function PreJoinContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meetingCodeInput, setMeetingCodeInput] = useState("")
  

  const localStreamRef = useRef<MediaStream | null>(null)
  const { addNotification } = useNotifications()

  const handleStreamReady = (stream: MediaStream) => {
    // setLocalStream(stream)
    localStreamRef.current = stream

    
    addNotification({
      type: "success",
      title: "Camera Connected",
      message: "Your camera is now active in the meeting",
    })
  }

const handleJoinMeeting = async () => {
  const finalRoomId = id && id !== "null" ? id : meetingCodeInput.trim();
  if (!localStreamRef.current) {
    addNotification({
      type: "error",
      title: "Camera and Mic Not Active",
      message: "Please start your camera and microphone before joining the meeting.",
    });
    return;
  }

  if (!finalRoomId) {
    addNotification({
      type: "error",
      title: "Missing Meeting Code",
      message: "Please enter a meeting ID to join",
    });
    return;
  }

  navigate(`/meeting/${finalRoomId}`);
};

  return (
    <>
      <Navbar />
      <div className="meeting-container bg-gradient-to-br from-background via-primary/5 to-blue-600/5 flex flex-col relative overflow-hidden my-16">
        <TailCursor />
        <div className="flex flex-1 overflow-hidden justify-center items-center">
          <div className="h-[50vh] w-[70vw]">
            <div className="relative animate-fade-in">
              <CameraManager onStreamReady={handleStreamReady} className="h-full" />
            </div>
          </div>
        </div>
            <div className="glass backdrop-blur-sm border-t px-6 py-4 animate-slide-in-up">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-4">
                  {id==null &&<Input
                    placeholder="Enter the meeting id"
                    value={meetingCodeInput}
                    onChange={(e) => setMeetingCodeInput(e.target.value)}
                  />}

                  <Button
                    onClick={handleJoinMeeting}
                    variant="outline"
                    size="sm"
                    className="w-full glass glow ripple"
                 
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                  {id && <CopyableText value={id} />}
                </div>
              </div>
            </div>
      </div>
    </>
  )
}

export default function PreJoinPage() {
  return (
    <NotificationProvider>
      <PreJoinContent />
    </NotificationProvider>
  )
}