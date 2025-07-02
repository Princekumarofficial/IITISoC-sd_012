// components/VideoTile.tsx
import React, { useEffect, useRef } from "react";

export interface VideoTileProps {
  stream: MediaStream;
  name: string;
  isLocal?: boolean;
  muted?: boolean;
  emotion?: string;
  emotionConfidence?: number;
  showEmoji?: boolean;
  showFaceSwap?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const VideoTile: React.FC<VideoTileProps> = ({
  stream,
  name,
  isLocal = false,
  muted = false,
  emotion,
  emotionConfidence,
  showEmoji = true,
  showFaceSwap = false,
  className = "",
  style = {},
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-black w-full aspect-video ${className}`}
      style={style}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal || muted}
        className="w-full h-full object-cover"
      />
      {showFaceSwap && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
          <div className="text-6xl animate-pulse">🦸‍♂️</div>
        </div>
      )}
      {showEmoji && emotion && (
        <div className="absolute top-2 right-2 text-3xl animate-bounce">{emotion}</div>
      )}
      <div className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 text-xs rounded">
        {name} {emotionConfidence ? `(${(emotionConfidence * 100).toFixed(0)}%)` : ""}
      </div>
    </div>
  );
};