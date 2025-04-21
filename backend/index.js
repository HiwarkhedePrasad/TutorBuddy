import express from "express";
import http from "http"; // Import HTTP module
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import initializeSocket from "./util/socket.js"; // Import socket setup

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io

app.use(express.json());
app.use(cors());

// Use the single routes file
app.use("/api", routes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 🛑 Prevent multiple socket.io initializations
if (!global.ioInstance) {
  global.ioInstance = initializeSocket(server);
  console.log("✅ WebSocket server initialized.");
} else {
  console.log(
    "⚠️ WebSocket server already running. Skipping re-initialization."
  );
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} ✅`));
