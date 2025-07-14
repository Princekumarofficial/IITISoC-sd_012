import { useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { useNotifications } from "../components/Notification-system";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import type { FaceLandmarks68 } from "@vladmandic/face-api";
import { useMediaStore } from "../store/useMediaStore";

export interface RemoteStream {
    peerId: string;
    peerName: string;
    stream: MediaStream;
}

export type LandmarkSection = {
    [key: string]: { x: number; y: number }[];
};

export function useSFUClient(
    roomId: string,
    onEmotionUpdate: (userId: string, emotion: string, confidence: number, landmarks: LandmarkSection, isOverlayOn: boolean) => void
) {
    const { authUser } = useAuthStore();
    const { isVideoEnabled, isAudioEnabled } = useMediaStore.getState();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
    const { addNotification } = useNotifications();
    const device = useRef<any>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const sendTransport = useRef<any>(null);
    const recvTransport = useRef<any>(null);
    const producerPeerMap = useRef(new Map());
    const audioProducer = useRef<any>(null);
    const videoProducer = useRef<any>(null);
    const existingProducers = useRef<any[]>([]);
    const navigate = useNavigate();
    const screenProducer = useRef<any>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/mediasoup");
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "joinRoom", data: { roomId, peerId: authUser._id, peerName: authUser.username } }));
        };

        ws.onmessage = async (msg) => {
            const { type, data } = JSON.parse(msg.data);

            if (type === "error" && data === "Room not found") {
                alert(data);
                navigate("/preJoin");
            }

            if (type === "joinedRoom") {
                device.current = new mediasoupClient.Device();
                await device.current.load({ routerRtpCapabilities: data.rtpCapabilities });
                existingProducers.current = data.producers || [];

                for (const { producerId, peerId } of existingProducers.current) {
                    producerPeerMap.current.set(producerId, peerId);
                }

                await createSendTransport();
            }

            if (type === "sendTransportCreated") {
                sendTransport.current = device.current.createSendTransport(data);

                sendTransport.current.on("connect", ({ dtlsParameters }, callback) => {
                    ws.send(JSON.stringify({ type: "connectSendTransport", data: { dtlsParameters, peerId: authUser._id } }));
                    callback();
                });

                sendTransport.current.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
                    try {
                        const producerId = await new Promise((resolve) => {
                            const listener = (event: any) => {
                                const msg = JSON.parse(event.data);
                                if (msg.type === "produced") {
                                    ws.removeEventListener("message", listener);
                                    resolve(msg.data.id);
                                }
                            };
                            ws.addEventListener("message", listener);
                            ws.send(JSON.stringify({ type: "produce", data: { kind, rtpParameters, peerId: authUser._id } }));
                        });
                        callback({ id: producerId });
                    } catch (err) {
                        errback(err);
                    }
                });

                await startWebcam();
                await createRecvTransport();
            }

            if (type === "recvTransportCreated") {
                recvTransport.current = device.current.createRecvTransport(data);
                recvTransport.current.on("connect", ({ dtlsParameters }, callback) => {
                    ws.send(JSON.stringify({ type: "connectRecvTransport", data: { dtlsParameters, peerId: authUser._id } }));
                    callback();
                });

                for (const { producerId } of existingProducers.current) {
                    await consume(producerId);
                }
                existingProducers.current = [];
            }

            if (type === "emotion_update") {
                const { userId, emotion, confidence, landmarks, isOverlayOn } = data;
                if (userId && emotion && typeof confidence === "number" && landmarks) {
                    onEmotionUpdate(userId, emotion, confidence, landmarks, isOverlayOn);
                }
            }

            if (type === "consumersCreated") {
                const newStreams: Record<string, RemoteStream> = {};


                for (const consumerInfo of data) {
                    const consumer = await recvTransport.current.consume({
                        id: consumerInfo.id,
                        producerId: consumerInfo.producerId,
                        kind: consumerInfo.kind,
                        rtpParameters: consumerInfo.rtpParameters,
                    });

                    console.log("🔍 Received track:", {
                        kind: consumer.kind,
                        label: consumer.track.label, // often says "screen" or "screen-capture"
                        settings: consumer.track.getSettings(),
                    });
                    consumer.track._producerId = consumerInfo.producerId;
                    const peerId = consumerInfo.peerId;
                    const peerName = consumerInfo.peerName;
                    if (!newStreams[peerId]) newStreams[peerId] = { peerId, peerName, stream: new MediaStream() };
                    newStreams[peerId].stream.addTrack(consumer.track);
                }

                setRemoteStreams((prev) => {
                    const updated = [...prev];
                    for (const s of Object.values(newStreams)) {
                        const existing = updated.find((p) => p.peerId === s.peerId);
                        if (existing) {
                            s.stream.getTracks().forEach((t) => existing.stream.addTrack(t));
                        } else {
                            updated.push(s);
                        }
                    }
                    return updated;
                });
            }

            if (type === "newProducer") {
                console.log(`New Producer created ${data.producerId} by ${data.peerId}`)
                producerPeerMap.current.set(data.producerId, data.peerId);
                if (data.peerId !== authUser._id) {
                    await consume(data.producerId);
                }
            }


            if (type === "producerClosed") {
                const { producerId, peerId } = data;

                console.log(`Producer ${producerId} from ${peerId} closed`);

                setRemoteStreams((prev) => {
                    const updated = [...prev];
                    const peerStream = updated.find((s) => s.peerId === peerId);

                    if (peerStream) {
                        const stream = peerStream.stream;
                        const before = stream.getTracks().length;

                        // Remove only the track matching the producerId
                        stream.getTracks().forEach((track) => {
                            if ((track as any)._producerId === producerId) {
                                stream.removeTrack(track);
                            }
                        });

                        console.log(`🧹 Removed track from ${peerId}. Before: ${before}, After: ${stream.getTracks().length}`);
                    }

                    // Remove the whole stream if it's empty (optional)
                    return updated.filter((s) => s.stream.getTracks().length > 0);
                });
            }



            if (type === "peerLeft") {
                setRemoteStreams((prev) => prev.filter((s) => s.peerId !== data.peerId));
            }
        };

        return () => {
            ws.close();
            remoteStreams.forEach((s) => s.stream.getTracks().forEach((t) => t.stop()));
        };
    }, [roomId]);

    const createSendTransport = async () => {
        wsRef.current?.send(JSON.stringify({ type: "createSendTransport", data: { peerId: authUser._id } }));
    };

    const createRecvTransport = async () => {
        wsRef.current?.send(JSON.stringify({ type: "createRecvTransport", data: { peerId: authUser._id } }));
    };

    const startWebcam = async () => {
        const {
            stream,
            isVideoEnabled,
            isAudioEnabled,
        } = useMediaStore.getState();

        if (!stream) {
            console.warn("No media stream available in store.");
            return;
        }

        const tracks = stream.getTracks();

        for (const track of tracks) {
            const producer = await sendTransport.current.produce({ track });

            if (track.kind === "video") {
                videoProducer.current = producer;
                if (!isVideoEnabled) {
                    producer.pause();
                    track.stop(); // ✅ turns off camera light
                }
            }

            if (track.kind === "audio") {
                audioProducer.current = producer;
                if (!isAudioEnabled) {
                    producer.pause();
                    track.stop(); // ✅ turns off mic use (optional)
                }
            }
        }

        setLocalStream(stream); // ✅ Still hold the combined stream in state
    };
    const consume = async (producerId: string) => {

        wsRef.current?.send(
            JSON.stringify({
                type: "consume",
                data: {
                    rtpCapabilities: device.current.rtpCapabilities,
                    producerId,
                    peerId: authUser._id,
                },
            })
        );
    };

    const toggleMic = async () => {
        if (!audioProducer.current) return;

        const {
            selectedMicrophone,
            setAudioEnabled,
            setStream,
        } = useMediaStore.getState();

        const isTrackEnded = localStream?.getAudioTracks().every((t) => t.readyState === "ended");
        const isPaused = audioProducer.current.paused;

        addNotification({
            type: "info",
            title: isPaused || isTrackEnded ? "Microphone On" : "Microphone Off",
            message: isPaused || isTrackEnded ? "Microphone is now on" : "Microphone is now off",
            duration: 1000,
        });

        if (isPaused || isTrackEnded) {
            const newStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
                },
            });
            const newAudioTrack = newStream.getAudioTracks()[0];

            await audioProducer.current.replaceTrack({ track: newAudioTrack });

            const combinedStream = new MediaStream([
                newAudioTrack,
                ...localStream?.getVideoTracks().filter((t) => t.readyState !== "ended") || [],
            ]);

            setLocalStream(combinedStream);
            setStream(combinedStream);
            audioProducer.current.resume();
            setAudioEnabled(true);
        } else {
            audioProducer.current.pause();
            localStream?.getAudioTracks().forEach((t) => t.stop());

            const remainingTracks = localStream?.getVideoTracks() || [];
            const newStream = new MediaStream(remainingTracks);

            setLocalStream(newStream);
            setStream(newStream);
            setAudioEnabled(false);
        }
    };

    const toggleCam = async () => {
        if (!videoProducer.current) return;

        const { selectedCamera, setVideoEnabled, setStream } = useMediaStore.getState();

        const isTrackEnded = localStream?.getVideoTracks().every((t) => t.readyState === "ended");
        const isPaused = videoProducer.current.paused;

        addNotification({
            type: "info",
            title: isPaused || isTrackEnded ? "Video On" : "Video Off",
            message: isPaused || isTrackEnded ? "Camera is now on" : "Camera is now off",
            duration: 1000,
        });

        if (isPaused || isTrackEnded) {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
                },
            });
            const newVideoTrack = newStream.getVideoTracks()[0];

            await videoProducer.current.replaceTrack({ track: newVideoTrack });

            const newCombinedStream = new MediaStream([
                newVideoTrack,
                ...localStream!.getAudioTracks(),
            ]);
            setLocalStream(newCombinedStream);
            setStream(newCombinedStream)
            setVideoEnabled(true);

            videoProducer.current.resume();
        } else {
            videoProducer.current.pause();
            localStream?.getVideoTracks().forEach((track) => track.stop());
            setVideoEnabled(false);

        }
    };

    const sendEmotionUpdate = (roomId: string | null, emotion: string, confidence: number, landmarks: FaceLandmarks68, isOverlayOn: boolean) => {
        // console.log("WebSocket readyState:", wsRef.current?.readyState);
        // console.log("roomId:", roomId, "userId:", authUser?._id);
        const simplifyPoint = ({ x, y }: { x: number; y: number }) => ({ x, y });
        const safeLandmarks = {
            nose: simplifyPoint(landmarks.getNose()[3]),
            leftEye: simplifyPoint(landmarks.getLeftEye()[0]),
            rightEye: simplifyPoint(landmarks.getRightEye()[3]),
        };
        wsRef.current?.send(
            JSON.stringify({
                type: "emotion_update",
                data: {
                    roomId,
                    emotion,
                    confidence,
                    landmarks: safeLandmarks,
                    isOverlayOn,
                    peerId: authUser._id,
                },
            })
        );
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];

            screenProducer.current = await sendTransport.current.produce({ track: screenTrack });

            screenTrack.onended = () => {
                stopScreenShare();
            };

            addNotification({
                type: "success",
                title: "Screen Sharing Started",
                message: "You're now sharing your screen.",
            });
        } catch (err) {
            console.error("Screen share error:", err);
            addNotification({
                type: "error",
                title: "Screen Share Failed",
                message: "Could not start screen sharing.",
            });
        }
    };

    const stopScreenShare = () => {
        if (screenProducer.current) {

            wsRef.current?.send(JSON.stringify({
                type: "producerClosed",
                data: {
                    producerId: screenProducer.current.id,
                    peerId: authUser._id,
                },
            }));
            screenProducer.current.close();
            screenProducer.current = null;
        }

        addNotification({
            type: "info",
            title: "Screen Sharing Stopped",
            message: "Your screen share has ended.",
        });
    };

    return {
        localStream,
        remoteStreams,
        sendEmotionUpdate,
        toggleMic,
        toggleCam,
        startScreenShare,
        stopScreenShare,
    };
}