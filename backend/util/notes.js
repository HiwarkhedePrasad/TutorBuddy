import { Server } from "socket.io";
import axios from "axios";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://tutor-buddy-lovat.vercel.app/",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("generate-notes", async (topicTitle) => {
      console.log("Generating notes for:", topicTitle);

      try {
        // Make a request to the local Ollama instance
        const response = await axios.post(
          "http://localhost:11434/api/generate",
          {
            model: "qwen:2.5", // Use your installed Ollama model
            prompt: `Generate detailed study notes for: ${topicTitle}`,
            stream: true,
          },
          { responseType: "stream" }
        );

        response.data.on("data", (chunk) => {
          const dataString = chunk.toString();
          socket.emit("notes-update", dataString); // Send notes in real-time
        });

        response.data.on("end", () => {
          socket.emit("notes-complete"); // Notify when done
        });
      } catch (error) {
        console.error("Error generating notes:", error);
        socket.emit("notes-error", "Failed to generate notes.");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
