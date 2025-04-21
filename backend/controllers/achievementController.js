import Achievement from "../models/achivement.js";

export const getAchievements = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await Achievement.find({ user: userId });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
};

export const addAchievement = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const achievement = new Achievement({ user: userId, title, description });
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ error: "Failed to add achievement" });
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from request parameters
    const achievements = await Achievement.find({ user: userId }); // Fetch achievements for the user
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user achievements" });
  }
};

/**
 * Add a new achievement for a user
 */
