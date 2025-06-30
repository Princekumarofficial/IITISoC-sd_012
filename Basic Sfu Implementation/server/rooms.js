const { v4: uuid } = require("uuid");

const rooms = new Map(); // roomId -> { router, peers }


function createRoom(router) {
  const id = uuid();
  rooms.set(id, { router, peers: new Map() });
  return id;
}

function getRoom(roomId) {
  return rooms.get(roomId);
}

function addPeer(roomId, peerId, peerInfo) {
  const room = getRoom(roomId);
  room.peers.set(peerId, peerInfo);
}

function getPeer(roomId, peerId) {
  return getRoom(roomId).peers.get(peerId);
}

function cleanupPeer(roomId, peerId) {
  const room = getRoom(roomId);
  if (!room) return;

  const peer = getPeer(roomId, peerId);
  if (!peer) return;

  // Close producers
  if (peer.producers) peer.producers.forEach((p) => p.close());

  // Close consumers
  if (peer.consumers) peer.consumers.forEach((c) => c.close());

  // Close transports
  peer.sendTransport?.close();
  peer.recvTransport?.close();

  // Remove from room
  room.peers.delete(peerId);

  // Notify others
  for (const [otherId, otherPeer] of room.peers) {
    otherPeer.ws.send(JSON.stringify({ type: "peerLeft", data: { peerId } }));
  }

  console.log(`✅ Peer ${peerId} left and cleaned up from room ${roomId}`);
}

module.exports = { createRoom, getRoom, addPeer, getPeer, cleanupPeer};