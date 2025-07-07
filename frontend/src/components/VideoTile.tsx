import React, { useEffect, useRef } from "react";
import { useEmotionDetection } from "../hooks/useEmotionDetection";
import type { FaceLandmarks68 } from "@vladmandic/face-api";
import { getEmojiFromEmotion } from "../utils/getEmoji";

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
  // onLocalEmotionDetected?: (data: { emotion: string; confidence: number }) => void;
  onLocalEmotionDetected?: (data: { emotion: string; confidence: number, landmarks: FaceLandmarks68 }) => void;
  enableLocalEmotionDetection?: boolean;
  landmarks?: FaceLandmarks68 | null;
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
  onLocalEmotionDetected,
  enableLocalEmotionDetection = false,
  landmarks,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // ✅ Canvas ref
  const emojiRef = useRef<string>("😐");
  const landmarksRef = useRef<FaceLandmarks68 | null>(null);

  // Attach stream
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Hook: Only for local video
  useEmotionDetection(
    videoRef,
    isLocal && enableLocalEmotionDetection,
    (data) => {
      if (onLocalEmotionDetected) onLocalEmotionDetected(data);
      emojiRef.current = data.emotion;
      landmarksRef.current = data.landmarks;
    }
  );

  useEffect( ()=>{

    if(!isLocal)
    {
      if(emotion)
      emojiRef.current = emotion;
      if(landmarks)
      landmarksRef.current = landmarks;
    }

  },[emotion,landmarks])

  useEffect(() => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (video && canvas) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
}, [stream]);

  // ✅ Draw emoji overlay
  useEffect(() => {
    if ((isLocal && (!enableLocalEmotionDetection || !showEmoji))||(!isLocal && !showEmoji)) return;


    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const landmarks = landmarksRef.current;
      const emoji = getEmojiFromEmotion(emojiRef.current);

      if (landmarks && video.videoWidth && video.videoHeight) {
        const nose = landmarks.getNose()[3];
        const leftEye = landmarks.getLeftEye()[0];
        const rightEye = landmarks.getRightEye()[3];

        const dx = rightEye.x - leftEye.x;
        const dy = rightEye.y - leftEye.y;
        const angle = Math.atan2(dy, dx);
        const eyeDist = Math.hypot(dx, dy);

        const scaleX = canvas.width / video.videoWidth;
        const scaleY = canvas.height / video.videoHeight;
        const fontSize = eyeDist * scaleX * 2.5;

        ctx.save();
        ctx.translate(nose.x * scaleX, nose.y * scaleY);
        ctx.rotate(angle);
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
      }

      requestAnimationFrame(render);
    };

    render(); // Start the loop

  }, [isLocal, enableLocalEmotionDetection, showEmoji]);

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

      {((isLocal && enableLocalEmotionDetection && showEmoji )||(!isLocal && showEmoji)) && (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      )}

      {showFaceSwap && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
          <div className="text-6xl animate-pulse">🦸‍♂️</div>
        </div>
      )}

      {emotion && (!isLocal || enableLocalEmotionDetection) && (
        <div className="absolute top-2 right-2 text-3xl animate-bounce">{emotion}</div>
      )}
      <div className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 text-xs rounded">
        {name} {emotionConfidence ? `(${(emotionConfidence * 100).toFixed(0)}%)` : ""}
      </div>
    </div>
  );
};