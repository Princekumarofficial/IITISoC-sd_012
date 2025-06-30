const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mediasoup = require("mediasoup");
const { mediaCodecs } = require("./mediasoup-config");
const { createRoom, getRoom, addPeer, getPeer, cleanupPeer } = require("./rooms");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let worker;
(async () => {
  worker = await mediasoup.createWorker();
  console.log("Mediasoup worker created.");
})();

wss.on("connection", (ws) => {
  const peerId = Date.now().toString();
  let roomId = null;

  ws.on("message", async (message) => {
    const msg = JSON.parse(message);
    const { type, data } = msg;

    if (type === "createRoom") {
      const router = await worker.createRouter({ mediaCodecs });
      roomId = createRoom(router);
      ws.send(JSON.stringify({ type: "roomCreated", data: { roomId } }));
    }

    if (type === "joinRoom") {
      roomId = data.roomId;
      const room = getRoom(roomId);
      if (!room) {
        ws.send(JSON.stringify({ type: "error", data: "Room not found" }));
        return;
      }

      addPeer(roomId, peerId, { ws });

      // Send back router capabilities and all existing producers in room
      const existingProducers = [];
      for (const [otherId, otherPeer] of room.peers) {
        if (otherId !== peerId && otherPeer.producers) {
          for (const p of otherPeer.producers) {
            existingProducers.push({ producerId: p.id, peerId: otherId });
          }
        }
      }

      ws.send(JSON.stringify({
        type: "joinedRoom",
        data: {
          rtpCapabilities: room.router.rtpCapabilities,
          producers: existingProducers
        }
      }));
    }

    if (type === "leaveRoom") {
      cleanupPeer(roomId, peerId);
      const room = getRoom(roomId);
      if (room) {
        for (const [otherId, otherPeer] of room.peers) {
          if (otherId !== peerId) {
            otherPeer.ws.send(JSON.stringify({
              type: "peerLeft",
              data: { peerId },
            }));
          }
        }
      }
    }

    if (type === "createSendTransport") {
      const room = getRoom(roomId);
      const transport = await room.router.createWebRtcTransport({
        listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      });
      transport.on("dtlsstatechange", (state) => {
        if (state === "closed") transport.close();
      });
      getPeer(roomId, peerId).sendTransport = transport;
      ws.send(JSON.stringify({
        type: "sendTransportCreated",
        data: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
      }));
    }

    if (type === "connectSendTransport") {
      await getPeer(roomId, peerId).sendTransport.connect({ dtlsParameters: data.dtlsParameters });
    }

    if (type === "produce") {
      const { kind, rtpParameters } = data;
      const peer = getPeer(roomId, peerId);
      const producer = await peer.sendTransport.produce({ kind, rtpParameters });

      peer.producers = peer.producers || [];
      peer.producers.push(producer);

      ws.send(JSON.stringify({ type: "produced", data: { id: producer.id } }));

      // Broadcast new producer to all others
      const room = getRoom(roomId);
      for (const [otherId, otherPeer] of room.peers) {
        if (otherId !== peerId) {
          otherPeer.ws.send(JSON.stringify({
            type: "newProducer",
            data: { producerId: producer.id, peerId }
          }));
        }
      }
    }

    if (type === "createRecvTransport") {
      const room = getRoom(roomId);
      const transport = await room.router.createWebRtcTransport({
        listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      });
      getPeer(roomId, peerId).recvTransport = transport;
      ws.send(JSON.stringify({
        type: "recvTransportCreated",
        data: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
      }));
    }

    if (type === "connectRecvTransport") {
      await getPeer(roomId, peerId).recvTransport.connect({ dtlsParameters: data.dtlsParameters });
    }

    if (type === "consume") {
      const { rtpCapabilities, producerId } = data;
      const room = getRoom(roomId);
      const peer = getPeer(roomId, peerId);
      const consumers = [];

      if (!room || !peer || !peer.recvTransport) return;

      const allProducers = [];

      for (const [id, otherPeer] of room.peers) {
        if (id === peerId || !otherPeer.producers) continue;
        allProducers.push(...otherPeer.producers.map((p) => ({ producer: p, peerId: id })));
      }

      const targetProducers = producerId
        ? allProducers.filter(({ producer }) => producer.id === producerId)
        : allProducers;

      for (const { producer, peerId: producerPeerId } of targetProducers) {
        try {
          const consumer = await peer.recvTransport.consume({
            producerId: producer.id,
            rtpCapabilities,
            paused: false,
          });

          peer.consumers = peer.consumers || [];
          peer.consumers.push(consumer);

          consumers.push({
            id: consumer.id,
            producerId: consumer.producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            peerId: producerPeerId, // ✅ Include peerId
          });
        } catch (err) {
          console.error("Failed to consume:", err);
        }
      }

      ws.send(JSON.stringify({
        type: "consumersCreated",
        data: consumers,
      }));
    }
  });

  ws.on("close", () => {
    cleanupPeer(roomId, peerId);
    const room = getRoom(roomId);
    if (room) {
      for (const [otherId, otherPeer] of room.peers) {
        if (otherId !== peerId) {
          otherPeer.ws.send(JSON.stringify({
            type: "peerLeft",
            data: { peerId },
          }));
        }
      }
    }
  });
});

server.listen(3001, "0.0.0.0", () => console.log("SFU WebSocket server running on ws://localhost:3001"));