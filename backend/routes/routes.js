import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  getAllCourses,
  getCourseDetails,
  addCourse,
} from "../controllers/courseController.js";
import { getUserProgress } from "../controllers/progressController.js";
import { getChatHistory } from "../controllers/aiController.js";
import { getAssignments } from "../controllers/assignmentController.js";
import { getUserAchievements } from "../controllers/achievementController.js";
import {
  enrollUserInCourse,
  getUserEnrolledCourses,
  getUserCourseEnrollment,
  updateUserCourseProgress,
} from "../controllers/userEnrolledCourses.js"; // Adjust path

const router = express.Router();

/* 🔹 AUTH ROUTES */
router.post("/auth/register", register);
router.post("/auth/login", login);

/* 🔹 COURSE ROUTES */
router.get("/courses/all", getAllCourses);
router.get("/course/:courseId/:userId?", getCourseDetails);
router.post("/course/add", addCourse);

/* 🔹 PROGRESS TRACKER ROUTES */
router.get("/progress/:userId", getUserProgress);

// /* 🔹 AI TUTOR CHAT ROUTE */
router.get("/ai/chat/:userId", getChatHistory);

/* 🔹 ASSIGNMENTS & QUIZZES ROUTES */
router.get("/assignments/:userId", getAssignments);

/* 🔹 ACHIEVEMENTS ROUTES */
router.get("/achievements/:userId", getUserAchievements);

//user Specfic courses
router.post("/enroll", enrollUserInCourse);
router.get("/user/:userId", getUserEnrolledCourses);
router.get("/:userId/:courseId", getUserCourseEnrollment);
router.put("/:userId/:courseId", updateUserCourseProgress);
export default router;
