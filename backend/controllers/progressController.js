import Progress from "../models/process.js";

export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.find({ user: userId }).populate("course");
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { userId, courseId, percentage } = req.body;
    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = new Progress({ user: userId, course: courseId, percentage });
    } else {
      progress.percentage = percentage;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress" });
  }
};
