import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import WebSocket, { WebSocketServer } from "ws";
import mediasoup from "mediasoup";
import connectDB from "./db/db.js";
import router from "./routes/routes.js";
import { mediaCodecs } from "./sfu/mediasoup-config.js";
import handleWebSocketConnection from "./sfu/wsHandler.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api", router);

// Connect to MongoDB
connectDB();

// Setup mediasoup worker and WebSocket SFU
const wss = new WebSocketServer({ server });
let worker;

(async () => {
  worker = await mediasoup.createWorker();
  console.log("Mediasoup worker created");

  wss.on("connection", (ws) => {
    handleWebSocketConnection(ws, worker);
  });
})();

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});