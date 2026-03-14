import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send, Bot, User, Upload, Plus, MessageSquare, StickyNote,
  Menu, X, Sparkles, Moon, Sun, Mic, Book, MicOff,
  Calendar, Calculator, BarChart3, FileText, File, Brain
} from "lucide-react";
import projectlogo from "../assets/Logo2.png";
import api from "../api";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/genai";


function Home() {
  const navigate = useNavigate();
  const [lastAIResponse, setLastAIResponse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
 const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

const rotatingWords = user
    ? [`Hello ${user.full_name}!`, "Welcome to Infinity"]
    : ["Hello!", "Welcome to Infinity"];

  // Rotate words effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000); // Change word every 3 seconds
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // 🧠 FETCH USER
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        if (res.data.avatar_url) {
          const avatarLink = `http://127.0.0.1:8000${res.data.avatar_url}`;
          setAvatarUrl(avatarLink);
          localStorage.setItem("avatar", avatarLink);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // =========================
  // 🧩 FETCH CHAT SESSIONS
  // =========================
  useEffect(() => {
    if (!user?.id) return;
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${API_BASE}/sessions/${user.id}`);
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching chat sessions:", err);
      }
    };
    fetchSessions();
  }, [user]);

  // =========================
  // 📤 HANDLE FILE UPLOAD
  // =========================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) {
      alert("Missing file or user ID");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      
      // Add file upload message to chat
      const fileMsg = {
        type: "system",
        content: `📄 Document "${file.name}" uploaded successfully! You can now ask questions about it.`,
        file: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      };
      
      setMessages((prev) => [...prev, fileMsg]);
      setUploadedFiles((prev) => [...prev, file.name]);
      
      alert("✅ File uploaded successfully!");
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMsg = {
        type: "system",
        content: "❌ Failed to upload document. Please try again."
      };
      setMessages((prev) => [...prev, errorMsg]);
      alert("❌ Upload failed!");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = null;
    }
  };

  // =========================
  // ⌨️ HANDLE ENTER KEY
  // =========================
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // =========================
  // 💬 LOAD SESSION MESSAGES
  // =========================
  const loadSessionMessages = async (sessionId) => {
  try {
    // If no session yet, create one
    let activeSession = sessionId;
    if (!activeSession) {
      const res = await fetch(`${API_BASE}/new_session`, { method: "POST"});

      const session = await res.json();
      activeSession = session.id;
      setCurrentSessionId(activeSession);
    }

    // Then load messages
    const res = await fetch(`${API_BASE}/messages/${activeSession}`);
    const data = await res.json();

    const formatted = data.map((m) => ({
      type: m.sender === "user" ? "user" : "assistant",
      content: m.message,
    }));

    setMessages(formatted);
  } catch (err) {
    console.error("Error loading session messages:", err);
  }
};


  // =========================
  // 🆕 CREATE NEW CHAT SESSION
  // =========================
  const handleNewChat = async () => {
  const uid = user?.user_id || user?.id;
  if (!uid) {
    console.warn("User ID missing, cannot start new chat");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("user_id", uid);

    const res = await fetch(`${API_BASE}/new_session`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.session_id) {
      console.error("No session ID returned from backend:", data);
      return;
    }

    setCurrentSessionId(data.session_id);
    localStorage.setItem("session_id", data.session_id);
    setMessages([]);
    setUploadedFiles([]);
    setSessions((prev) => [
      { id: data.session_id, title: data.title || "New Chat", date: "Just now" },
      ...prev,
    ]);
  } catch (err) {
    console.error("Error creating new chat:", err);
  }
};

useEffect(() => {
  const savedSession = localStorage.getItem("session_id");
  if (savedSession) {
    setCurrentSessionId(parseInt(savedSession));
  }
}, []);

  // =========================
  // ✉️ SEND MESSAGE (FIXED)
  // =========================
  const handleSendMessage = async () => {
  const trimmedInput = inputValue.trim();
  
  if (!trimmedInput) return;

  if (!currentSessionId) {
    await handleNewChat();
    // wait for session creation
    setTimeout(() => sendMessageWithSession(trimmedInput), 500);
    return;
  }

  sendMessageWithSession(trimmedInput);
};

const sendMessageWithSession = async (messageText) => {
  const userMsg = { type: "user", content: messageText };
  setMessages((prev) => [...prev, userMsg]);
  setInputValue("");

  try {
    const payload = {
      session_id: currentSessionId,
      user_id: user.id,
      prompt: messageText,
    };

    console.log("Payload being sent:", payload);

    const res = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    const botReply =
  data.answer ||
  data.response ||
  data.message ||
  data.output ||
  "⚠️ No response received.";


    const aiMsg = { type: "assistant", content: botReply };
    setMessages((prev) => [...prev, aiMsg]);
    setLastAIResponse(botReply); // <-- add this line


    // ✅ Update sidebar locally — no refetch
    setSessions((prevSessions) => {
      const updated = [...prevSessions];
      const idx = updated.findIndex((s) => s.id === currentSessionId);

      if (idx >= 0) {
        // Update existing session snippet (latest user message)
        updated[idx] = {
          ...updated[idx],
          title:
            messageText.length > 40
              ? messageText.slice(0, 40) + "..."
              : messageText,
        };
      } else {
        // Add new session if it doesn't exist
        updated.unshift({
          id: data.session_id || currentSessionId,
          title:
            messageText.length > 40
              ? messageText.slice(0, 40) + "..."
              : messageText,
          created_at: new Date().toISOString(),
        });
      }
      return updated;
    });
  } catch (err) {
    console.error("Error sending message:", err);
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        content:
          "❌ Error connecting to AI backend. Please check your connection and try again.",
      },
    ]);
  }
};

const createNoteFromAI = async (noteContent) => {
  if (!user?.id) return;
  try {
    // Construct payload with user_id and optional session_id
    const payload = {
      user_id: user.id,                  // include user ID in the body
      content: noteContent,
    };

    console.log("Creating note with content:", noteContent, "and session_id:", currentSessionId);

    const res = await fetch(`http://localhost:8000/notes/create`, { // removed /${user.id}
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create note");

    const data = await res.json();
    console.log("Note created:", data);
    alert("✅ Note created successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Could not create note");
  }
};





  // =========================
  // 🎙️ VOICE LOGIC
  // =========================
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
    setIsListening(!isListening);
  };

  return (
    <div
      className={`flex h-screen relative overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100"
          : "bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 text-slate-900"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? "bg-cyan-500" : "bg-cyan-400"
          }`}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl ${
            isDarkMode ? "bg-purple-500" : "bg-purple-400"
          }`}
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 80, 0],
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-pink-500" : "bg-pink-400"
          }`}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? "bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)]" 
          : "bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)]"
      } bg-[size:4rem_4rem] pointer-events-none`} />

      {/* Enhanced Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInReveal {
          0% { 
            opacity: 0; 
            clip-path: inset(0 100% 0 0);
          }
          100% { 
            opacity: 1; 
            clip-path: inset(0 0 0 0);
          }
        }
        @keyframes logoRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .logo-hover {
          transition: transform 0.3s ease;
        }
        .logo-hover:hover {
          animation: logoRotate 0.8s ease-in-out;
        }
        .word-slide-in {
          animation: slideInReveal 1s ease-out;
          display: inline-block;
        }
        .fade-up {
          animation: fadeInUp 1s ease-out;
        }
      `}</style>

      {/* Enhanced Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 flex flex-col overflow-hidden relative z-10 ${
          isDarkMode 
            ? "bg-slate-900/70 backdrop-blur-xl border-r border-slate-700/50" 
            : "bg-white/80 backdrop-blur-xl border-r border-slate-300/50"
        }`}
      >
        <div className={`p-4 border-b ${
          isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
        }`}>
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div
            className={`text-xs font-bold px-3 py-2 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Recent Conversations
          </div>
         {Array.isArray(sessions) && sessions.map((conv) => (
  <button
    key={conv.id}
    onClick={() => loadSessionMessages(conv.id)}
    className={`w-full flex items-start gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
      currentSessionId === conv.id
        ? isDarkMode
          ? "bg-slate-800/70 border-slate-600"
          : "bg-slate-200/70 border-slate-400"
        : ""
    } ${
      isDarkMode 
        ? "hover:bg-slate-800/50 hover:border-slate-700 border border-transparent" 
        : "hover:bg-slate-100/50 hover:border-slate-300 border border-transparent"
    } text-left group`}
  >
    <MessageSquare 
      size={18} 
      className={`mt-1 transition-colors ${
        isDarkMode ? "text-slate-400 group-hover:text-cyan-400" : "text-slate-500 group-hover:text-blue-500"
      }`}
    />
    <div className="flex-1 min-w-0">
      <div className={`text-sm font-semibold truncate ${
        isDarkMode ? "text-slate-200" : "text-slate-800"
      }`}>
        {conv.title}
      </div>
      <div className={`text-xs truncate ${
        isDarkMode ? "text-slate-400" : "text-slate-500"
      }`}>
        {conv.snippet}
      </div>
      <div className={`text-[10px] mt-1 ${
        isDarkMode ? "text-slate-500" : "text-slate-400"
      }`}>
        {conv.date}
      </div>
    </div>
  </button>
))}

        </div>

        <div className={`p-3 space-y-2 border-t ${
          isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
        }`}>
          {[
            { Icon: Brain, label: "Quiz", path: "/quiz" },
            { Icon: BarChart3, label: "Analytics", path: "/analytics" },
            { Icon: Calendar, label: "Calendar", path: "/calendar" },
            { Icon: Calculator, label: "Calculator", path: "/calculator" },
            { Icon: FileText, label: "Library", path: "/library" },
            { Icon: Book, label: "Dictionary", path: "/dictionary" },
            { Icon: StickyNote, label: "Notes", path: "/notes" }
          ].map(({ Icon, label, path }, i) => (
            <button
              key={i}
              onClick={() => path && navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                isDarkMode 
                  ? "hover:bg-slate-800/50 hover:border-slate-700 border border-transparent" 
                  : "hover:bg-slate-100/50 hover:border-slate-300 border border-transparent"
              }`}
            >
              <Icon size={20} className={isDarkMode ? "text-slate-400" : "text-slate-600"} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}

          <div className={`pt-3 border-t ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          }`}>
            <button
              onClick={() => navigate("/profile")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                isDarkMode 
                  ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600" 
                  : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
              }`}
            >
              <img
                src={
                  avatarUrl
                    ? avatarUrl
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.full_name || "User"
                      )}&background=random`
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400/50"
              />
              <span className="text-sm font-semibold">{user?.full_name || "User"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Main Section */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Enhanced Header */}
        <div
          className={`flex items-center justify-between gap-4 px-6 py-4 backdrop-blur-xl ${
            isDarkMode 
              ? "bg-slate-900/70 border-b border-slate-700/50" 
              : "bg-white/80 border-b border-slate-300/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDarkMode 
                  ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600" 
                  : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <img src={projectlogo} alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <File size={18} className={isDarkMode ? "text-cyan-400" : "text-blue-500"} />
              <span className="text-sm font-medium">
                {uploadedFiles.length} document{uploadedFiles.length > 1 ? 's' : ''} loaded
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Chat Section */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 fade-up">
              <div className="relative">
                <img src={projectlogo} alt="Logo" className="w-28 h-28 logo-hover cursor-pointer" />
              </div>
              <h2 className="text-4xl font-bold">
                <span
                  key={currentWordIndex}
                  className={`pb-2 bg-clip-text text-transparent word-slide-in ${
                    isDarkMode 
                      ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                      : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
                  }`}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
              </h2>
              <p
                className={`text-lg max-w-xl ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Start chatting or upload your documents to get AI-powered insights instantly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
                {[
                  { Icon: Upload, title: "Upload Documents", desc: "Supports PDF, DOCX, and TXT files." },
                  { Icon: Sparkles, title: "Get Summaries", desc: "AI-powered document analysis." },
                  { Icon: Brain, title: "Play Quizzes", desc: "Quick, fun, and brain-tickling quizzes just for you!." }
                ].map(({ Icon, title, desc }, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                      isDarkMode 
                        ? "bg-slate-900/70 border-slate-700/50 hover:border-slate-600" 
                        : "bg-white/80 border-slate-300/50 hover:border-slate-400 shadow-lg"
                    }`}
                  >
                    <Icon className={isDarkMode ? "text-cyan-400 mb-4" : "text-blue-500 mb-4"} size={32} />
                    <h3 className={`font-bold mb-2 text-lg ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}>
                      {title}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 fade-up">
              {messages.map((msg, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-lg backdrop-blur-xl ${
        msg.type === "user"
          ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white border border-cyan-400/30"
          : msg.type === "system"
          ? isDarkMode
            ? "bg-yellow-900/30 text-yellow-200 border border-yellow-700/50"
            : "bg-yellow-50 text-yellow-800 border border-yellow-300/50"
          : isDarkMode
          ? "bg-slate-900/70 text-slate-100 border border-slate-700/50"
          : "bg-white/80 text-slate-800 border border-slate-300/50"
      }`}
    >
      {msg.type === "user" ? (
        <div className="flex items-start gap-3">
          <span className="flex-1">{msg.content}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <img src={projectlogo}
              className={`mt-1 flex-shrink-0 w-5  ${
                msg.type === "system"
                  ? isDarkMode
                    ? "text-yellow-400"
                    : "text-yellow-600"
                  : isDarkMode
                  ? "text-cyan-400"
                  : "text-blue-500"
              }`}
            />
            <div className="flex-1">
              <span>{msg.content}</span>
              {msg.file && (
                <div
                  className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                    isDarkMode ? "bg-slate-800/50" : "bg-slate-100/50"
                  }`}
                >
                  <File size={16} />
                  <span className="text-sm font-medium">{msg.file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Create Note Button after last AI message */}
          {msg.type === "assistant" && idx === messages.length - 1 && (
            <button
              onClick={() => createNoteFromAI(msg.content)}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform"
            >
              Create Note from AI
            </button>
          )}
        </div>
      )}
    </div>
  </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Enhanced Input Area */}
        <div
          className={`p-6 backdrop-blur-xl ${
            isDarkMode 
              ? "bg-slate-900/70 border-t border-slate-700/50" 
              : "bg-white/80 border-t border-slate-300/50"
          }`}
        >
          <div className="max-w-3xl mx-auto flex gap-3 items-end">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <div
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  isDarkMode 
                    ? "bg-slate-800/50 border border-slate-700 hover:border-slate-600" 
                    : "bg-slate-50 border border-slate-300 hover:border-slate-400"
                }`}
              >
                <Upload size={24} className={isDarkMode ? "text-cyan-400" : "text-blue-500"} />
              </div>
            </label>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className={`flex-1 px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-cyan-400/50 focus:border-cyan-400"
                  : "bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500"
              }`}
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMicClick}
              className={`p-3 rounded-xl transition-all duration-300 shadow-lg ${
                isListening
                  ? "bg-red-500 border border-red-400"
                  : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 border border-cyan-400/30"
              }`}
            >
              {isListening ? (
                <MicOff size={22} className="text-white" />
              ) : (
                <Mic size={22} className="text-white" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 border border-cyan-400/30 shadow-lg transition-all duration-300 ${
                !inputValue.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Send size={24} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;