import { useEffect, useRef } from "react";
import * as faceapi from "@vladmandic/face-api";
import { loadFaceApiModels } from "../utils/faceapi-loader"

interface EmotionData {
    emotion: string;
    confidence: number;
    landmarks: faceapi.FaceLandmarks68;
}

export function useEmotionDetection(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    enabled: boolean,
    onEmotionDetected: (data: EmotionData) => void
) {

    const intervalRef = useRef<number | null>(null);

    const enabledRef = useRef(enabled);
    useEffect(() => {
        enabledRef.current = enabled;
    }, [enabled]);

    useEffect(() => {
        let cancelled = false;

        const startDetection = async () => {
            try {
                await loadFaceApiModels();

            
                
                if (!enabled || !videoRef.current) {
                    console.warn("🚫 Not starting detection: Disabled or videoRef missing.");
                    return;
                }

                if (enabled) {
                    intervalRef.current = window.setInterval(async () => {
                        const video = videoRef.current;

                        if (!video || video.readyState !== 4) {
                            console.log("Video not ready:", video?.readyState);
                            return;
                        }

                        if (!enabledRef.current) return;

                        try {
                            const detections = await faceapi
                                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                .withFaceLandmarks()
                                .withFaceExpressions();


                            if (detections.length > 0) {
                                const expressions = detections[0].expressions;
                                const landmarks = detections[0].landmarks;
                                // console.log(detections[0].landmarks);
                                const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
                                const [emotion, confidence] = sorted[0];
                                onEmotionDetected({ emotion, confidence, landmarks });
                                // onEmotionDetected({ emotion, confidence});
                            }

                        } catch (err) {
                            console.error("Emotion detection error:", err);
                        }
                    }, 2000);
                }
            } catch (e) {
                console.error("Model loading failed, detection skipped.");
            }
        };


        if (enabled && videoRef.current && !intervalRef.current) {
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