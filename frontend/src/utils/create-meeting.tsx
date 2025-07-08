export function createMeetingRoom(): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket("ws://localhost:8000/mediasoup");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "createRoom" }));
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "roomCreated") {
        const { roomId } = data;
        ws.close();
        resolve(roomId);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      reject(err);
    };

    ws.onclose = () => {
      // In case it closes without sending roomId
      reject(new Error("WebSocket closed before room ID was received"));
    };
  });
}