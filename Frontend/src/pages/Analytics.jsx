import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
  Menu,
  X,
  Home,
  BarChart3,
  TrendingUp,
  Activity,
  Database,
  RefreshCw,
  Calendar,
  AlertCircle,
  Moon,
  Sun,
} from "lucide-react";

// ✅ Correctly defined component
function Analytics() {


  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking");

  // ✅ Sync theme with localStorage
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // ✅ Log interactions with user_id
 const { user } = useUser();

const logInteraction = async (action, duration = null) => {
  try {
    // Prefer user from context, fallback to localStorage
    const user_id = user?.id || localStorage.getItem("user_id");
    if (!user_id) {
      console.warn("Skipping log — no user_id found yet");
      return;
    }

    const res = await fetch("http://localhost:8000/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        page: window.location.pathname,
        action,
        duration,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.error("Failed to log:", await res.text());
    } else {
      const data = await res.json();
      console.log("✅ Interaction logged:", data);
    }
  } catch (error) {
    console.error("Error logging interaction:", error);
  }
};

  // ✅ Track page visit and time spent
useEffect(() => {
  const user_id = user?.id || localStorage.getItem("user_id");
  if (!user_id) {
    console.warn("User not loaded yet — skipping analytics logging");
    return;
  }

  const startTime = Date.now();
  logInteraction("page_visit");

  return () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    logInteraction("page_leave", duration);
  };
}, [user]);

  // ✅ Check backend connection
 useEffect(() => {
  const checkBackend = async () => {
    const user_id = user?.id || localStorage.getItem("user_id");
    if (!user_id) return;

    try {
      const response = await fetch("http://localhost:8000/analytics/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          page: "/analytics",
          action: "backend_check",
        }),
      });
      setBackendStatus(response.ok ? "connected" : "error");
    } catch {
      setBackendStatus("disconnected");
    }
  };

  checkBackend();
  const interval = setInterval(checkBackend, 30000);
  return () => clearInterval(interval);
}, [user]);


  // ✅ Manual refresh
  const handleRefresh = () => {
    logInteraction("manual_refresh");
    document.querySelectorAll("iframe").forEach((iframe) => {
      iframe.src = iframe.src;
    });
  };
const userId = user?.id || localStorage.getItem("user_id");

const timeRangeMap = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];


const selectedFrom = timeRangeMap[selectedTimeRange] || "now-24h";


  // ✅ Dashboard panels (each has icon, color, and Grafana URL)
const dashboardPanels = [
  {
    id: 1,
    title: "User Interactions",
    description: "Track page visits, actions, and durations in real time.",
    grafanaUrl: `http://localhost:3000/d-solo/ad8dr7j/user_interactions
?orgId=1
&from=${selectedFrom}
&to=now
&timezone=browser
&var-user_id=${userId}
&panelId=2
&__feature.dashboardSceneSolo=true`,
    icon: BarChart3,
    color: "from-cyan-500 to-blue-500",
  },

  {
    id: 2,
    title: "Page Activity Overview",
    description: "See which pages are most visited and active.",
    grafanaUrl: `http://localhost:3000/d-solo/ad8dr7j/user_interactions
?orgId=1
&from=${selectedFrom}
&to=now
&timezone=browser
&var-user_id=${userId}
&panelId=3
&__feature.dashboardSceneSolo=true`,
    icon: TrendingUp,
    color: "from-blue-500 to-purple-500",
  },

  {
    id: 3,
    title: "Session Duration Trends",
    description: "Analyze how long the user stays engaged per page.",
    grafanaUrl: `http://localhost:3000/d-solo/ad8dr7j/user_interactions
?orgId=1
&from=${selectedFrom}
&to=now
&timezone=browser
&var-user_id=${userId}
&panelId=1
&__feature.dashboardSceneSolo=true`,
    icon: Database,
    color: "from-purple-500 to-pink-500",
  },
];


  // ✅ Toggle auto refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev);
    logInteraction(`auto_refresh_${!autoRefresh ? "enabled" : "disabled"}`);
  };

  // ✅ Auto refresh every 60s
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        document.querySelectorAll("iframe").forEach((iframe) => {
          iframe.src = iframe.src;
        });
        logInteraction("auto_refresh_cycle");
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // ✅ Backend status helpers
  const getStatusText = () => {
    switch (backendStatus) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
      case "error":
        return "Error Connecting";
      default:
        return "Checking...";
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case "connected":
        return "text-green-500";
      case "disconnected":
        return "text-red-500";
      case "error":
        return "text-yellow-500";
      default:
        return "text-slate-400";
    }
  };

  // ✅ Main return
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
          style={{
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl ${
            isDarkMode ? "bg-purple-500" : "bg-purple-400"
          } opacity-20 animate-pulse`}
          style={{
            animation: "pulse 10s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
        <div
          className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-pink-500" : "bg-pink-400"
          } opacity-10 animate-pulse`}
          style={{
            animation: "pulse 12s ease-in-out infinite",
            animationDelay: "4s",
          }}
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
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          }`}
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </div>
        </div>

        {/* Backend Status */}
        <div className="p-4">
          <div
            className={`text-xs font-semibold mb-1 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Backend Status
          </div>
          <div
            className={`p-3 rounded-xl backdrop-blur-xl ${
              isDarkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white/50 border border-slate-300/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  backendStatus === "connected"
                    ? "bg-green-500"
                    : backendStatus === "disconnected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                } ${backendStatus === "connected" ? "animate-pulse" : ""}`}
              />
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <div
              className={`text-xs mt-1 ${
                isDarkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              localhost:8000
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-auto p-4">
          <button
            onClick={() => {
              logInteraction("navigate_home");
              window.location.href = "/";
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 ${
              isDarkMode
                ? "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white"
                : "bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-900"
            }`}
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between backdrop-blur-xl ${
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
            <h1
              className={`text-2xl font-bold bg-clip-text text-transparent ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
              }`}
            >
              Analytics Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                  : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Calendar size={16} />
            <span>{timeRangeMap.find((r) => r.value === selectedTimeRange)?.label}</span>
          </div>
        </div>

        {/* Panels */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboardPanels.map((panel, index) => {
              const Icon = panel.icon;
              return (
                <div
                  key={index}
                  className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-slate-900/70 border border-slate-700/50"
                      : "bg-white/80 border border-slate-300/50"
                  }`}
                  style={{
                    opacity: 0,
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-xl bg-gradient-to-br ${panel.color} text-white`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-lg ${
                          isDarkMode ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {panel.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {panel.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl overflow-hidden border ${
                      isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
                    }`}
                    style={{ height: "300px" }}
                  >
                    <iframe
                      src={panel.grafanaUrl}
                      width="100%"
                      height="100%"
                      title={panel.title}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Analytics;