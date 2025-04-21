import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      fileUrl: { type: String },
      submittedAt: { type: Date, default: Date.now },
      grade: { type: String },
    },
  ],
});

export default mongoose.model("Assignment", AssignmentSchema);
