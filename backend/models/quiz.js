import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: { type: String, required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

export default mongoose.model("Quiz", QuizSchema);
