import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Outlet, NavLink, Link } from "react-router-dom";
import {
  Book,
  Folders,
  BarChart,
  MessageCircle,
  Award,
  ScanFace,
  Menu,
  X,
} from "lucide-react";

// Components
const SidebarNavItem = ({ to, icon: Icon, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded cursor-pointer ${
          isActive ? "bg-gray-300" : ""
        }`
      }
    >
      <Icon size={20} />
      <span className="text-sm md:text-base">{children}</span>
    </NavLink>
  );
};

const UserSection = ({ isSignedIn, user }) => (
  <div className="flex items-center gap-2 p-3 border-t border-gray-200">
    {isSignedIn ? (
      <>
        <UserButton />
        <span className="text-sm font-medium">{user?.fullName}</span>
      </>
    ) : (
      <SignInButton mode="modal">
        <button className="flex items-center gap-2 text-blue-600 font-medium">
          <ScanFace size={20} />
          Login
        </button>
      </SignInButton>
    )}
  </div>
);

const Sidebar = ({ isSignedIn, user, isOpen, onClose }) => (
  <div
    className={`
    fixed inset-y-0 left-0 z-50
    w-64 transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    md:relative md:translate-x-0
  `}
  >
    <div className="flex flex-col h-full bg-white shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-600"
        >
          <Book size={24} />
          <span>Tutor Buddy</span>
        </Link>
        <button
          className="md:hidden text-gray-500 p-1"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SidebarNavItem to="courses" icon={Book}>
          All Courses
        </SidebarNavItem>
        <SidebarNavItem to="my-courses" icon={Folders}>
          My Courses
        </SidebarNavItem>
        <SidebarNavItem to="progress" icon={BarChart}>
          Progress Tracker
        </SidebarNavItem>
        <SidebarNavItem to="ai-tutor" icon={MessageCircle}>
          AI Tutor Chat
        </SidebarNavItem>
        <SidebarNavItem to="achievements" icon={Award}>
          Achievements
        </SidebarNavItem>
      </nav>

      <UserSection isSignedIn={isSignedIn} user={user} />
    </div>
  </div>
);

// Custom hook for user registration
const useUserRegistration = (isSignedIn, user) => {
  useEffect(() => {
    if (isSignedIn && user) {
      fetch("https://tutorbuddy.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User registered:", data))
        .catch((error) => console.error("Error:", error));
    }
  }, [isSignedIn, user]);
};

// Main component
const Dashboard = () => {
  document.title =
    "Dashboard || Tutor Buddy - (A digital-first education platform)";

  const { isSignedIn, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use custom hook for registration
  useUserRegistration(isSignedIn, user);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest("[data-sidebar]") &&
        !event.target.closest("[data-sidebar-toggle]")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Semi-transparent overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div data-sidebar className="md:block">
        <Sidebar
          isSignedIn={isSignedIn}
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content area with mobile menu button */}
      <div className="flex-1 flex flex-col relative">
        {/* Top bar for mobile that shows menu button */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-200 bg-white">
          <button
            data-sidebar-toggle
            className="text-gray-700 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 font-bold text-lg text-blue-600">
            Tutor Buddy
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
