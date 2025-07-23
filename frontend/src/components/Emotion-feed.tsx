"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { ScrollArea } from "../components/ui/Scroll-area"
import { Progress } from "../components/ui/progress"
import { TrendingUp, Zap, Heart } from "lucide-react"
import { getEmojiFromEmotion } from "../utils/getEmoji"
interface Participant {
  id: string
  name: string
  emotion: string
  confidence: number
}

interface EmotionFeedProps {
  participants: Participant[]
}

// const emojiReactions = ["😊", "😄", "👍", "👏", "❤️", "🎉", "💡", "🤔", "😮", "🔥"]

export function EmotionFeed({ participants }: EmotionFeedProps) {
  const [recentEmotions, setRecentEmotions] = useState<
    {
      time: string
      participant: string
      emotion: string
      type: string
      confidence: number
    }[]
  >([])

  const [overallMood, setOverallMood] = useState(78)

  // ⏱ Utility to get current HH:MM time
  const getTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // 🔁 Append new incoming emotions to recentEmotions
  useEffect(() => {
    setRecentEmotions((prev) => [
      ...prev,
      ...participants.map((p) => ({
        time: getTime(),
        participant: p.name,
        emotion: p.emotion,
        type: p.emotion, // or map emoji to readable type
        confidence: Math.round(p.confidence * 100),
      })),
    ])
  }, [participants])
  

  // ✅ Derive most recent emotion per participant
  const latestByParticipant: Record<string, Participant> = {}
  for (const p of participants) {
    latestByParticipant[p.id] = p
  }
  const currentParticipants = Object.values(latestByParticipant)

  return (
    <div className="p-4 space-y-4">
      {/* Overall Mood */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Meeting Mood
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{overallMood}%</span>
            <Badge variant={overallMood > 70 ? "default" : overallMood > 40 ? "secondary" : "destructive"}>
              {overallMood > 70 ? "Positive" : overallMood > 40 ? "Neutral" : "Needs Attention"}
            </Badge>
          </div>
          <Progress value={overallMood} className="h-2" />
        </CardContent>
      </Card>

      {/* Live Emotion Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Live Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-64 custom-scrollbar">
            <div className="p-4 space-y-3">
              {recentEmotions.map((emotion, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="text-xl">{getEmojiFromEmotion(emotion.emotion)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{emotion.participant}</span>
                      <span className="text-xs text-muted-foreground">{emotion.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{emotion.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {emotion.confidence}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

        </CardContent>
      </Card>

      {/* Current Participants */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            Current Emotions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentParticipants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getEmojiFromEmotion(participant.emotion)}</span>
                <span className="text-sm font-medium">{participant.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.round(participant.confidence * 100)}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}