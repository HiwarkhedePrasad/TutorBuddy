import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  videoUrl: String,
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: false,
  },
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  topics: [TopicSchema],
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: false,
  },
  quizzes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: false },
  ],
  assignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: false,
    },
  ],
  content: [ModuleSchema], // Organized structure with modules and topics
});

export default mongoose.model("Course", CourseSchema);
