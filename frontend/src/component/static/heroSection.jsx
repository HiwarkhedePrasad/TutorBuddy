import { useState, useEffect, useRef } from "react";
import heroImage from "../../images/heroImg.svg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true); // For blinking cursor
  const fullText = "Tutor Buddy.";
  const intervalIdRef = useRef(null);

  useEffect(() => {
    let index = 0;

    const typeText = () => {
      intervalIdRef.current = setInterval(() => {
        if (index <= fullText.length) {
          setText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(intervalIdRef.current);
          setTimeout(() => {
            index = 0;
            setText(""); // Clear text
            typeText(); // Restart typing effect
          }, 3000); // 3-sec delay before restarting
        }
      }, 250); // Slower typing speed
    };

    typeText();

    return () => clearInterval(intervalIdRef.current);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-left md:w-1/2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-red-500 mb-4">
            Welcome to <br />,
            <span className="text-yellow-500 whitespace-nowrap">
              {text}
              {showCursor && "|"}
            </span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-gray-700 mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md animate-fade-in">
            Your <span className="font-semibold">AI-powered tutor</span> for
            personalized learning. Get{" "}
            <span className="font-semibold italic">dynamically generated</span>{" "}
            educational content tailored to your needs.
          </p>

          <button
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition"
            aria-label="Start using Tutor Buddy"
          >
            <Link to="/dashboard"> Get Started</Link>
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            src={heroImage}
            alt="Tutor Buddy Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
