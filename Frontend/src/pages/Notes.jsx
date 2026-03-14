import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
  Menu,
  X,
  Home,
  FileText,
  Clock,
  Search,
} from "lucide-react";

function Notes({ onNavigateHome }) {
  const { user} = useUser();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch notes for the current user
 useEffect(() => {
if (!user?.id) return;

const fetchNotes = async () => {  
  setLoading(true);  
  try {  
    const res = await fetch(`http://localhost:8000/notes/${user.id}`);  
    if (!res.ok) throw new Error("Failed to fetch notes");  
    const data = await res.json();  
    setNotes(data);  
  } catch (err) {  
    console.error(err);  
  } finally {  
    setLoading(false);  
  }  
};  

fetchNotes();  

}, [user]);


  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div
          style={{
            animation: "float1 8s ease-in-out infinite"
          }}
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? "bg-cyan-500" : "bg-cyan-400"
          }`}
        />
        <div
          style={{
            animation: "float2 10s ease-in-out infinite"
          }}
          className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${
            isDarkMode ? "bg-purple-500" : "bg-purple-400"
          }`}
        />
        <div
          style={{
            animation: "float3 12s ease-in-out infinite"
          }}
          className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-15 ${
            isDarkMode ? "bg-pink-500" : "bg-pink-400"
          }`}
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(100px, -50px) scale(1.2); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, 60px) scale(1.3); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 80px) scale(1.4); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 flex flex-col overflow-hidden relative z-10 ${
          isDarkMode
            ? "bg-slate-900/70 backdrop-blur-xl border-r border-slate-700/50"
            : "bg-white/80 backdrop-blur-xl border-r border-slate-300/50"
        }`}
      >
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          }`}
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <FileText size={20} />
            <span>Notes</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between px-3 py-2">
            <div
              className={`text-xs font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Statistics
            </div>
          </div>

          <div className="space-y-2">
            <div
              className={`p-3 rounded-xl backdrop-blur-xl ${
                isDarkMode
                  ? "bg-slate-800/50 border border-slate-700/50"
                  : "bg-white/50 border border-slate-300/50"
              }`}
            >
              <div className={`text-2xl font-bold ${
                isDarkMode ? "text-cyan-400" : "text-blue-600"
              }`}>
                {notes.length}
              </div>
              <div className={`text-xs ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                Total Notes
              </div>
            </div>

            {user && (
              <div
                className={`p-3 rounded-xl backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-slate-800/50 border border-slate-700/50"
                    : "bg-white/50 border border-slate-300/50"
                }`}
              >
                <div className={`text-sm font-medium ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  {user.username || user.email}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  Current User
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`border-t ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          } p-3`}
        >
          <button
            onClick={onNavigateHome || (() => window.history.back())}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isDarkMode
                ? "hover:bg-slate-800/50 text-slate-300 border border-transparent hover:border-slate-700/50"
                : "hover:bg-slate-100/50 text-slate-700 border border-transparent hover:border-slate-300/50"
            }`}
          >
            <Home size={20} />
            <span className="text-sm font-medium">Back to Home</span>c
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between gap-4 backdrop-blur-xl ${
            isDarkMode
              ? "bg-slate-900/70 border-b border-slate-700/50"
              : "bg-white/80 border-b border-slate-300/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode
                  ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                  : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <FileText
                className={isDarkMode ? "text-cyan-400" : "text-blue-500"}
                size={28}
              />
              <h1
                className={`text-2xl font-bold bg-clip-text text-transparent ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                    : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
                }`}
              >
                Your Notes
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-xl transition-all outline-none ${
                  isDarkMode
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-cyan-500"
                    : "bg-white/50 border border-slate-300/50 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                }`}
              />
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode
                  ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                  : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
              }`}
            >
              {isDarkMode ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
          </div>
        </div>

        {/* Notes Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto fade-up">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block spin">
                  <FileText
                    size={48}
                    className={isDarkMode ? "text-cyan-400" : "text-blue-500"}
                  />
                </div>
                <p
                  className={`mt-4 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Loading notes...
                </p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText
                  size={64}
                  className={`mx-auto mb-4 ${
                    isDarkMode ? "text-slate-700" : "text-slate-300"
                  }`}
                />
                <p
                  className={`text-lg mb-2 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {searchTerm
                    ? "No notes found matching your search"
                    : "No notes yet"}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  {!searchTerm && "Try creating one from the Home page!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredNotes.map((note, index) => (
                  <div
                    key={note.id}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                    }}
                    className={`rounded-xl p-5 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl hover:scale-[1.01] ${
                      isDarkMode
                        ? "bg-slate-900/70 border border-slate-700/50 hover:border-slate-600"
                        : "bg-white/80 border border-slate-300/50 hover:border-slate-400"
                    }`}
                  >
                    <p
                      className={`mb-3 leading-relaxed ${
                        isDarkMode ? "text-slate-200" : "text-slate-800"
                      }`}
                    >
                      {note.content}
                    </p>
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        isDarkMode ? "text-slate-500" : "text-slate-500"
                      }`}
                    >
                      <Clock size={14} />
                      <span>
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;