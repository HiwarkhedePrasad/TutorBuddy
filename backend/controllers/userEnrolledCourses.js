import UserCourse from "../models/userCourse.js"; // Adjust path as needed
import Course from "../models/course.js"; //Importing the Course model.

// Controller function to enroll a user in a course
export const enrollUserInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body; // Assuming userId and courseId are sent in the request body
    console.log(req.body);
    // Validation: Check if userId and courseId are provided
    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ message: "User ID and Course ID are required." });
    }

    // Validation: Check if the course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Validation: Check if the user is already enrolled
    const existingEnrollment = await UserCourse.findOne({
      user: userId,
      course: courseId,
    });
    if (existingEnrollment) {
      return res
        .status(409)
        .json({ message: "User is already enrolled in this course." }); // 409 Conflict
    }

    // Create a new UserCourse document
    const newUserCourse = new UserCourse({
      user: userId,
      course: courseId,
    });

    // Save the new enrollment
    await newUserCourse.save();

    res.status(201).json({
      message: "User enrolled successfully.",
      enrollment: newUserCourse,
    }); // 201 Created
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Controller function to get all courses a user is enrolled in.
export const getUserEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is sent as a route parameter

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const enrolledCourses = await UserCourse.find({ user: userId }).populate(
      "course"
    ); // Populate the course field

    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error("Error fetching user enrolled courses:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Controller function to get a specific user course enrollment.
export const getUserCourseEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.params; // Assuming userId and courseId are sent as route parameters.

    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ message: "User ID and Course ID are required." });
    }

    const enrollment = await UserCourse.findOne({
      user: userId,
      course: courseId,
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    console.error("Error fetching user course enrollment:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Controller function to update user course progress.
export const updateUserCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { progress, completed } = req.body;

    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ message: "User ID and Course ID are required." });
    }

    const updatedEnrollment = await UserCourse.findOneAndUpdate(
      { user: userId, course: courseId },
      { progress, completed },
      { new: true } // Return the updated document
    ).populate("course");

    if (!updatedEnrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    res.status(200).json(updatedEnrollment);
  } catch (error) {
    console.error("Error updating user course progress:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
