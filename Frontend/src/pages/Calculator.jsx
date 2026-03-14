import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Moon,
  Sun,
  Home,
  Calculator as Calcicon,
  Delete,
  RotateCcw,
  History,
  Trash2,
} from "lucide-react";

function Calculator() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);


  const handleNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = performOperation(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performOperation = (firstValue, secondValue, op) => {
    switch (op) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : "Error";
      case "%":
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = performOperation(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${result}`;
      
      setHistory([calculation, ...history.slice(0, 9)]);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    const result = value * value;
    setDisplay(String(result));
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    const result = Math.sqrt(value);
    setDisplay(String(result));
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const buttons = [
    { label: "C", onClick: handleClear, className: "operator", span: 1 },
    { label: "⌫", onClick: handleBackspace, className: "operator", span: 1 },
    { label: "%", onClick: () => handleOperation("%"), className: "operator", span: 1 },
    { label: "÷", onClick: () => handleOperation("÷"), className: "operator", span: 1 },
    
    { label: "7", onClick: () => handleNumber(7), className: "number", span: 1 },
    { label: "8", onClick: () => handleNumber(8), className: "number", span: 1 },
    { label: "9", onClick: () => handleNumber(9), className: "number", span: 1 },
    { label: "×", onClick: () => handleOperation("×"), className: "operator", span: 1 },
    
    { label: "4", onClick: () => handleNumber(4), className: "number", span: 1 },
    { label: "5", onClick: () => handleNumber(5), className: "number", span: 1 },
    { label: "6", onClick: () => handleNumber(6), className: "number", span: 1 },
    { label: "-", onClick: () => handleOperation("-"), className: "operator", span: 1 },
    
    { label: "1", onClick: () => handleNumber(1), className: "number", span: 1 },
    { label: "2", onClick: () => handleNumber(2), className: "number", span: 1 },
    { label: "3", onClick: () => handleNumber(3), className: "number", span: 1 },
    { label: "+", onClick: () => handleOperation("+"), className: "operator", span: 1 },
    
    { label: "±", onClick: handleToggleSign, className: "number", span: 1 },
    { label: "0", onClick: () => handleNumber(0), className: "number", span: 1 },
    { label: ".", onClick: handleDecimal, className: "number", span: 1 },
    { label: "=", onClick: handleEquals, className: "equals", span: 1 },
  ];

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
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Calcicon size={20} />
            <span>Calculator</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between px-3 py-2">
            <div
              className={`text-xs font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              History
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className={`p-1 rounded transition-colors ${
                  isDarkMode
                    ? "hover:bg-slate-800/50 text-slate-400"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
                title="Clear History"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-8">
              <History
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
                No calculations yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((calc, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl text-sm backdrop-blur-xl transition-all ${
                    isDarkMode
                      ? "bg-slate-800/50 text-slate-300 border border-slate-700/50"
                      : "bg-white/50 text-slate-700 border border-slate-300/50"
                  }`}
                >
                  {calc}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`space-y-2 p-3 border-t ${
          isDarkMode ? "border-slate-700/50" : "border-slate-300/50"
        }`}>
          <button
            onClick={handleSquare}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isDarkMode
                ? "hover:bg-slate-800/50 text-slate-300 border border-transparent hover:border-slate-700/50"
                : "hover:bg-slate-100/50 text-slate-700 border border-transparent hover:border-slate-300/50"
            }`}
          >
            <span className="text-sm font-semibold">x²</span>
            <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>Square</span>
          </button>
          <button
            onClick={handleSquareRoot}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isDarkMode
                ? "hover:bg-slate-800/50 text-slate-300 border border-transparent hover:border-slate-700/50"
                : "hover:bg-slate-100/50 text-slate-700 border border-transparent hover:border-slate-300/50"
            }`}
          >
            <span className="text-sm font-semibold">√x</span>
            <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>Square Root</span>
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
              <Calcicon className={isDarkMode ? "text-cyan-400" : "text-blue-500"} size={28} />
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
              }`}>
                Calculator
              </h1>
            </div>
          </div>
          
          
        </div>

        {/* Calculator Content */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="max-w-md w-full fade-up">
            <div
              className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl ${
                isDarkMode
                  ? "bg-slate-900/70 border border-slate-700/50"
                  : "bg-white/80 border border-slate-300/50"
              }`}
            >
              {/* Display */}
              <div
                className={`rounded-xl p-6 mb-5 min-h-[100px] flex items-end justify-end backdrop-blur-xl ${
                  isDarkMode 
                    ? "bg-slate-800/50 border border-slate-700/50" 
                    : "bg-slate-50 border border-slate-300/50"
                }`}
              >
                <div className="text-right w-full">
                  {operation && (
                    <div
                      className={`text-sm mb-2 ${
                        isDarkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {previousValue} {operation}
                    </div>
                  )}
                  <div className="text-4xl font-bold break-all">
                    {display}
                  </div>
                </div>
              </div>

              {/* Buttons Grid */}
              <div className="grid grid-cols-4 gap-3">
                {buttons.map((button, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={button.onClick}
                    className={`
                      ${button.span === 2 ? "col-span-2" : ""}
                      h-16 rounded-xl font-semibold text-lg transition-all shadow-md backdrop-blur-xl
                      ${
                        button.className === "number"
                          ? isDarkMode
                            ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-100 border border-slate-700/50 hover:border-slate-600"
                            : "bg-white/50 hover:bg-slate-50 text-slate-900 border border-slate-300/50 hover:border-slate-400"
                          : button.className === "operator"
                          ? "bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border border-cyan-400/30"
                          : "bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border border-blue-400/30"
                      }
                    `}
                  >
                    {button.label}
                  </motion.button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;