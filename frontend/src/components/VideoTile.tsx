import React, { useEffect, useRef, useState } from "react";
import { useEmotionDetection } from "../hooks/useEmotionDetection";
import { FaceLandmarks68 } from "@vladmandic/face-api";
import { getEmojiFromEmotion, getEmotionFromEmoji } from "../utils/getEmoji";
import { LandmarkSection } from "../hooks/useSFUClient";
import { useMeetingChatStore } from "../store/useMeetingStore";
export interface VideoTileProps {
  stream: MediaStream | null;
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
  landmarks?: FaceLandmarks68 | LandmarkSection;
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
  const landmarksRef = useRef<FaceLandmarks68 | LandmarkSection | null>(null);
  const prevEmojiRef = useRef<string>(""); // Track previous emoji



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
       const newEmoji = data.emotion;
      emojiRef.current = data.emotion;
      landmarksRef.current = data.landmarks;

      if (newEmoji !== prevEmojiRef.current) {
      prevEmojiRef.current = newEmoji;

      const meetingId = useMeetingChatStore.getState().meeting?.meetingId;
      if (meetingId) {
        useMeetingChatStore.getState().addEmotion(meetingId, newEmoji);
      } else {
        console.warn("⚠️ meetingId not found in store");
      }
    }
    }
  );

  useEffect(() => {
    if (!isLocal) {
      if (showEmoji) {
        if (emotion) {
          emojiRef.current = getEmotionFromEmoji(emotion);
        }

        if (landmarks) {
          landmarksRef.current = landmarks;
        }
      } else {
        // ✅ When overlay is off, clear everything
        landmarksRef.current = null;
        emojiRef.current = "";
      }
    }
  }, [emotion, landmarks, showEmoji]);





  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const handleLoadedMetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    // If video is already loaded, set immediately
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // ✅ Draw emoji overlay
  useEffect(() => {
    if ((isLocal && (!enableLocalEmotionDetection || !showEmoji)) || (!isLocal && !showEmoji)) return;


    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;



    const render = () => {

      // if(!isLocal)
      // console.log(showEmoji);
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const landmarks = landmarksRef.current;
      const emoji = getEmojiFromEmotion(emojiRef.current);


      if (landmarks) {
        let nose, leftEye, rightEye;

        if (
          typeof (landmarks as FaceLandmarks68).getNose === "function" &&
          typeof (landmarks as FaceLandmarks68).getLeftEye === "function" &&
          typeof (landmarks as FaceLandmarks68).getRightEye === "function"
        ) {
          // ✅ Local - FaceLandmarks68
          const nosePoints = (landmarks as FaceLandmarks68).getNose();
          const leftEyePoints = (landmarks as FaceLandmarks68).getLeftEye();
          const rightEyePoints = (landmarks as FaceLandmarks68).getRightEye();

          if (
            nosePoints.length > 3 &&
            leftEyePoints.length > 0 &&
            rightEyePoints.length > 3
          ) {
            nose = nosePoints[3];
            leftEye = leftEyePoints[0];
            rightEye = rightEyePoints[3];
          }
        } else if (
          "nose" in landmarks &&
          "leftEye" in landmarks &&
          "rightEye" in landmarks
        ) {
          // ✅ Remote - LandmarkSection
          const remote = landmarks as LandmarkSection;
          nose = remote.nose;
          leftEye = remote.leftEye;
          rightEye = remote.rightEye;

        }

        // ✅ If all key points are valid
        if (
          nose && leftEye && rightEye &&
          typeof nose.x === "number" && typeof nose.y === "number" &&
          typeof leftEye.x === "number" && typeof leftEye.y === "number" &&
          typeof rightEye.x === "number" && typeof rightEye.y === "number"
        ) {
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
        } else {
          console.warn("🚨 Invalid landmark points — one or more values are NaN or undefined", {
            nose,
            leftEye,
            rightEye
          });
        }

      }

      requestAnimationFrame(render);
    };

    render(); // Start the loop

  }, [isLocal, enableLocalEmotionDetection, showEmoji]);

  return (
     <div className="flex justify-center items-center">
       <div className="relative w-fit h-full  overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal || muted}
          className=" h-full object-cover rounded-lg shadow"
        />
       
 

      {((isLocal && enableLocalEmotionDetection && showEmoji) || (!isLocal && showEmoji)) && (!!(videoRef.current?.srcObject as MediaStream)?.getVideoTracks()[0]?.enabled) && (
        <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          transform: 'translateZ(0)' // Optional: helps with rendering in some cases
        }}
      />

      )}

      {showFaceSwap && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
          <div className="text-6xl animate-pulse">🦸‍♂️</div>
        </div>
      )}

      {emotion && (!isLocal || enableLocalEmotionDetection) && (!!(videoRef.current?.srcObject as MediaStream)?.getVideoTracks()[0]?.enabled) && (
        <div className="absolute top-2 right-2 text-3xl animate-bounce">{emotion}</div>
      )}

      <div className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 text-xs rounded">
        {name} {emotionConfidence ? `(${(emotionConfidence * 100).toFixed(0)}%)` : ""}
      </div>
      </div>
    </div>
  )
};