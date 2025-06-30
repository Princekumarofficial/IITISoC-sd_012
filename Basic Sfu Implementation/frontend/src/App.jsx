import { useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";

function App() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [preJoinReady, setPreJoinReady] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const localVideo = useRef(null);
  const device = useRef(null);
  const sendTransport = useRef(null);
  const recvTransport = useRef(null);
  const existingProducers = useRef([]);
  const wsRef = useRef(null);
  const localStream = useRef(null);
  const producerPeerMap = useRef(new Map());
  const audioProducer = useRef(null);
  const videoProducer = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = async (msg) => {
      const { type, data } = JSON.parse(msg.data);
      console.log("Received message:", type, data);

      if (type === "roomCreated") {
        alert("Room ID: " + data.roomId);
        setRoomId(data.roomId);
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
          wsRef.current?.send(JSON.stringify({ type: "connectSendTransport", data: { dtlsParameters } }));
          callback();
        });

        sendTransport.current.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
          try {
            const producerId = await new Promise((resolve) => {
              const listener = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === "produced") {
                  wsRef.current?.removeEventListener("message", listener);
                  resolve(msg.data.id);
                }
              };
              wsRef.current?.addEventListener("message", listener);
              wsRef.current?.send(JSON.stringify({ type: "produce", data: { kind, rtpParameters } }));
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
          wsRef.current?.send(JSON.stringify({ type: "connectRecvTransport", data: { dtlsParameters } }));
          callback();
        });

        for (const { producerId } of existingProducers.current) {
          await consume(producerId);
        }
        existingProducers.current = [];
      }

      if (type === "consumersCreated") {
        const newStreams = {};

        for (const consumerInfo of data) {
          const consumer = await recvTransport.current.consume({
            id: consumerInfo.id,
            producerId: consumerInfo.producerId,
            kind: consumerInfo.kind,
            rtpParameters: consumerInfo.rtpParameters,
          });

          const peerId = consumerInfo.peerId;

          if (!newStreams[peerId]) {
            newStreams[peerId] = {
              peerId,
              stream: new MediaStream(),
            };
          }

          newStreams[peerId].stream.addTrack(consumer.track);
        }

        const newRemoteStreams = Object.values(newStreams);

        setRemoteStreams((prev) => {
          const updated = [...prev];

          for (const newStream of newRemoteStreams) {
            const existing = updated.find((s) => s.peerId === newStream.peerId);
            if (existing) {
              newStream.stream.getTracks().forEach((track) => {
                existing.stream.addTrack(track);
              });
            } else {
              updated.push(newStream);
            }
          }

          return updated;
        });
      }

      if (type === "newProducer") {
        if (data?.producerId && data?.peerId) {
          producerPeerMap.current.set(data.producerId, data.peerId);
          await consume(data.producerId);
        }
      }

      if (type === "peerLeft") {
        const leftPeerId = data.peerId;
        setRemoteStreams((prev) => prev.filter((s) => s.peerId !== leftPeerId));
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const createRoom = () => {
    wsRef.current?.send(JSON.stringify({ type: "createRoom" }));
  };

  const prepareJoin = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;
      setPreJoinReady(true);
    } catch (err) {
      console.error("Failed to access camera/mic:", err);
    }
  };

  const joinRoom = () => {
    if (!roomId) return alert("Enter a room ID");
    wsRef.current?.send(JSON.stringify({ type: "joinRoom", data: { roomId } }));
    setJoined(true);
  };

  const leaveRoom = () => {
    wsRef.current?.send(JSON.stringify({ type: "leaveRoom" }));
    localStream.current?.getTracks().forEach((t) => t.stop());
    sendTransport.current?.close();
    recvTransport.current?.close();
    setRemoteStreams([]);
    setJoined(false);
    setPreJoinReady(false);
  };

  const createSendTransport = async () => {
    wsRef.current?.send(JSON.stringify({ type: "createSendTransport" }));
  };

  const createRecvTransport = async () => {
    wsRef.current?.send(JSON.stringify({ type: "createRecvTransport" }));
  };

  const startWebcam = async () => {
    for (const track of localStream.current.getTracks()) {
      const producer = await sendTransport.current.produce({ track });
      if (track.kind === "audio") audioProducer.current = producer;
      if (track.kind === "video") videoProducer.current = producer;
    }

    if (localVideo.current && localStream.current) {
      localVideo.current.srcObject = localStream.current;
    }

    if (!micEnabled && audioProducer.current) audioProducer.current.pause();
    if (!camEnabled && videoProducer.current) videoProducer.current.pause();
  };

  const consume = async (producerId) => {
    const peerId = producerPeerMap.current.get(producerId);
    wsRef.current?.send(
      JSON.stringify({
        type: "consume",
        data: { rtpCapabilities: device.current.rtpCapabilities, producerId, peerId },
      })
    );
  };

  const toggleMic = () => {
    setMicEnabled((prev) => {
      const enabled = !prev;
      if (audioProducer.current) {
        enabled ? audioProducer.current.resume() : audioProducer.current.pause();
      }
      return enabled;
    });
  };

  const toggleCam = () => {
    setCamEnabled((prev) => {
      const enabled = !prev;
      if (videoProducer.current) {
        enabled ? videoProducer.current.resume() : videoProducer.current.pause();
      }
      // Always keep stream visible
      if (localVideo.current && localStream.current) {
        localVideo.current.srcObject = localStream.current;
      }
      return enabled;
    });
  };

  return (
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">SFU Video Chat</h1>

      {!joined && (
        <div className="mb-4">
          <input
            placeholder="Room ID"
            className="border px-2 text-black mr-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className="bg-blue-500 px-4 py-2 mr-2" onClick={createRoom}>
            Create Room
          </button>
          <button className="bg-green-500 px-4 py-2" onClick={prepareJoin}>
            Join Room
          </button>
        </div>
      )}

      {preJoinReady && !joined && (
        <div className="mb-4">
          <div className="relative w-64 h-48 bg-black mb-2">
            <video
              ref={localVideo}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!camEnabled && (
              <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-sm">
                Camera Off
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 ${micEnabled ? "bg-yellow-500" : "bg-gray-600"}`}
              onClick={toggleMic}
            >
              {micEnabled ? "Mute Mic" : "Unmute Mic"}
            </button>
            <button
              className={`px-4 py-2 ${camEnabled ? "bg-yellow-500" : "bg-gray-600"}`}
              onClick={toggleCam}
            >
              {camEnabled ? "Turn Off Camera" : "Turn On Camera"}
            </button>
            <button className="bg-green-600 px-4 py-2" onClick={joinRoom}>
              Join Call
            </button>
          </div>
        </div>
      )}

      {joined && (
        <div className="mb-4">
          <button
            className={`px-4 py-2 mr-2 ${micEnabled ? "bg-yellow-500" : "bg-gray-600"}`}
            onClick={toggleMic}
          >
            {micEnabled ? "Mute Mic" : "Unmute Mic"}
          </button>
          <button
            className={`px-4 py-2 mr-2 ${camEnabled ? "bg-yellow-500" : "bg-gray-600"}`}
            onClick={toggleCam}
          >
            {camEnabled ? "Turn Off Camera" : "Turn On Camera"}
          </button>
          <button className="bg-red-500 px-4 py-2" onClick={leaveRoom}>
            Leave Call
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {joined && (
          <div className="relative bg-black w-full aspect-video">
            <video
              ref={localVideo}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!camEnabled && (
              <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-sm">
                Camera Off
              </div>
            )}
          </div>
        )}

        {remoteStreams.map((remote) => (
          <div key={`${remote.peerId}-${remote.stream.id}`} className="bg-black w-full aspect-video relative">
            <video
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              ref={(el) => {
                if (el && remote.stream && el.srcObject !== remote.stream) {
                  el.srcObject = remote.stream;
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;



