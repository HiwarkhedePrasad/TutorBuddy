import Course from "../models/course.js";
import UserCourse from "../models/userCourse.js";

/**
 * Get all available courses
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all courses" });
  }
};

/**
 * Get courses enrolled by a specific user
 */

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    // Fetch course details including its content
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user is enrolled in the course
    const isEnrolled = userId
      ? await UserCourse.exists({ user: userId, course: courseId })
      : false;

    res.json({
      course,
      isEnrolled: !!isEnrolled, // Convert to boolean
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { title, description, category, instructor, content } = req.body;

    const newCourse = new Course({
      title,
      description,
      category,
      instructor: instructor || null, // Instructor is optional
      content: content || [], // Content is optional, default to empty
    });
    console.log("hello");
    const savedCourse = await newCourse.save();
    res.status(201).json({
      message: "Course added successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Failed to add course", details: error.message });
  }
};
