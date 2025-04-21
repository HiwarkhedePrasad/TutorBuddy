import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCourseById } from "../../util/api"; // Adjust the path as needed
import { Star, User, Clock, BookOpen, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react"; // Import useUser
import front from "../../images/front.svg";
const CourseDetails = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const { user } = useUser();
  const clerkUserId = user?.id;

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        if (!clerkUserId) return; // Prevent fetching without authentication
        const data = await fetchCourseById(courseId, clerkUserId);
        setCourseData(data.course);

        setIsEnrolled(data.isEnrolled);
      } catch (err) {
        setError("Failed to fetch course details. Please try again.");
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    getCourseDetails();
  }, [courseId, clerkUserId]);

  const enrollUser = async () => {
    setEnrollmentStatus("loading");
    try {
      if (!clerkUserId) {
        throw new Error("User not authenticated.");
      }

      const response = await fetch("http://localhost:5000/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: clerkUserId, courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to enroll.");
      }

      setEnrollmentStatus("success");
      setIsEnrolled(true); // Update UI immediately after successful enrollment
    } catch (err) {
      setEnrollmentStatus("error");
      setError(err.message);
      console.error("Error enrolling user:", err);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
  if (!courseData)
    return <p className="text-center mt-6 text-red-500">Course not found.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img
            src={front}
            alt={courseData.title}
            className="w-full h-60 object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
              <Star className="text-yellow-500" />
              <span>{courseData.rating || "4.5"} Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
              <User className="text-blue-500" />
              <span>{courseData.studentsEnrolled} Students</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
              <Clock className="text-gray-500" />
              <span>{courseData.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
              <BookOpen className="text-green-500" />
              <span>{courseData.lessons?.length || 0} Lessons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {courseData.title}
          </h1>
          <p className="text-lg text-gray-700">{courseData.description}</p>
        </div>
        {isEnrolled ? (
          <div className="text-green-600 font-semibold">Enrolled</div>
        ) : (
          <button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition"
            onClick={enrollUser}
            disabled={enrollmentStatus === "loading" || !clerkUserId}
          >
            {enrollmentStatus === "loading"
              ? "Enrolling..."
              : clerkUserId
              ? "Enroll Now"
              : "Login to Enroll"}
          </button>
        )}
      </div>

      {enrollmentStatus === "success" && (
        <div className="mt-4 text-green-600">Enrollment successful!</div>
      )}

      {enrollmentStatus === "error" && (
        <div className="mt-4 text-red-600">{error}</div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Course Content</h2>
        {courseData.content?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
            <p className="text-gray-600 mb-4">{section.description}</p>
            <div className="space-y-4">
              {section.topics?.map((topic, topicIndex) => (
                <Link
                  key={topicIndex}
                  to={`/dashboard/notes/${courseData._id}`} // ✅ Navigates to notes page
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div>
                    <h4 className="text-lg font-medium mb-1">{topic.title}</h4>
                    <p className="text-gray-700">{topic.content}</p>
                  </div>
                  <ArrowRight className="text-blue-600 w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetails;
