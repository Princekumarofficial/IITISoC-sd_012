"use client"

import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { ScrollArea } from "../components/ui/Scroll-area"
import { Users, Mic, MicOff, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"

interface Participant {
  id: string
  name: string
  isSpeaking?: boolean
  isMuted?: boolean
  emotion?: string
  avatarUrl?: string
}

interface ParticipantsListProps {
  participants: Participant[]
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Participants
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 custom-scrollbar">
          <div className="p-4 space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={participant.avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {participant.name}
                    </span>
                    <span className="text-muted-foreground">
                      {participant.isSpeaking ? (
                        <Mic className="w-4 h-4 text-green-500" />
                      ) : participant.isMuted ? (
                        <MicOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}