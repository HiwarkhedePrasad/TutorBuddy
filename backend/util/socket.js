import { Server } from "socket.io";
import axios from "axios";
import AiChat from "../models/aiChat.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get Groq API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("⚠️ GROQ_API_KEY is not defined in environment variables!");
}

let io; // Global io instance

// Updated Map of available models in Groq (April 2025)
// Removed the decommissioned mixtral-8x7b-32768
const GROQ_MODELS = {
  // For chat functionality
  "qwen-2.5": "llama3-70b-8192",
  mistral: "llama3-8b-8192", // Updated from mixtral-8x7b-32768 to a supported model
  default: "llama3-8b-8192",

  // For notes generation (using a powerful model)
  "notes-generation": "llama3-70b-8192",
};

// Utility function to consolidate consecutive user messages
const consolidateMessages = (messages) => {
  if (!messages || messages.length <= 1) return messages;

  return messages.reduce((acc, current, index, array) => {
    // Skip if this message is a duplicate of the previous one
    const prev = array[index - 1];
    if (prev && current.role === "user" && prev.role === "user") {
      // Instead of skipping completely, combine messages if they're duplicates
      acc[acc.length - 1].content += "\n" + current.content;
      return acc;
    }
    acc.push(current);
    return acc;
  }, []);
};

const initializeSocket = (server) => {
  if (!io) {
    // ✅ Prevent multiple initializations
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 New client connected:", socket.id);

      // 📌 AI Chat Handling
      socket.on("chatMessage", async ({ userId, message, model }) => {
        console.log("Received chatMessage from:", socket.id);

        try {
          if (!userId) {
            socket.emit("error", { error: "User ID is required" });
            return;
          }

          // Get the appropriate Groq model
          const selectedModel = GROQ_MODELS[model] || GROQ_MODELS.default;
          console.log(`Using Groq model: ${selectedModel}`);

          const chatHistory = await AiChat.findOne({ user: userId }).lean();
          const lastMessages = chatHistory?.messages?.slice(-8) || [];

          // First, add the new message to the database
          await AiChat.findOneAndUpdate(
            { user: userId },
            { $push: { messages: { role: "user", content: message } } },
            { upsert: true, new: true }
          );

          // Format messages for Groq API
          let formattedMessages = lastMessages.map((msg) => ({
            role: msg.role === "ai" ? "assistant" : msg.role, // Groq uses "assistant" instead of "ai"
            content: msg.content,
          }));

          // Add the current message
          formattedMessages.push({ role: "user", content: message });

          // Apply message consolidation to avoid API issues with duplicate messages
          formattedMessages = consolidateMessages(formattedMessages);

          console.log(
            "Sending request to Groq with context:",
            formattedMessages
          );

          // Verify the API key before making the request
          if (!GROQ_API_KEY || GROQ_API_KEY.trim() === "") {
            throw new Error("API key is missing or invalid");
          }

          // Ensure we have alternating user/assistant messages for better API compliance
          const validatedMessages = [];
          let lastRole = null;

          for (const msg of formattedMessages) {
            if (lastRole !== msg.role) {
              validatedMessages.push(msg);
              lastRole = msg.role;
            } else if (msg.role === "user") {
              // If we have consecutive user messages, combine their content
              validatedMessages[validatedMessages.length - 1].content +=
                "\n" + msg.content;
            }
            // Skip consecutive assistant messages as they shouldn't occur in your data model
          }

          // Handle streaming responses properly
          const response = await axios({
            method: "post",
            url: "https://api.groq.com/openai/v1/chat/completions",
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            data: {
              model: selectedModel,
              messages: validatedMessages,
              stream: true, // Set to true for streaming
              max_tokens: 1024, // Adding a reasonable limit to avoid issues
            },
            responseType: "stream", // Keep as stream
          });

          let aiResponse = "";

          response.data.on("data", (chunk) => {
            const chunkStr = chunk.toString().trim();

            // Groq sends "data: " prefixed SSE format
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
                  aiResponse += responseText;
                  console.log("Sending to frontend:", responseText);
                  socket.emit("aiResponse", { word: responseText });
                }
              } catch (error) {
                console.error("Error parsing chunk:", error, "Line:", line);
              }
            }
          });

          response.data.on("end", async () => {
            console.log("Stream ended, full AI response:", aiResponse);
            socket.emit("aiResponseEnd");

            // Only save to database if we got a response
            if (aiResponse.trim()) {
              await AiChat.findOneAndUpdate(
                { user: userId },
                { $push: { messages: { role: "ai", content: aiResponse } } },
                { new: true }
              );
            }
          });

          response.data.on("error", (error) => {
            console.error("Stream error:", error);
            socket.emit("error", { error: "AI stream error" });
          });
        } catch (error) {
          // Enhanced error logging
          if (error.response) {
            console.error("Groq API Error Response:", {
              status: error.response.status,
              headers: error.response.headers,
            });

            // If the response has a readable stream, log its content
            if (
              error.response.data &&
              typeof error.response.data.pipe === "function"
            ) {
              let errorData = "";
              error.response.data.on("data", (chunk) => {
                errorData += chunk.toString();
              });
              error.response.data.on("end", () => {
                console.error("Groq API Error Body:", errorData);

                try {
                  const parsedError = JSON.parse(errorData);
                  if (
                    parsedError.error &&
                    parsedError.error.code === "model_decommissioned"
                  ) {
                    console.error(
                      `Model ${
                        parsedError.error.message.split("`")[1]
                      } is decommissioned. Falling back to default model.`
                    );
                    // Could implement auto-retry with default model here
                  }
                } catch (parseError) {
                  console.error("Could not parse error body as JSON");
                }
              });
            }
          }

          console.error("AI chat error:", error);
          socket.emit("error", {
            error: "AI chat failed",
            details: error.message,
          });
        }
      });

      // 📌 Dynamic Notes Generation with HTML Output
      socket.on("generate-notes", async ({ title }) => {
        console.log(`📝 Generating notes for topic: ${title}`);

        try {
          const response = await axios({
            method: "post",
            url: "https://api.groq.com/openai/v1/chat/completions",
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            data: {
              model: GROQ_MODELS["notes-generation"], // Using the most powerful model available
              messages: [
                {
                  role: "system",
                  content: `You are an expert tutor creating interactive study notes. 
                            Ensure proper spacing between words in all content. `,
                },
                {
                  role: "user",
                  content: `Generate a well-structured, interactive lesson (at least 250 lines) for "${title}". `,
                },
              ],
              stream: true,
              max_tokens: 4096, // Adding a reasonable limit
            },
            responseType: "stream",
          });

          let notesContent = "";

          response.data.on("data", (chunk) => {
            const chunkStr = chunk.toString().trim();

            // Groq sends "data: " prefixed SSE format
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
                  console.log("Sending chunk:", responseText);
                  socket.emit("notes-update", responseText);
                }
              } catch (error) {
                console.error("❌ Error parsing chunk:", error, "Line:", line);
              }
            }
          });

          response.data.on("end", () => {
            console.log("✅ Notes generation completed.");
            socket.emit("notes-complete");
          });

          response.data.on("error", (error) => {
            console.error("❌ Stream error:", error);
            socket.emit("error", { error: "AI stream error" });
          });
        } catch (error) {
          // Enhanced error logging for notes generation
          if (error.response) {
            console.error("Notes Generation API Error:", {
              status: error.response.status,
              headers: error.response.headers,
            });

            // Handle model decommissioned errors
            if (
              error.response.data &&
              typeof error.response.data.pipe === "function"
            ) {
              let errorData = "";
              error.response.data.on("data", (chunk) => {
                errorData += chunk.toString();
              });
              error.response.data.on("end", () => {
                console.error("Notes Generation API Error Body:", errorData);
              });
            }
          }

          console.error("❌ Notes generation error:", error.message);
          socket.emit("error", {
            error: "Failed to generate notes",
            details: error.message,
          });
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
