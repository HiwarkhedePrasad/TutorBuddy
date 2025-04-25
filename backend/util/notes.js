import { Server } from "socket.io";
import axios from "axios";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow any origin during development, tighten this in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("generate-notes", async (topic) => {
      console.log("Generating notes for topic:", topic.title || topic);

      try {
        // Use environment variable for QRoQ API URL with fallback
        const qroqUrl = process.env.GROQ_API_KEY;

        // Initial request to QRoQ API
        const response = await axios.post(
          qroqUrl,
          {
            model: "qwen2.5-coder:7b", // QRoQ model
            messages: [
              {
                role: "system",
                content:
                  "You are an expert educational assistant that creates comprehensive study notes. Your notes should be well-structured, thorough, and easy to understand.",
              },
              {
                role: "user",
                content: `Generate detailed study notes for the topic: ${
                  topic.title || topic
                }. Include key concepts, definitions, examples, and important points to remember.`,
              },
            ],
            stream: true,
          },
          { responseType: "text" }
        );

        // For handling streamed response
        let buffer = "";

        response.data.on("data", (chunk) => {
          buffer += chunk.toString();

          // Process complete JSON objects from the buffer
          let processedIndex = 0;

          // Find all complete JSON objects in the buffer
          while (true) {
            const jsonStartIndex = buffer.indexOf("{", processedIndex);
            if (jsonStartIndex === -1) break;

            try {
              // Try to find a complete JSON object
              const jsonEndIndex = buffer.indexOf("}\n", jsonStartIndex);
              if (jsonEndIndex === -1) break;

              const jsonStr = buffer.substring(
                jsonStartIndex,
                jsonEndIndex + 1
              );
              const data = JSON.parse(jsonStr);

              // If this is a valid response chunk with content
              if (data.message && data.message.content) {
                socket.emit("notes-update", data.message.content);
              }

              // Move past this JSON object in the buffer
              processedIndex = jsonEndIndex + 1;
            } catch (e) {
              // If we can't parse the JSON, move forward and try again
              processedIndex++;
              continue;
            }
          }

          // Remove processed data from buffer
          buffer = buffer.substring(processedIndex);
        });

        response.data.on("end", () => {
          console.log("Notes generation complete");
          socket.emit("notes-complete");
        });

        response.data.on("error", (err) => {
          console.error("Stream error:", err);
          socket.emit("notes-error", "Error generating notes");
        });
      } catch (error) {
        console.error("Error generating notes:", error.message);
        socket.emit(
          "notes-error",
          "Failed to generate notes. Please try again later."
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
