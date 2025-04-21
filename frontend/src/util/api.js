import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust based on your backend URL

export const fetchAllCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const fetchCourseDetails = async (courseId, userId = "") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/course/${courseId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
};

export const fetchUserProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/progress/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
};

export const fetchAssignments = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

export const fetchUserAchievements = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/achievements/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
};

export const registerUser = async (userInfo, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send Clerk token
      },
      body: JSON.stringify(userInfo),
    });

    return await response.json();
  } catch (error) {
    console.error("User registration failed", error);
  }
};

export const fetchCourseById = async (courseId, userId) => {
  try {
    console.log(courseId, userId);
    const response = await axios.get(
      `${API_BASE_URL}/course/${courseId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

// Function to fetch notes from Ollama
export const fetchNotesFromOllama = async (topicTitle) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic: topicTitle }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notes from Ollama.");
    }

    const data = await response.json();
    return data.notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};
