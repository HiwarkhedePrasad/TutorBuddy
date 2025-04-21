import React, { useState } from "react";

const achievements = [
  {
    id: 1,
    title: "Python Warrior",
    unlocked: true,
    category: "Fundamentals",
    description: "Mastered Python basics including syntax and core concepts",
  },
  {
    id: 2,
    title: "Loop Master",
    unlocked: true,
    category: "Fundamentals",
    description: "Demonstrated proficiency with all looping structures",
  },
  {
    id: 3,
    title: "OOP Ninja",
    unlocked: false,
    category: "Fundamentals",
    description:
      "Created complex applications using object-oriented principles",
  },
  {
    id: 4,
    title: "Data Science Explorer",
    unlocked: false,
    category: "Data Science",
    description: "Completed introductory data science challenges",
  },
  {
    id: 5,
    title: "Algorithmic Thinker",
    unlocked: false,
    category: "Algorithms",
    description: "Solved problems using efficient algorithmic approaches",
  },
  {
    id: 6,
    title: "Recursion Pro",
    unlocked: false,
    category: "Algorithms",
    description: "Implemented elegant recursive solutions to complex problems",
  },
  {
    id: 7,
    title: "Bug Slayer",
    unlocked: false,
    category: "DevOps",
    description: "Debugged and fixed 20+ complex code issues",
  },
  {
    id: 8,
    title: "Regex Master",
    unlocked: false,
    category: "Tools",
    description: "Created advanced pattern matching expressions",
  },
  {
    id: 9,
    title: "Flask Developer",
    unlocked: false,
    category: "Web",
    description: "Built and deployed a Flask web application",
  },
  {
    id: 10,
    title: "Django Expert",
    unlocked: false,
    category: "Web",
    description: "Created a full-featured Django web application",
  },
  {
    id: 11,
    title: "Pandas Guru",
    unlocked: false,
    category: "Data Science",
    description: "Manipulated complex datasets with pandas",
  },
  {
    id: 12,
    title: "Machine Learning Beginner",
    unlocked: false,
    category: "AI/ML",
    description: "Implemented your first ML models",
  },
  {
    id: 13,
    title: "Deep Learning Enthusiast",
    unlocked: false,
    category: "AI/ML",
    description: "Built neural networks for complex tasks",
  },
  {
    id: 14,
    title: "Data Visualizer",
    unlocked: false,
    category: "Data Science",
    description: "Created insightful data visualizations",
  },
  {
    id: 15,
    title: "SQL with Python",
    unlocked: false,
    category: "Databases",
    description: "Connected Python applications to SQL databases",
  },
  {
    id: 16,
    title: "FastAPI Starter",
    unlocked: false,
    category: "Web",
    description: "Built RESTful APIs with FastAPI",
  },
  {
    id: 17,
    title: "Concurrency King",
    unlocked: false,
    category: "Advanced",
    description: "Implemented concurrent programming patterns",
  },
  {
    id: 18,
    title: "Threading Pro",
    unlocked: false,
    category: "Advanced",
    description: "Built multi-threaded Python applications",
  },
  {
    id: 19,
    title: "Asynchronous Master",
    unlocked: false,
    category: "Advanced",
    description: "Used async/await for efficient I/O operations",
  },
  {
    id: 20,
    title: "Web Scraper",
    unlocked: false,
    category: "Tools",
    description: "Built tools to extract data from websites",
  },
  {
    id: 21,
    title: "AI Coder",
    unlocked: false,
    category: "AI/ML",
    description: "Used AI to assist in coding tasks",
  },
  {
    id: 22,
    title: "Cybersecurity Learner",
    unlocked: false,
    category: "Security",
    description: "Implemented security best practices in code",
  },
  {
    id: 23,
    title: "Python Automator",
    unlocked: false,
    category: "Tools",
    description: "Automated repetitive tasks with Python",
  },
  {
    id: 24,
    title: "GUI Designer (Tkinter)",
    unlocked: false,
    category: "Desktop",
    description: "Created desktop applications with Tkinter",
  },
  {
    id: 25,
    title: "Unit Test Pro",
    unlocked: false,
    category: "DevOps",
    description: "Achieved high test coverage in your projects",
  },
  {
    id: 26,
    title: "Code Formatter",
    unlocked: false,
    category: "Tools",
    description: "Maintained clean code standards across projects",
  },
  {
    id: 27,
    title: "Hackerrank Python 5⭐",
    unlocked: false,
    category: "Challenges",
    description: "Earned 5-star rating on Hackerrank Python track",
  },
  {
    id: 28,
    title: "LeetCode 100 Problems",
    unlocked: false,
    category: "Challenges",
    description: "Solved 100+ LeetCode problems in Python",
  },
  {
    id: 29,
    title: "Competitive Programmer",
    unlocked: false,
    category: "Challenges",
    description: "Participated in coding competitions",
  },
  {
    id: 30,
    title: "Full-Stack Python Dev",
    unlocked: false,
    category: "Web",
    description: "Built full-stack applications with Python",
  },
  {
    id: 31,
    title: "Graph Theory Specialist",
    unlocked: false,
    category: "Algorithms",
    description: "Implemented advanced graph algorithms",
  },
  {
    id: 32,
    title: "Scripting Expert",
    unlocked: false,
    category: "Tools",
    description: "Created powerful automation scripts",
  },
  {
    id: 33,
    title: "Pygame Creator",
    unlocked: false,
    category: "Games",
    description: "Developed games using Pygame",
  },
  {
    id: 34,
    title: "Blockchain with Python",
    unlocked: false,
    category: "Advanced",
    description: "Built blockchain applications with Python",
  },
  {
    id: 35,
    title: "IOT with Python",
    unlocked: false,
    category: "IoT",
    description: "Connected Python to IoT devices",
  },
  {
    id: 36,
    title: "Cryptography Beginner",
    unlocked: false,
    category: "Security",
    description: "Implemented cryptographic algorithms",
  },
  {
    id: 37,
    title: "Bioinformatics Pythonist",
    unlocked: false,
    category: "Specialized",
    description: "Used Python for biological data analysis",
  },
  {
    id: 38,
    title: "API Developer",
    unlocked: false,
    category: "Web",
    description: "Designed and implemented robust APIs",
  },
  {
    id: 39,
    title: "Fast Typer (Python)",
    unlocked: false,
    category: "Skills",
    description: "Achieved high typing speed with Python syntax",
  },
  {
    id: 40,
    title: "Coding Streak 30 Days",
    unlocked: false,
    category: "Habits",
    description: "Coded in Python for 30 consecutive days",
  },
  {
    id: 41,
    title: "Python Debugging Pro",
    unlocked: false,
    category: "DevOps",
    description: "Mastered debugging techniques and tools",
  },
  {
    id: 42,
    title: "Numpy Genius",
    unlocked: false,
    category: "Data Science",
    description: "Optimized numerical operations with NumPy",
  },
  {
    id: 43,
    title: "Matplotlib Visual Master",
    unlocked: false,
    category: "Data Science",
    description: "Created publication-quality visualizations",
  },
  {
    id: 44,
    title: "Cloud Computing with Python",
    unlocked: false,
    category: "Cloud",
    description: "Deployed Python applications to the cloud",
  },
  {
    id: 45,
    title: "Python & AWS",
    unlocked: false,
    category: "Cloud",
    description: "Utilized AWS services with Python",
  },
  {
    id: 46,
    title: "Python & GCP",
    unlocked: false,
    category: "Cloud",
    description: "Integrated Python with Google Cloud Platform",
  },
  {
    id: 47,
    title: "Python & Azure",
    unlocked: false,
    category: "Cloud",
    description: "Built Python applications on Microsoft Azure",
  },
  {
    id: 48,
    title: "Generative AI with Python",
    unlocked: false,
    category: "AI/ML",
    description: "Created generative AI models",
  },
  {
    id: 49,
    title: "IoT Security with Python",
    unlocked: false,
    category: "Security",
    description: "Implemented security for IoT devices",
  },
  {
    id: 50,
    title: "Python Grandmaster",
    unlocked: false,
    category: "Mastery",
    description: "Achieved comprehensive Python expertise",
  },
];

// Get unique categories
const categories = ["All", ...new Set(achievements.map((a) => a.category))];

const Achievement = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesCategory =
      selectedCategory === "All" || achievement.category === selectedCategory;
    const matchesSearch = achievement.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalUnlocked = achievements.filter((a) => a.unlocked).length;
  const progressPercentage = (totalUnlocked / achievements.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-4 py-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <span className="mr-2">🏆</span> Python Mastery Achievements
          </h1>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>
                {totalUnlocked} of {achievements.length} unlocked
              </span>
              <span>{progressPercentage.toFixed(1)}% complete</span>
            </div>
            <div className="h-2 w-full bg-indigo-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search achievements..."
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar pb-2 md:pb-0 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className={`aspect-square relative rounded-xl shadow-md flex flex-col items-center justify-center p-3 cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                {achievement.unlocked ? (
                  <span className="text-2xl">🏅</span>
                ) : (
                  <span className="text-2xl opacity-50">🔒</span>
                )}
              </div>
              <h3
                className={`text-xs md:text-sm font-medium text-center ${
                  !achievement.unlocked && "opacity-70"
                }`}
              >
                {achievement.title}
              </h3>
              <div
                className={`absolute top-1.5 right-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  achievement.unlocked
                    ? "bg-green-400 text-green-900"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {achievement.unlocked ? "Earned" : "Locked"}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-700">
              No achievements found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div
              className={`p-4 ${
                selectedAchievement.unlocked
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {selectedAchievement.title}
                </h3>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="text-sm mt-1">{selectedAchievement.category}</div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center text-4xl mb-4">
                {selectedAchievement.unlocked ? "🏅" : "🔒"}
              </div>
              <p className="text-gray-700">{selectedAchievement.description}</p>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {selectedAchievement.unlocked
                    ? "Congratulations! You've mastered this skill."
                    : "Complete related exercises to unlock this achievement."}
                </div>

                <button
                  className={`w-full mt-4 py-2 rounded-lg font-medium ${
                    selectedAchievement.unlocked
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {selectedAchievement.unlocked
                    ? "View Certificate"
                    : "View Learning Path"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievement;
