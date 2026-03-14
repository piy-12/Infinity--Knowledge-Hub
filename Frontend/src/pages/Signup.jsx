import React, { useState } from "react";
import { Mail, Lock, Sun, Moon, User, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import projectlogo from "../assets/Logo2.png";

function Signup() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");

  const roles = ["Student", "Teacher", "Researcher", "Content Creator"];

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Simple strength calculation
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^a-zA-Z0-9]/.test(value)) score++;
    setStrength(Math.min(score, 4));
    
    if (value.length < 8) setFeedback("Use at least 8 characters");
    else if (score < 3) setFeedback("Add numbers and special characters");
    else setFeedback("");
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-lime-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStrengthText = () => {
    const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
    return labels[strength];
  };

  const handleSignup = async () => {
  setMessage("");

  if (!username || !fullName || !password || !role) {
    setMessage("Please fill in all fields");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        full_name: fullName,
        password,
        role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setMessage(`❌ Signup failed: ${errorData.detail || "Unknown error"}`);
      return;
    }

    const data = await response.json();
    console.log("✅ Signup success:", data);
    setMessage("✓ Account created successfully!");
    setTimeout(() => navigate("/login"), 1500);
  } catch (error) {
    console.error("Signup error:", error);
    setMessage("❌ Server not reachable or internal error.");
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
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            theme === "dark" ? "bg-cyan-500" : "bg-cyan-400"
          } opacity-20`}
        />
        <div
          className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            theme === "dark" ? "bg-purple-500" : "bg-purple-400"
          } opacity-20`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid Overlay */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)]"
        } bg-[size:4rem_4rem] pointer-events-none`}
      />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-20 ${
          theme === "dark"
            ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
            : "bg-white text-slate-700 hover:bg-slate-100"
        }`}
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Signup Card */}
      <div className="w-full max-w-md relative z-10 px-6">
        <div
          className={`relative rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border p-10 ${
            theme === "dark"
              ? "border-slate-700/50 bg-slate-900/70"
              : "border-slate-300/50 bg-white/80"
          }`}
        >
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8 text-center relative">
            <img
              src= {projectlogo}
              alt="Logo"
              className="w-24 h-24 mb-3 object-contain"
            />
            <h1
              className={`text-3xl font-bold mb-2 ${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
              }`}
            >
              Create Account
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Username */}
            <div className="relative group">
              <Mail className={`absolute left-4 top-4 text-xl ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none transition-all ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-cyan-500"
                    : "bg-slate-100/50 border-slate-300 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            {/* Full Name */}
            <div className="relative group">
              <User className={`absolute left-4 top-4 text-xl ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none transition-all ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-cyan-500"
                    : "bg-slate-100/50 border-slate-300 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

             {/* Password with strength meter */}
            <div className="relative group">
              <Lock className={`absolute left-4 top-4 text-xl ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none transition-all ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-cyan-500"
                    : "bg-slate-100/50 border-slate-300 text-slate-900 focus:border-blue-500"
                }`}
              />

              {/* Strength Bar */}
              {password && (
                <div className="mt-3">
                  <div className="h-2 w-full bg-slate-700/30 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(strength + 1) * 20}%` }}
                      className={`h-full ${getStrengthColor()} transition-all duration-400`}
                    />
                  </div>
                  <div
                    className={`text-xs mt-1 font-medium ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {getStrengthText()}
                    {feedback && ` — ${feedback}`}
                  </div>
                </div>
              )}
            </div>


            {/* Role Selection */}
            <div className="relative group">
              <Briefcase className={`absolute left-4 top-4 text-xl ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none transition-all appearance-none cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-cyan-500"
                    : "bg-slate-100/50 border-slate-300 text-slate-900 focus:border-blue-500"
                } ${!role && (theme === "dark" ? "text-slate-500" : "text-slate-400")}`}
              >
                <option value="" disabled>Select your role</option>
                {roles.map((r) => (
                  <option key={r} value={r.toLowerCase()} className={theme === "dark" ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-4 pointer-events-none">
                <svg className={`w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

           
            {/* Submit */}
            <button
              onClick={handleSignup}
              className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Message */}
          {message && (
            <p
              className={`mt-6 text-sm text-center font-medium ${
                message.includes("success")
                  ? theme === "dark"
                    ? "text-green-400"
                    : "text-green-600"
                  : theme === "dark"
                  ? "text-red-400"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Login Link */}
          <div
            className={`text-center text-sm mt-8 ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <span>Already have an account? </span>
             <button
              onClick={() => navigate("/login")}
              className={`font-semibold hover:underline ${
                theme === "dark"
                  ? "text-cyan-400 hover:text-cyan-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;