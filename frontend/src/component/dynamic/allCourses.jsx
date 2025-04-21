import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllCourses } from "../../util/api";
import { Star, User, Clock, Plus } from "lucide-react";
import mistral from "../../images/mistral.svg";
import front from "../../images/front.svg";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      const data = await fetchAllCourses();
      setCourses(data);
    };
    getCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Courses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* ✅ Add Course Card */}
        <div
          className="bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-200 transition"
          onClick={() => navigate("/dashboard/add-course")}
        >
          <Plus className="w-12 h-12 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 mt-2">
            Add Course
          </h3>
        </div>

        {/* ✅ Display Existing Courses */}
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={front}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{course.description}</p>

              <div className="flex items-center gap-2 mt-3">
                <img
                  src={mistral}
                  alt={course.instructor?.name}
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-sm text-gray-700">
                  {course.instructor?.name}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course.rating || "4.5"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-blue-500" />
                  <span>{course.studentsEnrolled} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                <Link to={`/dashboard/courses/${course._id}`}>View Course</Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
