import { useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { useNotifications } from "../components/Notification-system";
import { useNavigate } from "react-router-dom";
export interface RemoteStream {
    peerId: string;
    stream: MediaStream;
}

export function useSFUClient(roomId: string) {
   
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

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000");
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "joinRoom", data: { roomId } }));
        };

        ws.onmessage = async (msg) => {
            const { type, data } = JSON.parse(msg.data);
            if( type ==="error" && data ==="Room not found")
            {
                alert(data)
                navigate('/preJoin')

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
                    ws.send(JSON.stringify({ type: "connectSendTransport", data: { dtlsParameters } }));
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
                            ws.send(JSON.stringify({ type: "produce", data: { kind, rtpParameters } }));
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
                    ws.send(JSON.stringify({ type: "connectRecvTransport", data: { dtlsParameters } }));
                    callback();
                });

                for (const { producerId } of existingProducers.current) {
                    await consume(producerId);
                }
                existingProducers.current = [];
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

                    const peerId = consumerInfo.peerId;
                    if (!newStreams[peerId]) newStreams[peerId] = { peerId, stream: new MediaStream() };
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
                producerPeerMap.current.set(data.producerId, data.peerId);
                await consume(data.producerId);
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
        wsRef.current?.send(JSON.stringify({ type: "createSendTransport" }));
    };

    const createRecvTransport = async () => {
        wsRef.current?.send(JSON.stringify({ type: "createRecvTransport" }));
    };

    const startWebcam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        for (const track of stream.getTracks()) {
            const producer = await sendTransport.current.produce({ track });
            if (track.kind === "audio") audioProducer.current = producer;
            if (track.kind === "video") videoProducer.current = producer;
        }
    };

    const consume = async (producerId: string) => {
        const peerId = producerPeerMap.current.get(producerId);
        wsRef.current?.send(
            JSON.stringify({
                type: "consume",
                data: {
                    rtpCapabilities: device.current.rtpCapabilities,
                    producerId,
                    peerId,
                },
            })
        );
    };

    const toggleMic = async () => {
        if (!audioProducer.current) return;

        const isTrackEnded = localStream?.getAudioTracks().every((t) => t.readyState === "ended");
        const isPaused = audioProducer.current.paused;
        
        addNotification({
          type: "info",
          title: isPaused || isTrackEnded ? "Microphone On" : "Microphone Off",
          message: isPaused || isTrackEnded ? "Microphone is now on" : "Microphone is now off",
          duration: 1000,
        })
        if (isPaused || isTrackEnded) {
            // MIC IS OFF → TURN IT BACK ON
            const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const newAudioTrack = newStream.getAudioTracks()[0];

            await audioProducer.current.replaceTrack({ track: newAudioTrack });

            // Rebuild localStream (audio + existing video if any)
            const newCombinedStream = new MediaStream([
                newAudioTrack,
                ...localStream!.getVideoTracks().filter((t) => t.readyState !== "ended"),
            ]);
            setLocalStream(newCombinedStream);

            audioProducer.current.resume();
        } else {
            // MIC IS ON → TURN IT OFF
            audioProducer.current.pause();
            localStream?.getAudioTracks().forEach((track) => track.stop()); // this disables mic
        }
    };
    const toggleCam = async () => {
        if (!videoProducer.current) return;

        const isTrackEnded = localStream?.getVideoTracks().every((t) => t.readyState === "ended");
        const isPaused = videoProducer.current.paused;

         addNotification({
          type: "info",
          title: isPaused || isTrackEnded ? "Video On" : "Video Off",
          message: isPaused || isTrackEnded ? "Camera is now on" : "Camera is now off",
          duration: 1000,
        })
        if (isPaused || isTrackEnded) {
            // CAMERA IS OFF → TURN IT BACK ON
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const newVideoTrack = newStream.getVideoTracks()[0];

            await videoProducer.current.replaceTrack({ track: newVideoTrack });

            // Rebuild local stream (video + existing audio)
            const newCombinedStream = new MediaStream([
                newVideoTrack,
                ...localStream!.getAudioTracks(),
            ]);
            setLocalStream(newCombinedStream);

            videoProducer.current.resume();
        } else {
            // CAMERA IS ON → TURN IT OFF
            videoProducer.current.pause();
            localStream?.getVideoTracks().forEach((track) => track.stop()); // this turns off the LED
        }
    };


    return {
        localStream,
        remoteStreams,
        toggleMic,
        toggleCam,
    };
}