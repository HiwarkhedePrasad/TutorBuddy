import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashBoard from "./pages/dashboard";
import AllCourses from "./component/dynamic/allCourses";
import NotFound from "./component/static/notfound";
import CourseDetails from "./component/dynamic/courseDetails";
import MyCourses from "./component/dynamic/myCourses";
import AiTutorChat from "./component/dynamic/aiTutorChat";
import Notes from "./component/dynamic/note";
import Quiz from "./component/dynamic/quiz";
import Achievement from "./component/dynamic/achivement";
import Progress from "./component/dynamic/progressTracker";
import AddCourse from "./component/dynamic/addCourse";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />}>
          <Route path="courses" element={<AllCourses />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />{" "}
          {/* New route */}
          <Route path="add-course" element={<AddCourse />} />
          <Route path="*" element={<NotFound />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="progress" element={<Progress />} />
          <Route path="notes/:courseId" element={<Notes />} />
          <Route path="ai-tutor" element={<AiTutorChat />} />
          <Route path="assignments" element={<Quiz />} />
          <Route path="achievements" element={<Achievement />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
