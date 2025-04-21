import learning from "../../images/ai-learning.svg";

const LearnWithAi = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-gray-100 p-8 rounded-lg shadow-lg">
      {/* Left Side - SVG */}
      <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
        <img
          src={learning}
          alt="Tutor Buddy Illustration"
          className="w-full max-w-md"
        />
      </div>

      {/* Right Side - Text */}
      <div className="md:w-2/3 text-center md:text-left mt-6 md:mt-0">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Learn Smarter with AI
        </h2>
        <p className="text-lg text-gray-600">
          Experience a **new era of learning** with AI-driven insights. Get
          personalized lessons, instant explanations, and interactive
          problem-solving, all tailored to your unique learning style.
        </p>
      </div>
    </div>
  );
};

export default LearnWithAi;
