import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  dateEarned: { type: Date, default: Date.now },
});

export default mongoose.model("Achievement", AchievementSchema);
