import Assignment from "../models/assignment.js";

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("course");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { userId, courseId, content } = req.body;
    const assignment = new Assignment({
      user: userId,
      course: courseId,
      content,
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit assignment" });
  }
};
