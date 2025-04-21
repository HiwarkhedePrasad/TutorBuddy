import AiChat from "../models/aiChat.js"; // Import AI chat model

// API to fetch chat history for a user
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch user's chat history
    const chatHistory = await AiChat.findOne({ user: userId });

    if (!chatHistory) {
      return res.status(200).json({ messages: [] }); // Return empty chat history
    }

    res.status(200).json({ messages: chatHistory.messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
