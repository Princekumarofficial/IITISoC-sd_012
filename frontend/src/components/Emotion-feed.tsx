"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { ScrollArea } from "../components/ui/Scroll-area"
import { Button } from "../components/ui/Button"
import { Progress } from "../components/ui/progress"
import { TrendingUp, Smile, Heart, Zap } from "lucide-react"

interface Participant {
  id: string
  name: string
  emotion: string
  emotionConfidence: number
}

interface EmotionFeedProps {
  participants: Participant[]
}

// Mock emotion history
const emotionHistory = [
  { time: "14:32", participant: "Alice", emotion: "😊", type: "Joy", confidence: 85 },
  { time: "14:31", participant: "Bob", emotion: "👍", type: "Approval", confidence: 91 },
  { time: "14:30", participant: "You", emotion: "🤔", type: "Thinking", confidence: 72 },
  { time: "14:29", participant: "Charlie", emotion: "😄", type: "Excitement", confidence: 88 },
  { time: "14:28", participant: "Alice", emotion: "💡", type: "Insight", confidence: 79 },
]

const emojiReactions = ["😊", "😄", "👍", "👏", "❤️", "🎉", "💡", "🤔", "😮", "🔥"]

export function EmotionFeed({ participants }: EmotionFeedProps) {
  const [recentEmotions, setRecentEmotions] = useState(emotionHistory)
  const [overallMood, setOverallMood] = useState(78)

  // Mock real-time emotion updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const participant = participants[Math.floor(Math.random() * participants.length)]
        const emotions = ["😊", "😄", "👍", "👏", "💡", "🤔", "😮"]
        const types = ["Joy", "Excitement", "Approval", "Applause", "Insight", "Thinking", "Surprise"]
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
        const randomType = types[Math.floor(Math.random() * types.length)]

        const newEmotion = {
          time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
          participant: participant.name,
          emotion: randomEmotion,
          type: randomType,
          confidence: Math.floor(Math.random() * 30) + 70,
        }

        setRecentEmotions((prev) => [newEmotion, ...prev.slice(0, 9)])
        setOverallMood((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)))
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [participants])

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

      {/* Quick Reactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Smile className="w-4 h-4 mr-2" />
            Quick Reactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {emojiReactions.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-10 text-lg hover:scale-110 transition-transform"
              >
                {emoji}
              </Button>
            ))}
          </div>
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
                  <div className="text-xl">{emotion.emotion}</div>
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
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{participant.emotion}</span>
                <span className="text-sm font-medium">{participant.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.round(participant.emotionConfidence * 100)}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
