import React, { useState, useEffect } from "react";
import { ArrowLeft, LogOut, Sun, Moon, User, Camera } from "lucide-react";
import { motion } from "framer-motion";

function Profile() {
  const [user, setUser] = useState({ email: "guest@example.com" });
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [avatar, setAvatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          if (data.avatar_url)
            setAvatar(`http://localhost:8000${data.avatar_url}`);
        } else console.error(data.detail);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // Toggle dark/light mode
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  // Preview avatar before upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewAvatar({ preview: imageURL, file });
    }
  };

  // Upload avatar
  const handleSaveAvatar = async () => {
    if (!newAvatar?.file) return;
    const formData = new FormData();
    formData.append("file", newAvatar.file);

    try {
      const res = await fetch("http://localhost:8000/auth/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setAvatar(`http://localhost:8000${data.avatar_url}`);
        setNewAvatar(null);
        localStorage.setItem(
          "userAvatar",
          `http://localhost:8000${data.avatar_url}`
        );
      } else alert(`⚠️ ${data.detail}`);
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  // Reset to default avatar
  const handleResetAvatar = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/users/me/avatar", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setAvatar(`http://localhost:8000${data.avatar_url}`);
        localStorage.setItem(
          "userAvatar",
          `http://localhost:8000${data.avatar_url}`
        );
      } else alert(`⚠️ ${data.detail}`);
    } catch (err) {
      console.error("Error resetting avatar:", err);
    }
  };

  // Logout and clean everything
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id")
    window.location.href = "/login";
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      className={`min-h-screen flex relative overflow-hidden transition-colors duration-500 ${
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

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(6, 182, 212, 0.8)); }
          50% { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 1)); }
        }
        .fade-up { animation: fadeInUp 0.6s ease-out; }
        .avatar-glow {
          animation: logoGlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* LEFT SIDEBAR */}
      <aside
        className={`w-64 flex flex-col border-r backdrop-blur-xl shadow-2xl relative z-10 ${
          isDarkMode
            ? "border-slate-700/50 bg-slate-900/70"
            : "border-slate-300/50 bg-white/80"
        }`}
      >
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          }`}
        >
          <h1 className={`text-lg font-bold bg-clip-text text-transparent ${
            isDarkMode
              ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
              : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
          }`}>
            Settings
          </h1>
          <button
            onClick={goHome}
            className={`p-2 rounded-xl border transition-all hover:scale-110 ${
              isDarkMode
                ? "hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                : "hover:bg-slate-100/50 border-slate-300/50 hover:border-slate-400"
            }`}
            title="Back to Home"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-3">
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                : "bg-slate-100/50 border-slate-300/50 hover:border-slate-400"
            }`}
          >
            <User size={18} className={isDarkMode ? "text-cyan-400" : "text-blue-600"} />
            <span className="font-medium">Profile</span>
          </div>
        </div>

        <div
          className={`border-t p-4 flex flex-col gap-2 ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          }`}
        >
          <button
            onClick={handleThemeToggle}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 hover:border-slate-600"
                : "bg-slate-100/50 hover:bg-slate-200 border-slate-300/50 hover:border-slate-400"
            }`}
          >
            {isDarkMode ? (
              <Sun size={18} className="text-cyan-400" />
            ) : (
              <Moon size={18} className="text-blue-600" />
            )}
            <span className="text-sm font-medium">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all shadow-lg border border-red-400/30"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex justify-center items-start mt-12 p-6 fade-up relative z-10">
        <div
          className={`w-full max-w-lg p-8 rounded-2xl border-2 shadow-2xl backdrop-blur-xl ${
            isDarkMode
              ? "bg-slate-900/70 border-slate-700/50"
              : "bg-white/80 border-slate-300/50"
          }`}
        >
          {/* Avatar & Info */}
          <div className="flex flex-col items-center mb-8 relative">
            <div className="relative">
              <div className="relative w-32 h-32">
                <img
                  src={
                    newAvatar?.preview ||
                    avatar ||
                    `https://ui-avatars.com/api/?name=${
                      user.full_name || "User"
                    }&background=random`
                  }
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full border-4 shadow-xl object-cover"
                  style={{
                    borderColor: isDarkMode
                      ? "rgb(6, 182, 212)"
                      : "rgb(8, 145, 178)",
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${
                    isDarkMode
                      ? "bg-slate-800/70 hover:bg-slate-700 border-slate-700"
                      : "bg-white/70 hover:bg-slate-50 border-slate-300"
                  }`}
                >
                  <Camera
                    size={18}
                    className={isDarkMode ? "text-cyan-400" : "text-blue-600"}
                  />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <h2 className={`mt-6 text-2xl font-bold bg-clip-text text-transparent ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
            }`}>
              {user.full_name || "User Profile"}
            </h2>
            <p
              className={`text-sm mt-2 ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {user.username || user.email}
            </p>
          </div>

          {/* Save & Remove Avatar Buttons */}
          <div className="flex gap-3 justify-center mb-6">
            {newAvatar && (
              <button
                onClick={handleSaveAvatar}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all shadow-lg font-semibold border border-cyan-400/30"
              >
                Save Avatar
              </button>
            )}

            {avatar && !avatar.includes("default.png") && (
              <button
                onClick={handleResetAvatar}
                className={`px-6 py-2 rounded-xl font-semibold transition-all shadow-md border ${
                  isDarkMode
                    ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border-slate-700/50"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300"
                }`}
              >
                Remove Avatar
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div
            className={`mt-8 space-y-4 p-6 rounded-xl border ${
              isDarkMode
                ? "bg-slate-800/50 border-slate-700/50"
                : "bg-slate-50 border-slate-300/50"
            }`}
          >
            <h3 className={`text-lg font-bold mb-4 ${
              isDarkMode ? "text-cyan-400" : "text-blue-600"
            }`}>
              Profile Information
            </h3>

            <div
              className={`flex justify-between items-center pb-3 border-b ${
                isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
              }`}
            >
              <span
                className={`font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Full Name
              </span>
              <span className="font-semibold">{user.full_name || "—"}</span>
            </div>

            <div
              className={`flex justify-between items-center pb-3 border-b ${
                isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
              }`}
            >
              <span
                className={`font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Username
              </span>
              <span className="font-semibold">{user.username || "—"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;