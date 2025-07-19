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
import { CopyableText } from "../components/ui/CopyableText";
import { useMediaStore } from "../store/useMediaStore";

function PreJoinContent() {
  const { id } = useParams(); // if new meeting created, id param will be there
  const navigate = useNavigate();
  const [userId, setUserId] = useState("user-" + Math.random().toString(36).substr(2, 8));

  const { addNotification } = useNotifications();
  const { createMeeting, addParticipant } = useMeetingChatStore();

  const [meetingTitle, setMeetingTitle] = useState(""); // for new meeting
  const [meetingType, setMeetingType] = useState("group"); // default type
  const [meetingCodeInput, setMeetingCodeInput] = useState(""); // for joining meeting

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

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
      // ✅ New meeting
      if (!meetingTitle.trim()) {
        addNotification({
          type: "error",
          title: "Missing title",
          message: "Please enter a meeting title",
        });
        return;
      }
      const { stream } = useMediaStore.getState();
      if(!stream)
      {
         addNotification({
          type: "error",
          title: "Camera and mic not joined",
          message: "Please join camera and microphone before joining the meet",
        });
        return;
        
      }

      try {
        await createMeeting({ title: meetingTitle, type: meetingType, meetingId: id });
        addNotification({
          type: "success",
          title: "Meeting created",
          message: `New meeting '${meetingTitle}' created!`,
        });
        navigate(`/meeting/${id}`);
      } catch (error) {
        console.log(error, "error from create meeting in prejoin");
        addNotification({
          type: "error",
          title: "Failed to create meeting",
          message: "Please try again later",
        });
      }
    } else {
      // ✅ Joining existing meeting
      if (!meetingCodeInput.trim()) {
        addNotification({
          type: "error",
          title: "Missing meeting ID",
          message: "Please enter a meeting ID to join",
        });
        return;
      }
        const { stream } = useMediaStore.getState();
      if(!stream)
      {
         addNotification({
          type: "error",
          title: "Camera and mic not joined",
          message: "Please join camera and microphone before joining the meet",
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
      <div className="meeting-container bg-gradient-to-br from-background via-primary/5 to-blue-600/5 flex flex-col relative overflow-hidden">
        <TailCursor />
        <div className="flex prejoin-main justify-center items-center my-16">
          <div className=" w-full max-w-[800px] min-w-[300px] aspect-video rounded-lg overflow-hidden">
            
              <CameraManager onStreamReady={handleStreamReady} className=" w-full h-full object-cover" />
            
          </div>
        </div>

        <div className="glass backdrop-blur-sm  border-t px-4 py-6 animate-slide-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-center gap-4">
            <div className="flex prejoin-inputs items-center space-x-4">
              {id ? (
                <>
                  <Input
                    placeholder="Enter the title of the meeting"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="glass glow ripple ml-[16px] w-full md:max-w-xs"
                  />
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                    className="border rounded-md px-2 py-2 bg-background text-foreground glass glow ripple w-full md:w-[150px]"
                  >
                    <option value="group">Group</option>
                    <option value="1v1">1v1</option>
                  </select>
                </>
              ) : (
                <Input
                  placeholder="Enter the meeting ID"
                  value={meetingCodeInput}
                  onChange={(e) => setMeetingCodeInput(e.target.value)}
                  className="w-full md:max-w-sm"
                />
              )}
              <Button
                onClick={handleJoinMeeting}
                variant="outline"
                size="sm"
                className="w-full md:w-auto glass glow ripple"
              >
                <Users className="w-4 h-4 mr-2" />
                {id ? "Create Meeting" : "Join Meeting"}
              </Button>
              {id && <CopyableText value={id} />}
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
