import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Calendar as Cal,
  Trash2,
  Edit,
  Menu,
  Moon,
  Sun,
  Home,
  Check,
} from "lucide-react";

function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    color: "cyan",
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const colorOptions = [
    { name: "cyan", class: "bg-cyan-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "purple", class: "bg-purple-500" },
    { name: "pink", class: "bg-pink-500" },
    { name: "indigo", class: "bg-indigo-500" },
    { name: "red", class: "bg-red-500" },
    { name: "orange", class: "bg-orange-500" },
    { name: "green", class: "bg-green-500" },
  ];

   const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  return d < today;
};


  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

const handleAddEvent = () => {
  // Prevent adding event on past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  if (selected < today) {
    alert("You cannot add events for past dates.");
    return;
  }

  if (!newEvent.title.trim()) return;

  const event = {
    id: Date.now(),
    title: newEvent.title,
    date: selectedDate,
    time: newEvent.time || "All Day",
    color: newEvent.color,
  };

  setEvents([...events, event]);
  setNewEvent({ title: "", time: "", color: "cyan" });
  setShowEventModal(false);
};

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className={`aspect-square ${
            isDarkMode ? "bg-slate-900/30" : "bg-slate-50"
          }`}
        />
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isToday = isSameDay(date, new Date());
      const isSelected = isSameDay(date, selectedDate);
      const dayEvents = getEventsForDate(date);

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`aspect-square p-2 rounded-xl transition-all relative group backdrop-blur-xl ${
            isSelected
              ? "bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg scale-105 border border-cyan-400/30"
              : isDarkMode
              ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50 hover:border-slate-600"
              : "bg-white/50 hover:bg-slate-50 text-slate-800 border border-slate-300/50 hover:border-slate-400"
          } ${isToday && !isSelected ? "ring-2 ring-cyan-400" : ""}`}
        >
          <div className="text-sm font-semibold mb-1">{day}</div>
          {dayEvents.length > 0 && (
            <div className="flex gap-1 justify-center flex-wrap">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`w-1.5 h-1.5 rounded-full ${
                    event.color === "cyan"
                      ? "bg-cyan-400"
                      : event.color === "blue"
                      ? "bg-blue-400"
                      : event.color === "purple"
                      ? "bg-purple-400"
                      : event.color === "pink"
                      ? "bg-pink-400"
                      : event.color === "red"
                      ? "bg-red-400"
                      : event.color === "green"
                      ? "bg-green-400"
                      : event.color === "indigo"
                      ? "bg-indigo-400"
                      : "bg-orange-400"
                  }`}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

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

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeInUp 0.6s ease-out;
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
          <button
            onClick={() => setShowEventModal(true)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus size={20} />
            New Event
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div
            className={`text-xs font-semibold px-3 py-2 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Quick Actions
          </div>
          <button
  onClick={() => setSelectedDate(new Date())}
  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all
    ${
      isDarkMode
        ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50 hover:border-slate-600"
        : "bg-white/50 hover:bg-slate-100 text-slate-800 border border-slate-300/50 hover:border-slate-400"
    }
  `}
>
  <Cal size={18} />
  <span className="text-sm">Today</span>
</button>
        </div>

        <div
          className={`border-t ${
            isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
          } p-3`}
        >
          <button
            onClick={() => navigate("/")}
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
              <Cal className={isDarkMode ? "text-cyan-400" : "text-blue-500"} size={28} />
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
              }`}>
                Calendar
              </h1>
            </div>
          </div>
          
        
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Grid */}
              <div className="lg:col-span-2 fade-up">
                <div
                  className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl ${
                    isDarkMode
                      ? "bg-slate-900/70 border border-slate-700/50"
                      : "bg-white/80 border border-slate-300/50"
                  }`}
                >
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={handlePrevMonth}
                      className={`p-2 rounded-xl transition-all ${
                        isDarkMode
                          ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                          : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
                      }`}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-bold">
                      {monthNames[currentDate.getMonth()]}{" "}
                      {currentDate.getFullYear()}
                    </h2>
                    <button
                      onClick={handleNextMonth}
                      className={`p-2 rounded-xl transition-all ${
                        isDarkMode
                          ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                          : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
                      }`}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className={`text-center text-sm font-semibold py-2 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {renderCalendarDays()}
                  </div>
                </div>
              </div>

              {/* Events Panel */}
              <div className="fade-up">
                <div
                  className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl ${
                    isDarkMode
                      ? "bg-slate-900/70 border border-slate-700/50"
                      : "bg-white/80 border border-slate-300/50"
                  }`}
                >
                  <h3 className="text-lg font-bold mb-4">
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>

                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Cal
                        size={48}
                        className={`mx-auto mb-3 ${
                          isDarkMode ? "text-slate-700" : "text-slate-300"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-slate-500" : "text-slate-500"
                        }`}
                      >
                        No events scheduled
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-4 rounded-xl backdrop-blur-xl transition-all hover:shadow-lg ${
                            isDarkMode
                              ? "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                              : "bg-slate-50 border border-slate-300/50 hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-3 h-3 rounded-full mt-1 ${
                                event.color === "cyan"
                                  ? "bg-cyan-500"
                                  : event.color === "blue"
                                  ? "bg-blue-500"
                                  : event.color === "purple"
                                  ? "bg-purple-500"
                                  : event.color === "pink"
                                  ? "bg-pink-500"
                                  : event.color === "red"
                                  ? "bg-red-500"
                                  : event.color === "green"
                                  ? "bg-green-500"
                                  : event.color === "indigo"
                                  ? "bg-indigo-500"
                                  : "bg-orange-500"
                              }`}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {event.title}
                              </h4>
                              <div className={`flex items-center gap-2 text-sm ${
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              }`}>
                                <Clock size={14} />
                                <span>{event.time}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode
                                  ? "hover:bg-slate-700/50 text-red-400"
                                  : "hover:bg-red-50 text-red-500"
                              }`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-6 max-w-md w-full shadow-2xl backdrop-blur-xl ${
              isDarkMode 
                ? "bg-slate-900/90 border border-slate-700/50" 
                : "bg-white/90 border border-slate-300/50"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Add New Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className={`p-2 rounded-xl transition-all ${
                  isDarkMode 
                    ? "hover:bg-slate-800/50 border border-slate-700/50" 
                    : "hover:bg-slate-100/50 border border-slate-300/50"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Enter event title..."
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-cyan-400/50 focus:border-cyan-400"
                      : "bg-white border-slate-300 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-cyan-400/50 focus:border-cyan-400"
                      : "bg-white border-slate-300 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() =>
                        setNewEvent({ ...newEvent, color: color.name })
                      }
                      className={`w-8 h-8 rounded-full ${color.class} transition-all ${
                        newEvent.color === color.name
                          ? "ring-2 ring-offset-2 ring-cyan-400 scale-110"
                          : "hover:scale-105"
                      } ${isDarkMode ? "ring-offset-slate-900" : "ring-offset-white"}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-cyan-400/30"
              >
                <Check size={20} />
                Add Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Calendar;