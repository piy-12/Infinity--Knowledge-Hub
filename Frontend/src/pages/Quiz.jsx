
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Brain,
  Trophy,
  RefreshCw,
  Check,
  XCircle,
  Clock,
  Target,
} from "lucide-react";

function Quiz() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [category, setCategory] = useState("9");
  const [difficulty, setDifficulty] = useState("medium");
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const categories = [
    { id: "9", name: "General Knowledge" },
    { id: "18", name: "Science: Computers" },
    { id: "19", name: "Mathematics" },
    { id: "21", name: "Sports" },
    { id: "23", name: "History" },
    { id: "17", name: "Science & Nature" },
    { id: "22", name: "Geography" },
    { id: "aptitude", name: "Aptitude & Reasoning" },
  ];

  const aptitudeQuestions = {
    easy: [
      {
        question: "If 5 workers can complete a task in 12 days, how many days will it take 3 workers to complete the same task?",
        correct: "20 days",
        answers: ["15 days", "18 days", "20 days", "24 days"]
      },
      {
        question: "A train travels 120 km in 2 hours. What is its average speed?",
        correct: "60 km/h",
        answers: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"]
      },
      {
        question: "If all roses are flowers and some flowers are red, which statement must be true?",
        correct: "Some roses may be red",
        answers: ["All roses are red", "Some roses may be red", "No roses are red", "All red things are roses"]
      },
      {
        question: "What comes next in the sequence: 2, 4, 8, 16, ?",
        correct: "32",
        answers: ["24", "28", "32", "36"]
      },
      {
        question: "If CAT is coded as 3120, what is DOG coded as?",
        correct: "41507",
        answers: ["41507", "31506", "51608", "41608"]
      },
      {
        question: "A book costs $15. If there's a 20% discount, what is the final price?",
        correct: "$12",
        answers: ["$10", "$11", "$12", "$13"]
      },
      {
        question: "Find the odd one out: 3, 9, 27, 81, 243",
        correct: "All are powers of 3",
        answers: ["3", "9", "243", "All are powers of 3"]
      },
      {
        question: "If 2 pencils cost $6, how much do 5 pencils cost?",
        correct: "$15",
        answers: ["$12", "$13", "$15", "$18"]
      },
      {
        question: "Which number should replace the question mark? 4, 9, 16, 25, ?",
        correct: "36",
        answers: ["30", "32", "35", "36"]
      },
      {
        question: "A car travels 150 km in 3 hours. How far will it travel in 5 hours at the same speed?",
        correct: "250 km",
        answers: ["200 km", "225 km", "250 km", "275 km"]
      }
    ],
    medium: [
      {
        question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
        correct: "7.5 degrees",
        answers: ["0 degrees", "7.5 degrees", "15 degrees", "22.5 degrees"]
      },
      {
        question: "If 40% of a number is 80, what is 25% of that number?",
        correct: "50",
        answers: ["40", "45", "50", "55"]
      },
      {
        question: "A is twice as old as B. Five years ago, A was three times as old as B. What is B's current age?",
        correct: "10 years",
        answers: ["8 years", "10 years", "12 years", "15 years"]
      },
      {
        question: "In a certain code, LONDON is written as MPOEPO. How is PARIS written?",
        correct: "QBSJT",
        answers: ["QBSJT", "OBSHR", "PBSIT", "QASIT"]
      },
      {
        question: "If the day before yesterday was Thursday, what will be the day after tomorrow?",
        correct: "Tuesday",
        answers: ["Sunday", "Monday", "Tuesday", "Wednesday"]
      },
      {
        question: "A shopkeeper marks his goods 40% above cost price and gives a 20% discount. What is his profit percentage?",
        correct: "12%",
        answers: ["8%", "10%", "12%", "15%"]
      },
      {
        question: "The average of 6 numbers is 30. If one number is excluded, the average becomes 28. What is the excluded number?",
        correct: "40",
        answers: ["35", "38", "40", "42"]
      },
      {
        question: "A can do a work in 15 days and B can do it in 20 days. If they work together, in how many days will they complete the work?",
        correct: "8.57 days",
        answers: ["7 days", "8 days", "8.57 days", "10 days"]
      },
      {
        question: "What is the next number in the series: 5, 11, 23, 47, ?",
        correct: "95",
        answers: ["89", "91", "93", "95"]
      },
      {
        question: "If WINTER is coded as 123456, what is WRITE coded as?",
        correct: "16245",
        answers: ["16234", "16245", "16345", "61245"]
      }
    ],
    hard: [
      {
        question: "A and B can complete a work in 12 days, B and C in 15 days, C and A in 20 days. How long will A alone take?",
        correct: "30 days",
        answers: ["24 days", "28 days", "30 days", "36 days"]
      },
      {
        question: "A boat travels downstream 30 km in 2 hours and upstream 18 km in 3 hours. What is the speed of the stream?",
        correct: "3 km/h",
        answers: ["2 km/h", "3 km/h", "4 km/h", "5 km/h"]
      },
      {
        question: "If 'REASONING' is coded as 'SFBTPOJOH', what is the code for 'APTITUDE'?",
        correct: "BQUJUVEF",
        answers: ["BQUJUVEF", "BQUJTUDE", "AQUITVEF", "BQTJUVEF"]
      },
      {
        question: "The average of 5 consecutive odd numbers is 27. What is the largest number?",
        correct: "31",
        answers: ["29", "31", "33", "35"]
      },
      {
        question: "In a group of 100 people, 72 like coffee, 58 like tea. If each person likes at least one, how many like both?",
        correct: "30",
        answers: ["26", "28", "30", "32"]
      },
      {
        question: "A train 300m long crosses a platform 600m long in 45 seconds. What is the speed of the train?",
        correct: "72 km/h",
        answers: ["60 km/h", "68 km/h", "72 km/h", "80 km/h"]
      },
      {
        question: "The ratio of ages of A and B is 5:7. After 10 years, the ratio becomes 3:4. What is A's current age?",
        correct: "20 years",
        answers: ["15 years", "20 years", "25 years", "30 years"]
      },
      {
        question: "A sum invested at 8% simple interest per annum becomes $1800 in 5 years. What was the principal amount?",
        correct: "$1285.71",
        answers: ["$1200", "$1250", "$1285.71", "$1300"]
      },
      {
        question: "Find the missing number: 2, 6, 12, 20, 30, ?",
        correct: "42",
        answers: ["38", "40", "42", "44"]
      },
      {
        question: "A cistern can be filled by two pipes in 20 and 30 minutes respectively. A third pipe can empty it in 15 minutes. If all three are opened together, in how long will the cistern be filled?",
        correct: "60 minutes",
        answers: ["45 minutes", "50 minutes", "60 minutes", "Cannot be filled"]
      }
    ]
  };

  useEffect(() => {
    if (quizStarted && !showResult && timeLeft > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      handleAnswer(null);
    }
  }, [timeLeft, quizStarted, showResult, answered]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let formattedQuestions;
      
      if (category === "aptitude") {
        // Use custom aptitude questions
        const aptitudeSet = aptitudeQuestions[difficulty];
        formattedQuestions = shuffleArray([...aptitudeSet]).slice(0, 10);
      } else {
        // Fetch from API for other categories
        const response = await fetch(
          `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
        );
        const data = await response.json();
        
        formattedQuestions = data.results.map((q) => ({
          question: decodeHTML(q.question),
          correct: decodeHTML(q.correct_answer),
          answers: shuffleArray([
            ...q.incorrect_answers.map(decodeHTML),
            decodeHTML(q.correct_answer),
          ]),
        }));
      }
      
      setQuestions(formattedQuestions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(30);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setLoading(false);
  };

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswer = (answer) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);
    
    if (answer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswered(false);
        setTimeLeft(30);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setTimeLeft(30);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 60) return "Good Job! 👍";
    if (percentage >= 40) return "Not Bad! 💪";
    return "Keep Practicing! 📚";
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
        <div
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? "bg-cyan-500" : "bg-cyan-400"
          } opacity-20 animate-pulse`}
          style={{ animationDuration: "8s" }}
        />
        <div
          className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl ${
            isDarkMode ? "bg-purple-500" : "bg-purple-400"
          } opacity-20 animate-pulse`}
          style={{ animationDuration: "10s", animationDelay: "1s" }}
        />
        <div
          className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-pink-500" : "bg-pink-400"
          } opacity-15 animate-pulse`}
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? "bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)]" 
          : "bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)]"
      } bg-[size:4rem_4rem] pointer-events-none`} />

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
            <Brain size={20} />
            <span>Quiz Master</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div
            className={`text-xs font-semibold px-3 py-2 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Statistics
          </div>
          
          <div className="space-y-3">
            <div
              className={`p-4 rounded-xl backdrop-blur-xl ${
                isDarkMode
                  ? "bg-slate-800/50 border border-slate-700/50"
                  : "bg-white/50 border border-slate-300/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className={isDarkMode ? "text-yellow-400" : "text-yellow-500"} size={20} />
                <span className="text-sm font-semibold">Current Score</span>
              </div>
              <div className="text-3xl font-bold">{score}</div>
            </div>

            <div
              className={`p-4 rounded-xl backdrop-blur-xl ${
                isDarkMode
                  ? "bg-slate-800/50 border border-slate-700/50"
                  : "bg-white/50 border border-slate-300/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className={isDarkMode ? "text-cyan-400" : "text-cyan-500"} size={20} />
                <span className="text-sm font-semibold">Progress</span>
              </div>
              <div className="text-xl font-bold">
                {quizStarted ? `${currentQuestion + 1} / ${questions.length}` : "0 / 0"}
              </div>
            </div>

            {quizStarted && !showResult && (
              <div
                className={`p-4 rounded-xl backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-slate-800/50 border border-slate-700/50"
                    : "bg-white/50 border border-slate-300/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={timeLeft <= 10 ? "text-red-500" : isDarkMode ? "text-purple-400" : "text-purple-500"} size={20} />
                  <span className="text-sm font-semibold">Time Left</span>
                </div>
                <div className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : ""}`}>
                  {timeLeft}s
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
              <Brain className={isDarkMode ? "text-cyan-400" : "text-blue-500"} size={28} />
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
              }`}>
                Quiz Challenge
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl transition-all ${
              isDarkMode
                ? "hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                : "hover:bg-slate-100/50 border border-slate-300/50 hover:border-slate-400"
            }`}
          >
            {isDarkMode ? <Brain size={20} /> : <Brain size={20} />}
          </button>
        </div>

        {/* Quiz Content */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="max-w-3xl w-full">
            {!quizStarted ? (
              <div
                className={`rounded-2xl p-8 shadow-2xl backdrop-blur-xl transform transition-all duration-500 ${
                  isDarkMode
                    ? "bg-slate-900/70 border border-slate-700/50"
                    : "bg-white/80 border border-slate-300/50"
                }`}
              >
                <h2 className="text-3xl font-bold mb-6 text-center">Start Your Quiz</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Select Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            category === cat.id
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-2 border-cyan-400 shadow-lg"
                              : isDarkMode
                              ? "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600 hover:scale-105"
                              : "bg-white/50 text-slate-700 border border-slate-300/50 hover:border-slate-400 hover:scale-105"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Select Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["easy", "medium", "hard"].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className={`p-3 rounded-xl text-sm font-medium capitalize transition-all ${
                            difficulty === diff
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-blue-400 shadow-lg"
                              : isDarkMode
                              ? "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600 hover:scale-105"
                              : "bg-white/50 text-slate-700 border border-slate-300/50 hover:border-slate-400 hover:scale-105"
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={fetchQuestions}
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  >
                    {loading ? "Loading..." : "Start Quiz"}
                  </button>
                </div>
              </div>
            ) : showResult ? (
              <div
                className={`rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center transform transition-all duration-500 ${
                  isDarkMode
                    ? "bg-slate-900/70 border border-slate-700/50"
                    : "bg-white/80 border border-slate-300/50"
                }`}
              >
                <Trophy className={`mx-auto mb-4 ${isDarkMode ? "text-yellow-400" : "text-yellow-500"} animate-bounce`} size={64} />
                <h2 className="text-4xl font-bold mb-4">{getScoreMessage()}</h2>
                <div className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  {score} / {questions.length}
                </div>
                <p className={`text-xl mb-8 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  You got {Math.round((score / questions.length) * 100)}% correct!
                </p>
                <button
                  onClick={resetQuiz}
                  className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>
              </div>
            ) : (
              <div
                key={currentQuestion}
                className={`rounded-2xl p-8 shadow-2xl backdrop-blur-xl transform transition-all duration-500 ${
                  isDarkMode
                    ? "bg-slate-900/70 border border-slate-700/50"
                    : "bg-white/80 border border-slate-300/50"
                }`}
              >
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <div className={`flex items-center gap-2 ${timeLeft <= 10 ? "text-red-500" : ""}`}>
                      <Clock size={18} />
                      <span className="font-bold">{timeLeft}s</span>
                    </div>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-8">
                  {questions[currentQuestion]?.question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestion]?.answers.map((answer, index) => {
                    const isSelected = selectedAnswer === answer;
                    const isCorrect = answer === questions[currentQuestion].correct;
                    const showCorrect = answered && isCorrect;
                    const showIncorrect = answered && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(answer)}
                        disabled={answered}
                        className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 hover:scale-105 disabled:hover:scale-100 ${
                          showCorrect
                            ? "bg-green-500 text-white border-2 border-green-400 shadow-lg"
                            : showIncorrect
                            ? "bg-red-500 text-white border-2 border-red-400 shadow-lg"
                            : isDarkMode
                            ? "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600"
                            : "bg-white/50 text-slate-700 border border-slate-300/50 hover:border-slate-400"
                        }`}
                      >
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showCorrect || showIncorrect
                            ? "bg-white/20"
                            : isDarkMode
                            ? "bg-slate-700"
                            : "bg-slate-200"
                        }`}>
                          {showCorrect ? <Check size={20} /> : showIncorrect ? <XCircle size={20} /> : String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{answer}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;