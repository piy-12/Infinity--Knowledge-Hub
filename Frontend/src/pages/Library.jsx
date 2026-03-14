import React, { useEffect, useState,useRef} from "react";
import {
  Menu,
  X,
  BookOpen,
  Upload,
  Download,
  Search,
  Home,
} from "lucide-react";

const API_BASE = "http://localhost:8000/library";
const AUTH_BASE = "http://localhost:8000/auth";
const FILES_BASE = "http://localhost:8000/books";
const GUTENBERG_API = "https://gutendex.com/books";

export default function Library() {
  const [isDarkMode, setIsDarkMode] = useState(
      localStorage.getItem("theme") === "dark"
    );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
  });
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionSearchQuery, setCollectionSearchQuery] = useState("");
  const [gutenbergBooks, setGutenbergBooks] = useState([]);
  const [loadingGutenberg, setLoadingGutenberg] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

  // Fetch current logged-in user (if token exists)
  const getCurrentUser = async () => {
    const token = window.localStorage?.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await fetch(`${AUTH_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        console.warn("Unable to fetch user:", data);
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      setUser(null);
    }
  };

  // Fetch all books
  const getAllBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await fetch(`${API_BASE}/get`);
      const data = await res.json();

      const booksArray = Array.isArray(data)
        ? data
        : Array.isArray(data.books)
        ? data.books
        : [];

      setBooks(booksArray);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  // Search Project Gutenberg API
  const searchGutenberg = async (query) => {
    if (!query.trim()) {
      setGutenbergBooks([]);
      return;
    }
    
    setLoadingGutenberg(true);
    try {
      const res = await fetch(`${GUTENBERG_API}?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setGutenbergBooks(data.results || []);
      setAnimationKey(prev => prev + 1);
    } catch (error) {
      console.error("Error searching Gutenberg:", error);
      setGutenbergBooks([]);
    } finally {
      setLoadingGutenberg(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getAllBooks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchGutenberg(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Upload handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (!user) {
      alert("You must be logged in to upload a book.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("description", form.description);
    formData.append("uploader_id", user.id);
    formData.append("file", file);

    try {
      const token = window.localStorage?.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", data);
        alert(`Upload failed: ${data.detail || data.message || "Unknown error"}`);
        return;
      }

      setMessage("✅ Book uploaded successfully!");
      setForm({ title: "", author: "", description: "" });
      setFile(null);

      
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  await getAllBooks();
  return;
    } catch (err) {
      console.error("Error uploading book:", err);
      setMessage("❌ Upload failed. Check console.");
    }
  };

  // Download handler for user collection
  const downloadBook = (bookUrl, title, author) => {
    if (!bookUrl) return;
    const parts = bookUrl.split("/");
    const fileName = parts.pop() || parts.pop();
    const encoded = encodeURIComponent(fileName);
    window.open(`${FILES_BASE}/${encoded}`, "_blank");
  };

  // Download handler for Gutenberg books
  const downloadGutenbergBook = (book) => {
    // Try to get epub, then html, then plain text
    const formats = book.formats || {};
    const downloadUrl = formats['application/epub+zip'] || 
                       formats['text/html'] || 
                       formats['text/plain; charset=utf-8'] ||
                       formats['text/plain'];
    
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else {
      alert("Download not available for this book");
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(collectionSearchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(collectionSearchQuery.toLowerCase()) ||
    book.uploader?.full_name?.toLowerCase().includes(collectionSearchQuery.toLowerCase())
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
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? "bg-cyan-500" : "bg-cyan-400"
          } opacity-20 animate-pulse`}
          style={{ animationDuration: '8s' }}
        />
        <div
          className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl ${
            isDarkMode ? "bg-purple-500" : "bg-purple-400"
          } opacity-25 animate-pulse`}
          style={{ animationDuration: '10s', animationDelay: '1s' }}
        />
        <div
          className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-pink-500" : "bg-pink-400"
          } opacity-15 animate-pulse`}
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? "bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)]" 
          : "bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)]"
      } bg-[size:4rem_4rem] pointer-events-none`} />

      {/* Left Sidebar - Your Collection */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
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
            <BookOpen size={20} />
            <span>Collection</span>
          </div>
        </div>

        <div className={`p-4 border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-300/50"}`}>
          {/* Search Bar for Collection */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
              size={16}
            />
            <input
              type="text"
              placeholder="Search books..."
              value={collectionSearchQuery}
              onChange={(e) => setCollectionSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 rounded-lg text-sm transition-all ${
                isDarkMode
                  ? "bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:border-cyan-500"
                  : "bg-white/50 border border-slate-300/50 text-slate-900 focus:border-blue-500"
              } focus:outline-none`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loadingBooks ? (
            <p className="text-center py-8 text-sm">Loading...</p>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen
                size={48}
                className={`mx-auto mb-3 ${isDarkMode ? "text-slate-700" : "text-slate-300"}`}
              />
              <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                {collectionSearchQuery ? "No books found" : "No books in collection yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className={`p-3 rounded-xl backdrop-blur-xl transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70"
                      : "bg-white/50 border border-slate-300/50 hover:bg-white/70"
                  }`}
                >
                  <h3 className="font-bold text-sm mb-1">{book.title}</h3>
                  <p className={`text-xs mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    by {book.uploader?.full_name || book.author || "Unknown"}
                  </p>
                  {book.description && (
                    <p className={`text-xs mb-2 line-clamp-2 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                      {book.description}
                    </p>
                  )}
                  <button
                    onClick={() => downloadBook(book.file_url, book.title, book.author || book.uploader?.full_name)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`border-t ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          } p-3`}
        >
          <button
            onClick={() => window.location.href = "/"}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isDarkMode
                ? "hover:bg-slate-800/50 text-slate-300 border border-transparent hover:border-slate-700/50"
                : "hover:bg-slate-100/50 text-slate-700 border border-transparent hover:border-slate-300/50"
            }`}
          >
            <Home size={20} />
            <span className="text-sm font-medium">Back to Home</span>
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
              <BookOpen className={isDarkMode ? "text-cyan-400" : "text-blue-500"} size={28} />
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
              }`}>
                Open Library
              </h1>
            </div>
          </div>
          
         
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Upload Form */}
            <div
              className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl ${
                isDarkMode
                  ? "bg-slate-900/70 border border-slate-700/50"
                  : "bg-white/80 border border-slate-300/50"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} className={isDarkMode ? "text-cyan-400" : "text-blue-500"} />
                Upload a New Book
              </h2>

              {!user && (
                <p className="text-sm text-red-500 mb-3">⚠ Please log in to upload books</p>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Book Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`p-3 rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:border-cyan-500"
                      : "bg-white/50 border border-slate-300/50 text-slate-900 focus:border-blue-500"
                  } focus:outline-none`}
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={`p-3 rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:border-cyan-500"
                      : "bg-white/50 border border-slate-300/50 text-slate-900 focus:border-blue-500"
                  } focus:outline-none`}
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`p-3 rounded-xl transition-all md:col-span-2 ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:border-cyan-500"
                      : "bg-white/50 border border-slate-300/50 text-slate-900 focus:border-blue-500"
                  } focus:outline-none`}
                  rows="2"
                />
               <input
  type="file"
  accept=".pdf,.txt,.epub"
  ref={fileInputRef}
  onChange={(e) => setFile(e.target.files[0])}
  className={`p-3 rounded-xl transition-all ${
    isDarkMode
      ? "bg-slate-800/50 border border-slate-700/50 text-slate-100"
      : "bg-white/50 border border-slate-300/50 text-slate-900"
  }`}
  required
/>
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  Upload Book
                </button>
              </div>

              {message && (
                <p className="mt-4 text-center font-medium">
                  {message}
                </p>
              )}
            </div>

            {/* Search Bar for Gutenberg */}
            <div
              className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl ${
                isDarkMode
                  ? "bg-slate-900/70 border border-slate-700/50"
                  : "bg-white/80 border border-slate-300/50"
              }`}
            >
              <div className="relative">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search free books from Project Gutenberg (60,000+ books)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:border-cyan-500"
                      : "bg-white/50 border border-slate-300/50 text-slate-900 focus:border-blue-500"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Gutenberg Book List */}
            {searchQuery && (
              <div
                className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-slate-900/70 border border-slate-700/50"
                    : "bg-white/80 border border-slate-300/50"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen size={20} className={isDarkMode ? "text-cyan-400" : "text-blue-500"} />
                  Project Gutenberg Results
                </h2>

                {loadingGutenberg ? (
                  <p className="text-center py-8">Loading books...</p>
                ) : gutenbergBooks.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    No books found. Try a different search term.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {gutenbergBooks.map((book, index) => (
                      <div
                        key={`${book.id}-${animationKey}`}
                        className={`flex justify-between items-center p-4 rounded-xl backdrop-blur-xl transition-all ${
                          isDarkMode
                            ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70"
                            : "bg-white/50 border border-slate-300/50 hover:bg-white/70"
                        }`}
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{book.title}</h3>
                          <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                            by {book.authors?.[0]?.name || "Unknown"}
                          </p>
                          <div className={`text-xs mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                            Downloads: {book.download_count?.toLocaleString() || "N/A"}
                            {book.subjects && book.subjects.length > 0 && (
                              <span className="ml-2">• {book.subjects[0]}</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => downloadGutenbergBook(book)}
                          className="ml-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}