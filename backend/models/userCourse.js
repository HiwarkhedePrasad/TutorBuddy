import mongoose from "mongoose";

const UserCourseSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Store Clerk userId as a string

  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  ],
  progress: { type: Number, default: 0 }, // Progress percentage (0-100)
  enrolledAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

export default mongoose.model("UserCourse", UserCourseSchema);
