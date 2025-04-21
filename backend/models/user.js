import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clerkId: { type: String, required: true, unique: true }, // Clerk user ID
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Hashed
  role: { type: String, enum: ["student", "admin"], default: "student" },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
});

export default mongoose.model("User", UserSchema);
