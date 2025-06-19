"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"
import { Mic, MicOff, VideoOff, Wifi, WifiOff } from "lucide-react"

interface Participant {
  id: string
  name: string
  isLocal: boolean
  isMuted: boolean
  isVideoOn: boolean
  emotion: string
  emotionConfidence: number
  stream?: MediaStream | null
}

interface VideoTileProps {
  participant: Participant
  showEmoji: boolean
  showFaceSwap: boolean
  className?: string
  style?: React.CSSProperties
}

export function VideoTile({ participant, showEmoji, showFaceSwap, className, style }: VideoTileProps) {
  const [currentEmoji, setCurrentEmoji] = useState(participant.emotion)
  const [connectionQuality, setConnectionQuality] = useState<"good" | "fair" | "poor">("good")
  const [isHovered, setIsHovered] = useState(false)

  // Mock emotion changes
  useEffect(() => {
    const emotions = ["😊", "😄", "🤔", "😮", "👍", "👏", "💡", "🎉", "❤️", "🔥", "✨", "🚀"]
    const interval = setInterval(() => {
      if (showEmoji && Math.random() > 0.6) {
        setCurrentEmoji(emotions[Math.floor(Math.random() * emotions.length)])
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [showEmoji])

  // Mock connection quality changes
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities: Array<"good" | "fair" | "poor"> = ["good", "good", "good", "fair", "poor"]
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case "good":
        return <Wifi className="w-4 h-4 text-green-500" />
      case "fair":
        return <Wifi className="w-4 h-4 text-yellow-500" />
      case "poor":
        return <WifiOff className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <Card
      className={`relative h-full overflow-hidden glass glow hover:scale-105 transition-all duration-300 cursor-pointer ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {participant.isVideoOn ? (
        <div className="relative h-full bg-gradient-to-br from-primary/10 via-blue-600/10 to-purple-600/10 flex items-center justify-center">
          {/* Mock video background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

          {/* Animated particles for video effect */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Face swap overlay */}
          {showFaceSwap && participant.isLocal && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center rounded-lg">
              <div className="text-8xl animate-bounce">🦸‍♂️</div>
            </div>
          )}

          {/* Emoji overlay with enhanced animations */}
          {showEmoji && (
            <div className="absolute top-4 right-4 text-5xl animate-bounce hover:scale-125 transition-transform cursor-pointer">
              {currentEmoji}
            </div>
          )}

          {/* Confidence indicator */}
          {showEmoji && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="glass text-xs animate-pulse">
                AI: {Math.round(participant.emotionConfidence * 100)}%
              </Badge>
            </div>
          )}

          {/* Connection quality indicator */}
          <div className="absolute top-4 right-16">
            <Badge variant="outline" className="glass">
              {getConnectionIcon()}
            </Badge>
          </div>

          {/* Mock person representation with enhanced styling */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-blue-600/30 flex items-center justify-center glow">
              <Avatar className="w-32 h-32 border-4 border-white/20">
                <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-blue-600 text-white">
                  {participant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Pulse ring effect */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-ping" />
          </div>

          {/* Speaking indicator */}
          {!participant.isMuted && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-8 bg-green-500 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      height: `${Math.random() * 20 + 10}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full glass flex items-center justify-center">
          <div className="text-center space-y-6">
            <Avatar className="w-24 h-24 mx-auto glow">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-blue-600 text-white">
                {participant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-center space-x-2">
              <VideoOff className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Camera off</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced participant info with hover effects */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-all duration-300 ${isHovered ? "from-black/90" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-white font-semibold text-lg drop-shadow-lg">{participant.name}</span>
            {participant.isLocal && (
              <Badge variant="secondary" className="text-xs glass">
                You
              </Badge>
            )}
            {showEmoji && (
              <Badge variant="outline" className="text-xs glass">
                {currentEmoji}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {participant.isMuted ? (
              <div className="p-1 rounded-full bg-red-500/20">
                <MicOff className="w-4 h-4 text-red-400" />
              </div>
            ) : (
              <div className="p-1 rounded-full bg-green-500/20">
                <Mic className="w-4 h-4 text-green-400" />
              </div>
            )}
            {getConnectionIcon()}
          </div>
        </div>

        {/* Additional info on hover */}
        {isHovered && (
          <div className="mt-2 text-xs text-white/80 slide-in-up">
            <div className="flex justify-between">
              <span>Quality: {connectionQuality}</span>
              <span>Confidence: {Math.round(participant.emotionConfidence * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none transition-opacity duration-300" />
      )}
    </Card>
  )
}
