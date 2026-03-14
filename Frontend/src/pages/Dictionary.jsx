import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Volume2, Trash2, Home, BookOpen, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

function Dictionary() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("Guest");

  const API_BASE = "http://localhost:8000";

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Invalid token");
        const data = await res.json();
        setUsername(data.username || "Guest");
      })
      .catch(() => setUsername("Guest"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/dictionary/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setHistory(data.map((item) => item.word));
        }
      })
      .catch(() => console.log("Failed to load history"));
  }, []);

  const fetchDefinition = async (searchWord) => {
    if (!searchWord.trim()) return;
    setError("");
    setDefinition(null);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
      );
      if (!response.ok) throw new Error("Word not found");
      const data = await response.json();
      setDefinition(data[0]);

      if (token) {
        await fetch(`${API_BASE}/dictionary/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ word: searchWord }),
        });
      }

      if (!history.includes(searchWord.toLowerCase())) {
        setHistory([searchWord.toLowerCase(), ...history.slice(0, 9)]);
      }
    } catch (err) {
      setError("No definition found for this word.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDefinition(word);
  };

  const handleHistoryClick = (w) => {
    setWord(w);
    fetchDefinition(w);
  };

  const speakWord = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const clearHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/dictionary/history`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory([]);
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
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
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)]"
        } bg-[size:4rem_4rem] pointer-events-none`}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div
          className={`w-64 border-r p-5 flex flex-col backdrop-blur-xl rounded-r-2xl ${
            isDarkMode
              ? "bg-slate-900/70 border-slate-700/50"
              : "bg-white/80 border-slate-300/50"
          } shadow-2xl`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-lg ${
              isDarkMode ? "text-cyan-400" : "text-blue-600"
            }`}>
              History
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className={`text-sm italic ${
              isDarkMode ? "text-slate-500" : "text-slate-500"
            }`}>
              No history yet.
            </p>
          ) : (
            <div className="space-y-2 overflow-y-auto flex-1">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleHistoryClick(h)}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-all ${
                    isDarkMode
                      ? "hover:bg-slate-800/50 text-slate-300 border-transparent hover:border-slate-700"
                      : "hover:bg-slate-100/50 text-slate-700 border-transparent hover:border-slate-300"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}

          <div
            className={`border-t mt-auto pt-3 ${
              isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
            }`}
          >
            <button
              onClick={() => navigate("/")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                isDarkMode
                  ? "hover:bg-slate-800/50 text-slate-300"
                  : "hover:bg-slate-100/50 text-slate-700"
              }`}
            >
              <Home size={20} />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b backdrop-blur-xl ${
              isDarkMode
                ? "bg-slate-900/70 border-slate-700/50"
                : "bg-white/80 border-slate-300/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className={isDarkMode ? "text-cyan-400" : "text-blue-600"} size={28} />
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
              }`}>
                Dictionary
              </h1>
            </div>
           
          </div>

          {/* Search */}
          <div
            className={`p-6 border-b backdrop-blur-xl ${
              isDarkMode
                ? "bg-slate-900/70 border-slate-700/50"
                : "bg-white/80 border-slate-300/50"
            }`}
          >
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search a word..."
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-cyan-400/50 focus:border-cyan-400"
                      : "bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all shadow-lg"
              >
                Search
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-8">
            {error && (
              <p className="text-red-500 text-center font-medium">{error}</p>
            )}

            {definition && (
              <div
                className={`max-w-3xl mx-auto p-6 rounded-2xl backdrop-blur-xl shadow-2xl ${
                  isDarkMode
                    ? "bg-slate-900/70 border border-slate-700/50"
                    : "bg-white/80 border border-slate-300/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-3xl font-bold bg-clip-text text-transparent capitalize ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                      : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
                  }`}>
                    {definition.word}
                  </h2>
                  <button
                    onClick={() => speakWord(definition.word)}
                    className={`p-3 rounded-xl border transition-all hover:scale-110 ${
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700 text-cyan-400"
                        : "bg-slate-50 border-slate-300 text-blue-600"
                    }`}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>

                {definition.phonetic && (
                  <p
                    className={`italic mb-6 text-lg ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {definition.phonetic}
                  </p>
                )}

                {definition.meanings.map((m, i) => (
                  <div key={i} className={`mb-6 pb-6 border-b last:border-none ${
                    isDarkMode ? "border-slate-700/30" : "border-slate-300/30"
                  }`}>
                    <h3 className={`font-bold text-lg mb-3 capitalize ${
                      isDarkMode ? "text-cyan-400" : "text-blue-600"
                    }`}>
                      {m.partOfSpeech}
                    </h3>
                    <ul className="space-y-3">
                      {m.definitions.map((d, j) => (
                        <li
                          key={j}
                          className={`pl-4 border-l-2 ${
                            isDarkMode
                              ? "border-cyan-500/50 text-slate-200"
                              : "border-cyan-300 text-slate-800"
                          }`}
                        >
                          <p className="font-medium">{d.definition}</p>
                          {d.example && (
                            <p
                              className={`mt-2 pl-3 italic ${
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                              }`}
                            >
                              <span className={`font-semibold ${
                                isDarkMode ? "text-cyan-400" : "text-blue-600"
                              }`}>
                                Example:
                              </span>{" "}
                              {d.example}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {!definition && !error && (
              <div className="max-w-3xl mx-auto text-center py-16">
                <BookOpen
                  size={64}
                  className={`mx-auto mb-4 ${
                    isDarkMode ? "text-slate-700" : "text-slate-400"
                  }`}
                />
                <p
                  className={`text-lg ${
                    isDarkMode ? "text-slate-500" : "text-slate-600"
                  }`}
                >
                  Search for a word to see its definition
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dictionary;