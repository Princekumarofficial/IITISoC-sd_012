"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { TailCursor } from "../components/Tail-cursor";
import { NotificationProvider, useNotifications } from "../components/Notification-system";
import { CameraManager } from "../components/Camera-manager";
import { Users } from "lucide-react";
import { useMeetingChatStore } from "../store/useMeetingStore";

function PreJoinContent() {
  const { id } = useParams();              // if new meeting created, id param will be there
  const navigate = useNavigate();
   const [roomId, setRoomId] = useState("")
   const [userId, setUserId] = useState("user-" + Math.random().toString(36).substr(2, 8))

  const { addNotification } = useNotifications();

  const { createMeeting, addParticipant } = useMeetingChatStore();

  const [meetingTitle, setMeetingTitle] = useState("");      // for new meeting
  const [meetingType, setMeetingType] = useState("group");   // default type
  const [meetingCodeInput, setMeetingCodeInput] = useState(""); // for joining meeting
  
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
   const localVideoRef = useRef<HTMLVideoElement | null>(null)

  const handleStreamReady = (stream: MediaStream) => {
    setLocalStream(stream);
    localStreamRef.current = stream;
    addNotification({
      type: "success",
      title: "Camera Connected",
      message: "Your camera is now active in the meeting",
    });
  };

  const handleJoinMeeting = async () => {
    if (id && id !== "null") {
      // ✅ We have id → it's a new meeting we just created → ask title & type, call createMeeting
      if (!meetingTitle.trim()) {
        addNotification({
          type: "error",
          title: "Missing title",
          message: "Please enter a meeting title",
        });
        return;
      }

      try {
        await createMeeting({ title: meetingTitle, type: meetingType  , meetingId : id}); 
        addNotification({
          type: "success",
          title: "Meeting created",
          message: `New meeting '${meetingTitle}' created!`,
        });
        navigate(`/meeting/${id}`);
      } catch (error) {
        console.log(error , "error from create meeting in prejoin");
        addNotification({
          type: "error",
          title: "Failed to create meeting",
          message: "Please try again later",
        });
      }

    } else {
      // ✅ We don't have id → user is joining existing meeting → ask for code and addParticipant
      if (!meetingCodeInput.trim()) {
        addNotification({
          type: "error",
          title: "Missing meeting ID",
          message: "Please enter a meeting ID to join",
        });
        return;
      }

      try {
        await addParticipant(meetingCodeInput.trim());
        addNotification({
          type: "success",
          title: "Joined meeting",
          message: `You have joined meeting ${meetingCodeInput.trim()}`,
        });
        navigate(`/meeting/${meetingCodeInput.trim()}`);
      } catch (error) {
        console.error(error);
        addNotification({
          type: "error",
          title: "Failed to join meeting",
          message: "Please check the meeting ID and try again",
        });
      }
    }
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
              {id && (
                <>
                  <Input
                    placeholder="Enter the title of the meeting"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="glass glow ripple"
                  />
                  <select
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="border rounded-md px-2 py-2 bg-background text-foreground glass glow ripple"
                >
                  <option value="group">Group</option>
                  <option value="1v1">1v1</option>
                </select>
                </>
              )}
              {!id && (
                <Input
                  placeholder="Enter the meeting ID"
                  value={meetingCodeInput}
                  onChange={(e) => setMeetingCodeInput(e.target.value)}
                />
              )}
              <Button
                onClick={handleJoinMeeting}
                variant="outline"
                size="sm"
                className="w-full glass glow ripple"
              >
                <Users className="w-4 h-4 mr-2" />
                {id ? "Create Meeting" : "Join Meeting"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PreJoinPage() {
  return (
    <NotificationProvider>
      <PreJoinContent />
    </NotificationProvider>
  );
}
