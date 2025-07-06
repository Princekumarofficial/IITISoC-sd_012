import { useEffect, useRef } from "react";
import * as faceapi from "@vladmandic/face-api";
import { loadFaceApiModels } from "../utils/faceapi-loader"

interface EmotionData {
    emotion: string;
    confidence: number;
}

export function useEmotionDetection(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    enabled: boolean,
    onEmotionDetected: (data: EmotionData) => void
) {

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        const startDetection = async () => {
            try {
                await loadFaceApiModels();

                if (!enabled || !videoRef.current) {
                    console.warn("🚫 Not starting detection: Disabled or videoRef missing.");
                    return;
                }


                intervalRef.current = window.setInterval(async () => {
                    const video = videoRef.current;

                    if (!video || video.readyState !== 4) {
                        console.log("Video not ready:", video?.readyState);
                        return;
                    }

                    try {
                        const detections = await faceapi
                            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                            .withFaceLandmarks()
                            .withFaceExpressions();

                        if (detections.length > 0) {
                            const expressions = detections[0].expressions;
                            const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
                            const [emotion, confidence] = sorted[0];
                            onEmotionDetected({ emotion, confidence });
                        }
                    } catch (err) {
                        console.error("Emotion detection error:", err);
                    }
                }, 2000);
            } catch (e) {
                console.error("Model loading failed, detection skipped.");
            }
        };

        if (enabled && videoRef.current) {
            startDetection();
        }

        return () => {
            cancelled = true;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled, videoRef, onEmotionDetected]);
}