import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedLessons: [{ type: String }], // Store lesson titles or IDs
  progressPercentage: { type: Number, default: 0 },
});

export default mongoose.model("Progress", ProgressSchema);
