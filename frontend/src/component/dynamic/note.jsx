import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourseById } from "../../util/api";
import { io } from "socket.io-client";
import axios from "axios";
import {
  Menu,
  X,
  BookOpen,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// Socket connection - create once at module level
const socket = io("wss://tutorbuddy.onrender.com");

// Components
const CourseSidebar = ({
  courseContent,
  onTopicSelect,
  isOpen,
  onClose,
  isMobile,
}) => {
  // Track expanded sections for accordion behavior
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div
      className={`
      fixed top-0 right-0 z-40 bg-white border-l shadow-lg p-4 overflow-y-auto
      transition-all duration-300 ease-in-out
      ${isMobile ? "w-full" : "w-64 lg:w-1/4"}
      ${isOpen ? "translate-x-0" : "translate-x-full"}
      ${isMobile ? "h-full" : ""}
      lg:translate-x-0 lg:static lg:h-screen
    `}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Course Structure</h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {courseContent.length === 0 ? (
        <p className="text-gray-500">Loading course content...</p>
      ) : (
        <ul className="space-y-2">
          {courseContent.map((section) => (
            <li key={section._id} className="border-b pb-2">
              <div
                className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => toggleSection(section._id)}
              >
                <h3 className="font-bold">{section.title}</h3>
                {expandedSections[section._id] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>

              {expandedSections[section._id] && (
                <ul className="ml-4 mt-1 space-y-1">
                  {section.topics.map((topic) => (
                    <li
                      key={topic._id}
                      className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                      onClick={() => {
                        onTopicSelect(topic);
                        if (isMobile) onClose();
                      }}
                    >
                      <span>{topic.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Voice settings component
const VoiceSettings = ({
  voiceOptions,
  selectedVoice,
  onVoiceChange,
  speechRate,
  onRateChange,
}) => (
  <div className="border rounded-md p-3 mt-4 bg-white shadow-sm">
    <h3 className="font-medium mb-2 text-gray-700">Voice Settings</h3>

    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Voice</label>
        <select
          value={selectedVoice || ""}
          onChange={onVoiceChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Default Voice</option>
          {voiceOptions.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">
          Speed: {speechRate.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechRate}
          onChange={onRateChange}
          className="w-full"
        />
      </div>
    </div>
  </div>
);

// Enhanced text selection component
const SelectionPopover = ({
  showPopover,
  popoverPosition,
  handleShowContextMenu,
  isVisible,
}) => {
  if (!showPopover || !isVisible) return null;

  return (
    <div
      className="fixed bg-blue-600 text-white px-3 py-1 rounded-md shadow-lg z-50"
      style={{
        top: popoverPosition.y - 40, // Position above the selection
        left: popoverPosition.x,
      }}
    >
      <button
        className="text-sm font-medium"
        onClick={handleShowContextMenu}
      >
        Ask AI
      </button>
    </div>
  );
};

const NotesContent = ({
  selectedTopic,
  notes,
  loading,
  onStartQuiz,
  onToggleSpeech,
  isSpeaking,
  voiceOptions,
  selectedVoice,
  onVoiceChange,
  speechRate,
  onRateChange,
  showVoiceSettings,
  toggleVoiceSettings,
  onSelectionChange,
}) => (
  <div 
    className="w-full lg:w-3/4 p-4 lg:p-6 bg-gray-100 max-h-screen overflow-y-auto"
    onMouseUp={onSelectionChange}
    onTouchEnd={onSelectionChange}
  >
    {selectedTopic ? (
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{selectedTopic.title}</h1>

        {loading && <p className="text-gray-500 mt-2">Generating notes...</p>}

        {/* Real-time note display - always show, even while loading */}
        <div className="mt-4 text-gray-700 whitespace-pre-line">{notes}</div>

        {!loading && notes && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onStartQuiz}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <BookOpen size={18} /> Start Quiz
              </button>

              <button
                onClick={onToggleSpeech}
                className={`${
                  isSpeaking
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                } 
                  text-white px-4 py-2 rounded flex items-center gap-2`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX size={18} /> Stop Reading
                  </>
                ) : (
                  <>
                    <Volume2 size={18} /> Read Aloud
                  </>
                )}
              </button>

              <button
                onClick={toggleVoiceSettings}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Voice Settings
              </button>
            </div>

            {showVoiceSettings && (
              <VoiceSettings
                voiceOptions={voiceOptions}
                selectedVoice={selectedVoice}
                onVoiceChange={onVoiceChange}
                speechRate={speechRate}
                onRateChange={onRateChange}
              />
            )}
          </div>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600">Select a topic to view notes.</p>
      </div>
    )}
  </div>
);

const AIContextMenu = ({
  contextMenu,
  selectedText,
  userQuestion,
  setUserQuestion,
  aiResponse,
  loadingResponse,
  handleAskAI,
  closeContextMenu,
  isMobile,
}) => (
  <div
    className="fixed bg-white shadow-lg border rounded-lg p-4 z-50 w-11/12 max-w-md ai-context-menu"
    style={{
      top: isMobile ? "50%" : contextMenu.y,
      left: isMobile ? "50%" : Math.min(contextMenu.x, window.innerWidth - 320),
      transform: isMobile ? "translate(-50%, -50%)" : "none",
    }}
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold">AI Question Assistant</h3>
      <button onClick={closeContextMenu} className="text-gray-500">
        <X size={18} />
      </button>
    </div>

    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
      Selected: "{selectedText}"
    </p>

    <input
      type="text"
      className="border p-2 w-full rounded-md"
      placeholder="Ask something..."
      value={userQuestion}
      onChange={(e) => setUserQuestion(e.target.value)}
    />

    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-2"
      onClick={handleAskAI}
    >
      Ask AI
    </button>

    {loadingResponse && (
      <div className="mt-2 text-center">
        <p className="text-gray-500">Thinking...</p>
      </div>
    )}

    {aiResponse && (
      <div className="mt-2 text-gray-700 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded">
        {aiResponse}
      </div>
    )}
  </div>
);

// Helper function to clean text for speech synthesis
const cleanTextForSpeech = (text) => {
  if (!text) return "";

  // Replace asterisks (for bold/italic in markdown)
  let cleanedText = text.replace(/\*/g, "");

  // Replace special characters that shouldn't be pronounced
  cleanedText = cleanedText.replace(/[#_~`]/g, "");

  // Replace code blocks with appropriate pauses and descriptions
  cleanedText = cleanedText.replace(/```(.*?)```/gs, "code example");

  // Replace newlines with spaces or pauses
  cleanedText = cleanedText.replace(/\n\n+/g, ". "); // Multiple newlines as period + pause
  cleanedText = cleanedText.replace(/\n/g, " "); // Single newline as space

  // Fix spacing around punctuation
  cleanedText = cleanedText.replace(/\s+([.,;:!?])/g, "$1");

  // Remove URLs or replace with "link"
  cleanedText = cleanedText.replace(/https?:\/\/[^\s]+/g, "link");

  // Add SSML pauses after sentences for more natural reading
  cleanedText = cleanedText.replace(/([.!?])\s+/g, "$1 ");

  return cleanedText;
};

// Main component
const Notes = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseContent, setCourseContent] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [notes, setNotes] = useState(""); // Store generated notes
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Speech synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speechRate, setSpeechRate] = useState(1.0);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const speechSynthesisRef = useRef(null);

  // Text selection state
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const popoverTimerRef = useRef(null);

  // AI Context Menu State
  const [contextMenu, setContextMenu] = useState(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  // Content container ref for calculating correct positions
  const contentRef = useRef(null);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get available voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);

        // Try to find and set a more natural voice as default
        const preferredVoices = voices.filter(
          (voice) =>
            voice.name.includes("Natural") ||
            voice.name.includes("Premium") ||
            voice.name.includes("Neural")
        );

        if (preferredVoices.length > 0) {
          setSelectedVoice(preferredVoices[0].name);
        }
      }
    };

    // Load available voices
    loadVoices();

    // Chrome requires this event for voices to be loaded
    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("onvoiceschanged" in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Fetch course content
  useEffect(() => {
    const getCourseContent = async () => {
      try {
        const data = await fetchCourseById(courseId);
        setCourseContent(data?.course?.content || []);
      } catch (error) {
        console.error("Failed to fetch course content:", error);
      }
    };
    getCourseContent();
  }, [courseId]);

  // Socket.io event listeners for real-time note generation
  useEffect(() => {
    const handleNotesUpdate = (chunk) => {
      setNotes((prev) => prev + chunk); // Real-time streaming - append each chunk
    };

    const handleNotesComplete = () => {
      setLoading(false); // Notes generation completed
    };

    // Set up listeners
    socket.on("notes-update", handleNotesUpdate);
    socket.on("notes-complete", handleNotesComplete);

    // Clean up listeners on unmount
    return () => {
      socket.off("notes-update", handleNotesUpdate);
      socket.off("notes-complete", handleNotesComplete);
    };
  }, []);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleTopicClick = (topic) => {
    // Cancel any ongoing speech when changing topics
    if (isSpeaking) {
      handleToggleSpeech();
    }

    setSelectedTopic(topic);
    setNotes(""); // Reset notes
    setLoading(true); // Show loading while generating notes
    socket.emit("generate-notes", topic); // Start note generation
  };

  const handleStartQuiz = () => {
    if (selectedTopic) {
      navigate(`/dashboard/assignments`);
    }
  };

  // Voice settings handlers
  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);

    // If currently speaking, restart with new voice
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        speakText(notes);
      }, 100);
    }
  };

  const handleRateChange = (e) => {
    setSpeechRate(parseFloat(e.target.value));

    // If currently speaking, restart with new rate
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        speakText(notes);
      }, 100);
    }
  };

  const toggleVoiceSettings = () => {
    setShowVoiceSettings(!showVoiceSettings);
  };

  // Text-to-speech functionality
  const speakText = (text) => {
    const cleanedText = cleanTextForSpeech(text);

    if (cleanedText) {
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(cleanedText);

      // Set voice if selected
      if (selectedVoice) {
        const voice = availableVoices.find((v) => v.name === selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }

      // Set speech rate
      utterance.rate = speechRate;
      utterance.pitch = 1.0;

      // Add pauses between sentences for more natural reading
      utterance.addEventListener("boundary", (event) => {
        if (event.name === "sentence") {
          // Small pause at sentence boundaries
          const currentTime = event.elapsedTime;
          setTimeout(() => {}, 250);
        }
      });

      // Event handler for when speech ends
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      // Store reference to cancel if needed
      speechSynthesisRef.current = utterance;

      // Start speaking
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    speakText(notes);
  };

  // Enhanced text selection handling
  const handleSelectionChange = (event) => {
    // Clear any existing timers
    if (popoverTimerRef.current) {
      clearTimeout(popoverTimerRef.current);
    }

    // Get the current selection
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      setSelectedText(text);

      // Get position for the popover - works for both touch and mouse
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate position - center horizontally, above the selection
      const x = Math.max(0, rect.x + rect.width / 2 - 40); // Center the popover
      const y = Math.max(40, rect.y); // Ensure it's not off the top of the screen

      setPopoverPosition({ x, y });
      setShowPopover(true);
      
      // Show popover after a short delay to improve UX
      popoverTimerRef.current = setTimeout(() => {
        setIsPopoverVisible(true);
      }, 200);

    } else {
      // Hide popover after short delay (allows clicking the popover)
      popoverTimerRef.current = setTimeout(() => {
        setShowPopover(false);
        setIsPopoverVisible(false);
      }, 300);
    }
  };

  // Show context menu when Ask AI button in popover is clicked
  const handleShowContextMenu = () => {
    setContextMenu({
      x: popoverPosition.x,
      y: popoverPosition.y + 40
    });
    setShowPopover(false);
  };

  const handleRightClick = (event) => {
    if (!isMobile) {
      event.preventDefault();
      const selection = window.getSelection().toString().trim();
      if (selection) {
        setSelectedText(selection);
        setContextMenu({
          x: event.clientX,
          y: event.clientY,
        });
      }
    }
  };

  const closeContextMenu = () => {
    setContextMenu(null);
    setUserQuestion("");
    setAiResponse("");
  };

  const handleAskAI = async () => {
    if (!userQuestion.trim()) return;
    setLoadingResponse(true);
    setAiResponse("");
  
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: `You are an expert tutor answering questions based on the selected text.`,
            },
            {
              role: "user",
              content: `Context: "${selectedText}". Question: "${userQuestion}". Provide a detailed and concise answer.`,
            },
          ],
          temperature: 0.7,
          stream: false
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
        }
      );
  
      setAiResponse(response.data.choices[0].message.content);
    } catch (error) {
      if (error.response) {
        console.error("Error from Groq:", error.response.data);
        setAiResponse(`❌ Groq Error: ${error.response.data.error.message}`);
      } else {
        console.error("Error:", error.message);
        setAiResponse("❌ Failed to fetch AI response.");
      }
    }
    
    setLoadingResponse(false);
  };
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest(".ai-context-menu")) {
        closeContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  // Clean up selection popover timer
  useEffect(() => {
    return () => {
      if (popoverTimerRef.current) {
        clearTimeout(popoverTimerRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="flex flex-col lg:flex-row h-screen relative"
      onContextMenu={handleRightClick}
      ref={contentRef}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex justify-between items-center p-3 bg-white border-b sticky top-0 z-10">
          <h1 className="text-lg font-bold truncate">
            {selectedTopic ? selectedTopic.title : "Course Notes"}
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      {/* Notes Content */}
      <NotesContent
        selectedTopic={selectedTopic}
        notes={notes}
        loading={loading}
        onStartQuiz={handleStartQuiz}
        onToggleSpeech={handleToggleSpeech}
        isSpeaking={isSpeaking}
        voiceOptions={availableVoices}
        selectedVoice={selectedVoice}
        onVoiceChange={handleVoiceChange}
        speechRate={speechRate}
        onRateChange={handleRateChange}
        showVoiceSettings={showVoiceSettings}
        toggleVoiceSettings={toggleVoiceSettings}
        onSelectionChange={handleSelectionChange}
      />

      {/* Course Sidebar */}
      <CourseSidebar
        courseContent={courseContent}
        onTopicSelect={handleTopicClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Mobile Overlay for sidebar */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Text Selection Popover */}
      <SelectionPopover
        showPopover={showPopover}
        popoverPosition={popoverPosition}
        handleShowContextMenu={handleShowContextMenu}
        isVisible={isPopoverVisible}
      />

      {/* AI Context Menu */}
      {contextMenu && (
        <AIContextMenu
          contextMenu={contextMenu}
          selectedText={selectedText}
          userQuestion={userQuestion}
          setUserQuestion={setUserQuestion}
          aiResponse={aiResponse}
          loadingResponse={loadingResponse}
          handleAskAI={handleAskAI}
          closeContextMenu={closeContextMenu}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default Notes;