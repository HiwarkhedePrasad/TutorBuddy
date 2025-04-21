import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "ai"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const AiChat = mongoose.model("AiChat", aiChatSchema);

export default AiChat;
