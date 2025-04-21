import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import apiKeys from "../../../env"; // Ensure this file has your API key

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [topics, setTopics] = useState("");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleGenerateCourse = async () => {
    setLoading(true);
    setGeneratedCourse(null);

    const prompt = `
      Generate a structured course in JSON format, and nothing else.
  
      Example JSON:
      {
        "title": "Example Course",
        "description": "Brief description",
        "content": [
          {
            "title": "Module 1",
            "description": "Module description",
            "topics": [
              {
                "title": "Topic 1",
                "content": "Detailed explanation",
                "videoUrl": "optional video link"
              }
            ]
          }
        ]
      }
  
      - Title: ${courseName}
      - Topics: ${topics}
      - Programming Language: ${language}
      - Difficulty Level: ${difficulty}
  
      Strictly return only JSON.
    `;

    try {
      const genAI = new GoogleGenerativeAI(apiKeys.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(prompt);
      const aiResponse =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch)
        throw new Error("Failed to extract JSON from AI response.");

      let parsedCourse = JSON.parse(jsonMatch[0]);

      // 🔹 Remove quizId and assignments from the generated course
      parsedCourse.content = parsedCourse.content.map((module) => ({
        ...module,
        topics: module.topics.map((topic) => {
          const { quizId, assignments, ...filteredTopic } = topic; // Exclude quizId & assignments
          return filteredTopic;
        }),
      }));

      setGeneratedCourse(parsedCourse);
    } catch (error) {
      console.error("❌ Error generating course:", error);
      alert(error.message || "Failed to generate course.");
    }

    setLoading(false);
  };

  const handleAddCourse = async () => {
    if (!generatedCourse) return;
    setAdding(true);

    try {
      const response = await fetch("http://localhost:5000/api/course/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedCourse),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Course added successfully!");
        setGeneratedCourse(null); // Clear course after adding
      } else {
        alert(`Failed to add course: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Error adding course:", error);
      alert("Failed to add course. Check the console for details.");
    }

    setAdding(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Create a New Course</h2>

      <div className="mb-4">
        <label className="block font-medium">Course Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Topics (comma-separated)</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Programming Language</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Difficulty Level (1-5)</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          min="1"
          max="5"
        />
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        onClick={handleGenerateCourse}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Course"}
      </button>

      {generatedCourse && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">{generatedCourse.title}</h3>
          <p className="text-gray-600">{generatedCourse.description}</p>

          <h4 className="mt-4 font-semibold">Modules:</h4>
          <ul className="list-disc pl-6">
            {generatedCourse.content.map((module, index) => (
              <li key={index}>
                <strong>{module.title}</strong>: {module.description}
              </li>
            ))}
          </ul>

          <button
            className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            onClick={handleAddCourse}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add Course to System"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
