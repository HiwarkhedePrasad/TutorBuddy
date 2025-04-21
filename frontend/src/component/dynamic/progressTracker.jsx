import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const progressData = [
  {
    title: "Complete Python Programming",
    data: [
      { name: "Completed", value: 10, color: "#4CAF50" },
      { name: "Remaining", value: 90, color: "#E0E0E0" },
    ],
  },
  {
    title: "Class 10th Chemistry",
    data: [
      { name: "Completed", value: 85, color: "#2196F3" },
      { name: "Remaining", value: 15, color: "#E0E0E0" },
    ],
  },
];

const Progress = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Progress Tracker
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {progressData.map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 w-72">
            <h2 className="text-lg font-bold text-gray-800 text-center mb-2">
              {item.title}
            </h2>
            <PieChart width={200} height={200}>
              <Pie
                data={item.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
              >
                {item.data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
