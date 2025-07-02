import { v4 as uuid } from "uuid";

const rooms = new Map();

export function createRoom(router) {
  const id = uuid();
  rooms.set(id, { router, peers: new Map() });
  return id;
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function addPeer(roomId, peerId, peerInfo) {
  const room = getRoom(roomId);
  room.peers.set(peerId, peerInfo);
}

export function getPeer(roomId, peerId) {
  return getRoom(roomId)?.peers.get(peerId);
}

export function cleanupPeer(roomId, peerId) {
  const room = getRoom(roomId);
  if (!room) return;

  const peer = getPeer(roomId, peerId);
  if (!peer) return;

  // Cleanup
  peer.producers?.forEach((p) => p.close());
  peer.consumers?.forEach((c) => c.close());
  peer.sendTransport?.close();
  peer.recvTransport?.close();

  room.peers.delete(peerId);

  for (const [otherId, otherPeer] of room.peers) {
    otherPeer.ws.send(JSON.stringify({
      type: "peerLeft",
      data: { peerId },
    }));
  }

  console.log(`Peer ${peerId} left and cleaned up from room ${roomId}`);
}
