import mongoose from "mongoose";

const CourseContentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  modules: [
    {
      title: { type: String, required: true },
      description: { type: String },
      topics: [
        {
          title: { type: String, required: true },
          content: { type: String },
          videoUrl: { type: String },
          quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        },
      ],
    },
  ],
});

export default mongoose.model("CourseContent", CourseContentSchema);
