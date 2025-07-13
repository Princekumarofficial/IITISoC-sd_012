"use client"

import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ScrollArea } from "../components/ui/Scroll-area";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { Send } from "lucide-react";
import { useMeetingChatStore } from "../store/useMeetingStore";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function ChatPanel() {
  const { id: meetingId } = useParams<{ id: string }>();
  const { user } = useAuthStore(); // logged-in user ka data

  const {
    messages,
    fetchMeetingById,
    sendMeetingMessage,
    subscribeToMeetingMessages,
    unsubscribeFromMeetingMessages,
    isSendingMessage,
  } = useMeetingChatStore();

  const [newMessage, setNewMessage] = useState("");

  // Fetch messages & subscribe on mount
  useEffect(() => {
    if (meetingId) {
      fetchMeetingById(meetingId);
      subscribeToMeetingMessages(meetingId);
    }
    return () => {
      unsubscribeFromMeetingMessages();
    };
  }, [meetingId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && meetingId) {
      await sendMeetingMessage(meetingId, newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isLocal = msg.sender === user?.name;
            return (
              <div
                key={msg._id}
                className={`flex space-x-3 ${isLocal ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {msg.sender
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${isLocal ? "text-right" : ""}`}>
                  <div className="flex items-center space-x-2 mb-1 justify-end">
                    <span className="text-xs font-medium">{msg.sender || "You"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      isLocal ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="p-4 border-t ">
        <div className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSendingMessage}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
        </div>
      </ScrollArea>

      {/* Message Input */}
     
    </div>
  );
}
