import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Star, User } from "lucide-react";
import front from "../../images/front.svg";
const MyCourses = () => {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user?.id) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://tutorbuddy.onrender.com/api/user/${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses.");
        }
        const data = await response.json();
        setEnrolledCourses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchMyCourses();
  }, [user?.id]);

  if (loading) {
    return <p>Loading your courses...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (enrolledCourses.length === 0) {
    return <p>You are not enrolled in any courses yet.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {enrolledCourses.map((enrollment) => (
          <div key={enrollment._id} className="bg-white rounded-lg shadow p-4">
            <div className="h-32 bg-gray-100 mb-4 rounded-md">
              <img
                src={front}
                alt={enrollment.course[0].title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <Link
              to={`/dashboard/courses/${enrollment.course[0]._id}`} // Corrected Link
              className="block"
            >
              <h3 className="text-lg font-semibold mb-2">
                {enrollment.course[0].title}
              </h3>
              <p className="text-gray-600 mb-2">
                {enrollment.course[0].description.substring(0, 100)}...
              </p>
            </Link>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1">
                <Star className="text-yellow-500 w-4 h-4" />
                <span>{enrollment.course[0].rating || "4.5"}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="text-blue-500 w-4 h-4" />
                <span>{enrollment.course[0].studentsEnrolled || "26"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
