import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const AiTutorChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState("mistral");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showModelOptions, setShowModelOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useUser();

  const models = [
    {
      id: "mistral",
      name: "Mistral",
      description: "General knowledge & learning",
    },
    {
      id: "llama3",
      name: "Llama 3",
      description: "Advanced reasoning & problem-solving",
    },
    {
      id: "claude3",
      name: "Claude 3",
      description: "Deep conceptual explanations",
    },
  ];

  // Fetch previous chat history when the component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/ai/chat/${user.id}`
          );
          setMessages(
            response.data.messages.map((msg) => ({
              type: msg.role === "user" ? "user" : "ai",
              text: msg.content,
              ended: true,
            }))
          );
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };

    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    socket.on("aiResponse", (data) => {
      setIsTyping(true);
      setMessages((prevMessages) => {
        if (
          prevMessages.length > 0 &&
          prevMessages[prevMessages.length - 1].type === "ai" &&
          !prevMessages[prevMessages.length - 1].ended
        ) {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].text += data.word;
          return updatedMessages;
        } else {
          return [
            ...prevMessages,
            { type: "ai", text: data.word, ended: false },
          ];
        }
      });
    });

    socket.on("aiResponseEnd", () => {
      setIsTyping(false);
      setMessages((prevMessages) => {
        if (
          prevMessages.length > 0 &&
          prevMessages[prevMessages.length - 1].type === "ai"
        ) {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].ended = true;
          return updatedMessages;
        }
        return prevMessages;
      });
    });

    socket.on("error", (data) => {
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "error", text: data.error },
      ]);
    });

    return () => {
      socket.off("aiResponse");
      socket.off("aiResponseEnd");
      socket.off("error");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && user) {
      socket.emit("chatMessage", { userId: user.id, message, model });
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: message },
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageText = (text) => {
    // Simple markdown-like formatting for code blocks
    return text.split("```").map((block, index) => {
      if (index % 2 === 1) {
        // Code block
        return (
          <pre
            key={index}
            className="bg-gray-800 text-green-400 p-3 my-2 rounded-lg font-mono text-sm overflow-x-auto"
          >
            {block}
          </pre>
        );
      }
      return <span key={index}>{block}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 rounded-lg overflow-hidden shadow-2xl border border-indigo-500/30">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">TuttorBuddy AI</h2>
            <p className="text-xs opacity-80">
              Personalized Learning Assistant
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowModelOptions(!showModelOptions)}
            className="bg-blue-800 hover:bg-blue-700 p-2 rounded-md text-sm flex items-center"
          >
            <span className="mr-1">Model: {model}</span>
            <span>{showModelOptions ? "▲" : "▼"}</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-blue-700 hover:bg-blue-600 p-2 rounded-md text-lg"
          >
            {isExpanded ? "—" : "□"}
          </button>
        </div>
      </div>

      {/* Model Selection Dropdown */}
      {showModelOptions && (
        <div className="bg-gray-800 p-3 border-b border-gray-700">
          <div className="grid grid-cols-1 gap-2">
            {models.map((m) => (
              <button
                key={m.id}
                className={`p-2 rounded-md flex items-center justify-between ${
                  model === m.id
                    ? "bg-indigo-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => {
                  setModel(m.id);
                  setShowModelOptions(false);
                }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      model === m.id ? "bg-green-400" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="font-medium">{m.name}</span>
                </div>
                <span className="text-xs text-gray-300">{m.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isExpanded && (
        <>
          {/* Chat Messages Container with futuristic styling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-850 bg-opacity-70">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-xl font-semibold mb-2">
                  Welcome to TuttorBuddy AI
                </h3>
                <p className="max-w-md text-gray-400">
                  I'm your personal learning assistant. Ask me questions about
                  any subject, request help with homework, or explore complex
                  concepts together.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  {msg.type !== "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 shadow-glow">
                      <span className="text-xs">AI</span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                      msg.type === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-blue"
                        : msg.type === "error"
                        ? "bg-red-900/70 text-white border border-red-600"
                        : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700/50"
                    }`}
                  >
                    <div className="text-sm">{formatMessageText(msg.text)}</div>
                    {msg.type === "ai" && !msg.ended && (
                      <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>
                    )}
                  </div>
                  {msg.type === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2 shadow-md">
                      <span className="text-xs">You</span>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="px-4 py-2 text-sm text-blue-300 flex items-center">
              <div className="flex space-x-1 mr-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"></div>
              </div>
              <span>EduAssist is formulating response...</span>
            </div>
          )}

          {/* Message Input Box */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
                title="Clear conversation"
              >
                🗑️
              </button>
              <textarea
                className="flex-1 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-sm"
                placeholder="Ask anything about your studies..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                style={{ resize: "none" }}
              />
              <button
                className={`p-3 rounded-full transition-all duration-200 ${
                  message.trim()
                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white shadow-lg"
                    : "bg-gray-700 text-gray-400"
                }`}
                onClick={sendMessage}
                disabled={!message.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Shift+Enter for new line</span>
              <span>Supports code formatting with ```</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiTutorChat;
