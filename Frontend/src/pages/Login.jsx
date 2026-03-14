import React, { useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import projectlogo from "../assets/Logo2.png";
import animate from '../assets/Cute Robot.png'
import api from "../api";

function Login() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const roles = ["Student", "Teacher", "Researcher", "Content Creator"];

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!selectedRole) {
      setMessage("Please select a role");
      return;
    }
    
    try {
      const res = await api.post("/auth/login", {
        username: inputEmail,
        password: inputPassword,
        role: selectedRole.toLowerCase(),
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.user.role);
      await new Promise((resolve) => setTimeout(resolve, 100));

      setMessage("Login successful!");
      navigate("/"); // or "/"
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200"
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
            theme === "dark" ? "bg-cyan-500" : "bg-cyan-400"
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
            theme === "dark" ? "bg-purple-500" : "bg-purple-400"
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
            theme === "dark" ? "bg-pink-500" : "bg-pink-400"
          }`}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 ${
        theme === "dark" 
          ? "bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)]" 
          : "bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)]"
      } bg-[size:4rem_4rem] pointer-events-none`} />

      <div className="container mx-auto px-4 py-8 flex items-center justify-between max-w-7xl relative z-10">
        {/* Left side - AI Bot Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-1 flex-col items-center justify-center pr-16"
        >
          <div className="relative">
            {/* Static glowing background */}
            <div
              className={`absolute inset-0 w-[700px] h-[700px] -left-24 -top-24 rounded-full blur-3xl opacity-40 ${
                theme === "dark" 
                  ? "bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/20" 
                  : "bg-gradient-to-br from-cyan-400/40 via-purple-400/40 to-pink-400/30"
              }`}
            />
            
            {/* AI Bot Container */}
            <div className="relative w-[600px] h-[600px] flex flex-col items-center justify-center">
              {/* Ring and Robot Container */}
              <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                {/* Animated Circle Ring - Pulsing and Rotating */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className={`w-[450px] h-[450px] rounded-full ${
                      theme === "dark"
                        ? "border-cyan-500/40"
                        : "border-cyan-600/50"
                    }`}
                    style={{
                      border: '6px solid transparent',
                      borderTopColor: theme === "dark" ? 'rgba(6, 182, 212, 0.6)' : 'rgba(8, 145, 178, 0.7)',
                      borderRightColor: theme === "dark" ? 'rgba(6, 182, 212, 0.3)' : 'rgba(8, 145, 178, 0.4)',
                      borderBottomColor: theme === "dark" ? 'rgba(6, 182, 212, 0.1)' : 'rgba(8, 145, 178, 0.2)',
                      borderLeftColor: theme === "dark" ? 'rgba(6, 182, 212, 0.05)' : 'rgba(8, 145, 178, 0.1)',
                      boxShadow: theme === "dark" 
                        ? '0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 30px rgba(6, 182, 212, 0.1)' 
                        : '0 0 30px rgba(8, 145, 178, 0.4), inset 0 0 30px rgba(8, 145, 178, 0.15)',
                    }}
                  />
                </motion.div>

                {/* Second rotating ring with gradient fade */}
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.08, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    rotate: {
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className={`w-[490px] h-[490px] rounded-full ${
                      theme === "dark"
                        ? "border-purple-500/30"
                        : "border-purple-600/40"
                    }`}
                    style={{
                      border: '4px solid transparent',
                      borderTopColor: theme === "dark" ? 'rgba(168, 85, 247, 0.5)' : 'rgba(147, 51, 234, 0.6)',
                      borderRightColor: theme === "dark" ? 'rgba(168, 85, 247, 0.25)' : 'rgba(147, 51, 234, 0.3)',
                      borderBottomColor: theme === "dark" ? 'rgba(168, 85, 247, 0.1)' : 'rgba(147, 51, 234, 0.15)',
                      borderLeftColor: theme === "dark" ? 'rgba(168, 85, 247, 0.05)' : 'rgba(147, 51, 234, 0.1)',
                      boxShadow: theme === "dark" 
                        ? '0 0 25px rgba(168, 85, 247, 0.2), inset 0 0 25px rgba(168, 85, 247, 0.1)' 
                        : '0 0 25px rgba(147, 51, 234, 0.3), inset 0 0 25px rgba(147, 51, 234, 0.15)',
                    }}
                  />
                </motion.div>

                {/* Third ring - Pink gradient */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.06, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    rotate: {
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className={`w-[530px] h-[530px] rounded-full ${
                      theme === "dark"
                        ? "border-pink-500/25"
                        : "border-pink-600/35"
                    }`}
                    style={{
                      border: '3px solid transparent',
                      borderTopColor: theme === "dark" ? 'rgba(236, 72, 153, 0.4)' : 'rgba(219, 39, 119, 0.5)',
                      borderRightColor: theme === "dark" ? 'rgba(236, 72, 153, 0.2)' : 'rgba(219, 39, 119, 0.25)',
                      borderBottomColor: theme === "dark" ? 'rgba(236, 72, 153, 0.08)' : 'rgba(219, 39, 119, 0.12)',
                      borderLeftColor: theme === "dark" ? 'rgba(236, 72, 153, 0.04)' : 'rgba(219, 39, 119, 0.08)',
                      boxShadow: theme === "dark" 
                        ? '0 0 20px rgba(236, 72, 153, 0.15), inset 0 0 20px rgba(236, 72, 153, 0.08)' 
                        : '0 0 20px rgba(219, 39, 119, 0.25), inset 0 0 20px rgba(219, 39, 119, 0.12)',
                    }}
                  />
                </motion.div>

                {/* Fourth ring - Blue gradient */}
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.1, 1],
                    opacity: [0.25, 0.5, 0.25],
                  }}
                  transition={{
                    rotate: {
                      duration: 22,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className={`w-[570px] h-[570px] rounded-full ${
                      theme === "dark"
                        ? "border-blue-500/20"
                        : "border-blue-600/30"
                    }`}
                    style={{
                      border: '3px solid transparent',
                      borderTopColor: theme === "dark" ? 'rgba(59, 130, 246, 0.35)' : 'rgba(37, 99, 235, 0.45)',
                      borderRightColor: theme === "dark" ? 'rgba(59, 130, 246, 0.18)' : 'rgba(37, 99, 235, 0.22)',
                      borderBottomColor: theme === "dark" ? 'rgba(59, 130, 246, 0.07)' : 'rgba(37, 99, 235, 0.1)',
                      borderLeftColor: theme === "dark" ? 'rgba(59, 130, 246, 0.03)' : 'rgba(37, 99, 235, 0.06)',
                      boxShadow: theme === "dark" 
                        ? '0 0 18px rgba(59, 130, 246, 0.12), inset 0 0 18px rgba(59, 130, 246, 0.06)' 
                        : '0 0 18px rgba(37, 99, 235, 0.2), inset 0 0 18px rgba(37, 99, 235, 0.1)',
                    }}
                  />
                </motion.div>

                {/* Fifth ring - Teal gradient (outermost) */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.12, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    rotate: {
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className={`w-[610px] h-[610px] rounded-full ${
                      theme === "dark"
                        ? "border-teal-500/15"
                        : "border-teal-600/25"
                    }`}
                    style={{
                      border: '2px solid transparent',
                      borderTopColor: theme === "dark" ? 'rgba(20, 184, 166, 0.3)' : 'rgba(13, 148, 136, 0.4)',
                      borderRightColor: theme === "dark" ? 'rgba(20, 184, 166, 0.15)' : 'rgba(13, 148, 136, 0.2)',
                      borderBottomColor: theme === "dark" ? 'rgba(20, 184, 166, 0.06)' : 'rgba(13, 148, 136, 0.08)',
                      borderLeftColor: theme === "dark" ? 'rgba(20, 184, 166, 0.03)' : 'rgba(13, 148, 136, 0.05)',
                      boxShadow: theme === "dark" 
                        ? '0 0 15px rgba(20, 184, 166, 0.1), inset 0 0 15px rgba(20, 184, 166, 0.05)' 
                        : '0 0 15px rgba(13, 148, 136, 0.18), inset 0 0 15px rgba(13, 148, 136, 0.08)',
                    }}
                  />
                </motion.div>

                {/* Main AI Bot Image - Static (no floating) */}
                <div className="relative z-10">
                  <img
                    src={animate}
                    alt="AI Assistant Bot"
                    className="w-[380px] h-[380px] object-contain"
                    style={{
                      filter: theme === "dark"
                        ? "drop-shadow(0 0 40px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 80px rgba(168, 85, 247, 0.3))"
                        : "drop-shadow(0 0 40px rgba(8, 145, 178, 0.4)) drop-shadow(0 0 80px rgba(147, 51, 234, 0.3))"
                    }}
                  />
                </div>
              </div>

              {/* Text below the rings */}
              <div className="mt-10 relative top-10 space-y-2 text-center">
                <h2
                  className={`text-4xl font-bold ${
                    theme === "dark"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                >
                  This is Infinity. 
                </h2>
                <span  className={`text-4xl font-bold  ${
                    theme === "dark"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}>Your Knowledge Partner</span>
                <p
                  className={`text-lg opacity-80 pt-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  "Turning information into knowledge"
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-5 text-center"
          >
            <h2 className={`text-3xl font-bold mb-2 ${
              theme === "dark"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600"
            }`}>
            </h2>
            <p className={`text-xl max-w-lg ${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}>
            </p>
          </motion.div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[480px] relative"
        >
          <div
            className={`relative rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border p-10 ${
              theme === "dark"
                ? "border-slate-700/50 bg-slate-900/70"
                : "border-slate-300/50 bg-white/80"
            }`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />

            {/* Header */}
            <div className="relative flex flex-col items-center mb-8 text-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={projectlogo}
                  alt="Infinity Logo"
                  className="w-24 h-24 object-contain mb-1"
                />
              </motion.div>
            </div>

            {/* Form */}
            <form className="relative space-y-6" onSubmit={handleLogin}>
              <div className="relative group">
                <HiOutlineMail className={`absolute left-4 top-4 text-xl transition-colors ${
                  theme === "dark" ? "text-slate-500 group-hover:text-cyan-400" : "text-slate-400 group-hover:text-blue-600"
                }`} />
                <input
                  type="text"
                  placeholder="Email address"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-slate-800/50 border border-slate-700 text-slate-100 focus:ring-cyan-400/50 focus:border-cyan-400"
                      : "bg-slate-100/50 border border-slate-300 text-slate-900 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="relative group">
                <HiOutlineLockClosed className={`absolute left-4 top-4 text-xl transition-colors ${
                  theme === "dark" ? "text-slate-500 group-hover:text-cyan-400" : "text-slate-400 group-hover:text-blue-600"
                }`} />
                <input
                  type="password"
                  placeholder="Password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-slate-800/50 border border-slate-700 text-slate-100 focus:ring-cyan-400/50 focus:border-cyan-400"
                      : "bg-slate-100/50 border border-slate-300 text-slate-900 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Role Selection */}
              <div className="relative group">
                <FaBriefcase className={`absolute left-4 top-4 text-xl transition-colors ${
                  theme === "dark" ? "text-slate-500 group-hover:text-cyan-400" : "text-slate-400 group-hover:text-blue-600"
                }`} />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none cursor-pointer ${
                    theme === "dark"
                      ? "bg-slate-800/50 border border-slate-700 text-slate-100 focus:ring-cyan-400/50 focus:border-cyan-400"
                      : "bg-slate-100/50 border border-slate-300 text-slate-900 focus:ring-blue-500/50 focus:border-blue-500"
                  } ${!selectedRole && (theme === "dark" ? "text-slate-500" : "text-slate-400")}`}
                >
                  <option value="" disabled>Select your role</option>
                  {roles.map((role) => (
                    <option 
                      key={role} 
                      value={role.toLowerCase()} 
                      className={theme === "dark" ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"}
                    >
                      {role}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-4 pointer-events-none">
                  <svg className={`w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white"
                    : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white"
                }`}
              >
                <span className="relative z-10">Sign In</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </form>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 text-sm text-center font-medium ${
                  message.includes("successful")
                    ? theme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                    : theme === "dark"
                    ? "text-red-400"
                    : "text-red-600"
                }`}
              >
                {message}
              </motion.p>
            )}

            <div
              className={`relative text-center text-sm mt-8 ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <span>New to Knowledge Hub?</span>{" "}
              <button
                onClick={() => navigate("/signup")}
                className={`font-semibold transition-colors ${
                  theme === "dark" ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
                } hover:underline`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-30 ${
            theme === "dark" ? "bg-purple-500" : "bg-purple-400"
          }`} />
          <div className={`absolute -top-4 -left-4 w-32 h-32 rounded-full blur-3xl opacity-30 ${
            theme === "dark" ? "bg-cyan-500" : "bg-cyan-400"
          }`} />
        </motion.div>
      </div>
    </div>
  );
}

export default Login;