import { Server } from "socket.io";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get Groq API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("⚠️ GROQ_API_KEY is not defined in environment variables!");
}

// Define available models
const GROQ_MODELS = {
  "notes-generation": "llama3-70b-8192", // Using powerful model for note generation
  default: "llama3-8b-8192",
};

let io; // Global io instance to prevent multiple initializations

const initializeSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: [
          "https://tutor-buddy-lovat.vercel.app",
          "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 New client connected:", socket.id);

      // Handle notes generation request
      socket.on("generate-notes", async (topic) => {
        console.log(`📝 Generating notes for topic: ${topic.title || topic}`);

        // Reset any previous state
        let notesContent = "";

        try {
          if (!GROQ_API_KEY) {
            throw new Error("API key is missing");
          }

          console.log("Sending request to Groq API...");

          // Make request to Groq API
          const response = await axios({
            method: "post",
            url: "https://api.groq.com/openai/v1/chat/completions",
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            data: {
              model: GROQ_MODELS["notes-generation"],
              messages: [
                {
                  role: "system",
                  content: `You are an expert tutor creating detailed interactive study notes.
                           Ensure proper spacing and formatting in all content.`,
                },
                {
                  role: "user",
                  content: `Generate well-structured, comprehensive educational notes for "${
                    topic.title || topic
                  }".
                           Include definitions, examples, key concepts, and visual descriptions where appropriate.
                           Format the content with clear headings, subheadings, and bullet points.`,
                },
              ],
              stream: true,
              max_tokens: 4096,
            },
            responseType: "stream",
          });

          // Handle streaming response
          response.data.on("data", (chunk) => {
            const chunkStr = chunk.toString().trim();

            // Process SSE format chunks from Groq
            const lines = chunkStr
              .split("\n")
              .filter((line) => line.trim() !== "");

            for (const line of lines) {
              if (line === "data: [DONE]") continue;

              try {
                // Remove "data: " prefix if present
                const jsonStr = line.startsWith("data: ")
                  ? line.slice(5)
                  : line;

                // Skip empty lines
                if (!jsonStr.trim()) continue;

                const parsedChunk = JSON.parse(jsonStr);

                if (
                  parsedChunk.choices &&
                  parsedChunk.choices[0]?.delta?.content
                ) {
                  const responseText = parsedChunk.choices[0].delta.content;
                  notesContent += responseText;
                  console.log("Sending chunk to frontend");
                  socket.emit("notes-update", responseText);
                }
              } catch (error) {
                console.error("Error parsing chunk:", error, "Line:", line);
              }
            }
          });

          // Handle end of stream
          response.data.on("end", () => {
            console.log(
              "✅ Stream completed, total length:",
              notesContent.length
            );
            socket.emit("notes-complete");
          });

          // Handle stream errors
          response.data.on("error", (error) => {
            console.error("❌ Stream error:", error);
            socket.emit("error", { error: "Notes generation stream error" });
          });
        } catch (error) {
          console.error("❌ Notes generation error:", error);

          // Detailed error reporting
          if (error.response) {
            console.error("API Error Response:", {
              status: error.response.status,
              headers: error.response.headers,
            });
          }

          socket.emit("error", {
            error: "Failed to generate notes",
            details: error.message,
          });

          // Also send notes-complete to unblock the UI
          socket.emit("notes-complete");
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
      });
    });
  } else {
    console.log(
      "⚠️ Socket.io already initialized. Skipping re-initialization."
    );
  }

  return io;
};

export default initializeSocket;
