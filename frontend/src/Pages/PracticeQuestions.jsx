import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const domains = [
  { id: 'javascript', name: 'JavaScript', icon: '💻' },
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'nodejs', name: 'Node.js', icon: '🟢' },
  { id: 'html-css', name: 'HTML & CSS', icon: '🎨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'sql', name: 'SQL', icon: '🗃️' },
  { id: 'aws', name: 'AWS', icon: '☁️' },
  { id: 'devops', name: 'DevOps', icon: '🔄' },
  { id: 'dsa', name: 'Data Structures', icon: '📊' },
  { id: 'system-design', name: 'System Design', icon: '🏗️' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒' },
  { id: 'mobile-dev', name: 'Mobile Dev', icon: '📱' },
  { id: 'testing', name: 'Software Testing', icon: '🧪' },
];

const questions = [
  {
    id: 1,
    domain: 'javascript',
    question: 'What is the output of `console.log(2 + "2")` in JavaScript?',
    options: ['4', '22', 'NaN', 'Error'],
    correctAnswer: '22',
    explanation: 'In JavaScript, the + operator performs string concatenation when one of the operands is a string.'
  },
  {
    id: 2,
    domain: 'javascript',
    question: 'Which of the following is NOT a JavaScript framework?',
    options: ['React', 'Angular', 'Vue', 'Django'],
    correctAnswer: 'Django',
    explanation: 'Django is a Python web framework, not a JavaScript framework.'
  },
  {
    id: 3,
    domain: 'html-css',
    question: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Creative Style System',
      'Cascading Style Sheets',
      'Colorful Style Sheets'
    ],
    correctAnswer: 'Cascading Style Sheets',
    explanation: 'CSS stands for Cascading Style Sheets, which is used for styling web pages.'
  },
  {
    id: 4,
    domain: 'javascript',
    question: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctAnswer: 'push()',
    explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.'
  },
  {
    id: 5,
    domain: 'javascript',
    question: 'What is the correct way to create a function in JavaScript?',
    options: [
      'function = myFunction()',
      'function myFunction()',
      'create function myFunction()',
      'function:myFunction()'
    ],
    correctAnswer: 'function myFunction()',
    explanation: 'The correct syntax for function declaration in JavaScript is `function functionName() { }`.'
  },
  {
    id: 6,
    domain: 'react',
    question: 'What is the correct way to create a React component?',
    options: [
      'function MyComponent() { return <div>Hello</div> }',
      'const MyComponent = () => { <div>Hello</div> }',
      'class MyComponent { render() { return <div>Hello</div> } }',
      'All of the above'
    ],
    correctAnswer: 'function MyComponent() { return <div>Hello</div> }',
    explanation: 'All are valid ways to create React components, but the first one is the most common functional component syntax.'
  },
  {
    id: 7,
    domain: 'nodejs',
    question: 'Which of the following is a core module in Node.js?',
    options: ['fs', 'express', 'mongoose', 'react'],
    correctAnswer: 'fs',
    explanation: 'fs is a core module in Node.js used for file system operations.'
  },
  {
    id: 8,
    domain: 'dsa',
    question: 'What is the time complexity of a binary search algorithm?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search has a time complexity of O(log n) as it divides the search space in half with each comparison.'
  },
  {
    id: 9,
    domain: 'system-design',
    question: 'What is the purpose of a CDN in system design?',
    options: [
      'To store user session data',
      'To serve static content from locations closer to users',
      'To handle database queries',
      'To manage user authentication'
    ],
    correctAnswer: 'To serve static content from locations closer to users',
    explanation: 'A CDN (Content Delivery Network) helps serve static content from servers that are geographically closer to users, reducing latency.'
  },
  {
    id: 10,
    domain: 'html-css',
    question: 'Which CSS property is used to change the text color?',
    options: ['text-color', 'font-color', 'color', 'text-style'],
    correctAnswer: 'color',
    explanation: 'The `color` property in CSS is used to set the color of text.'
  }
];

const PracticeQuestions = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  // Filter questions based on selected domain
  const filteredQuestions = selectedDomain 
    ? questions.filter(q => q.domain === selectedDomain)
    : [];

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  
  const startQuiz = (domainId) => {
    setSelectedDomain(domainId);
    setQuizStarted(true);
    // Reset all quiz state
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setScore(0);
    setShowResult(false);
    setAnswers({});
    setTimeLeft(300);
  };

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, showResult]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        selectedOption,
        isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation
      }
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = answers[questions[currentQuestionIndex - 1].id];
      setSelectedOption(prevAnswer?.selectedOption || '');
    }
  };

  const handleFinish = () => {
    setShowResult(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setScore(0);
    setShowResult(false);
    setAnswers({});
    setTimeLeft(300);
  };

  const getProgressPercentage = () => {
    if (filteredQuestions.length === 0) return 0;
    return ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
  };

  // Domain selection screen
  if (!quizStarted) {
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Select a Domain</h1>
              <p className="text-gray-600 text-sm mb-6">Choose a topic to begin practicing</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {domains.map((domain) => (
                  <motion.div
                    key={domain.id}
                    whileHover={{ 
                      y: -3,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 border border-gray-200 rounded-lg bg-white hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 h-full flex flex-col items-center justify-center text-center"
                    onClick={() => startQuiz(domain.id)}
                  >
                    <div className="text-2xl mb-2">{domain.icon}</div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{domain.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {questions.filter(q => q.domain === domain.id).length} Qs
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    const isPerfect = score === filteredQuestions.length;
    const passed = score >= filteredQuestions.length / 2;
    
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 mb-6">
            <span className="text-4xl">{isPerfect ? '🎉' : passed ? '👍' : '💪'}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isPerfect ? 'Perfect!' : passed ? 'Quiz Completed!' : 'Good Try!'}
          </h1>
          <p className="text-gray-600 mb-8">
            You scored <span className="font-semibold text-indigo-600">{score} out of {filteredQuestions.length}</span> questions correctly
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Correct Answers:</h2>
            <div className="space-y-4">
              {filteredQuestions.map((q, index) => (
                <div key={q.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-800 mb-2">Q{index + 1}. {q.question}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Correct Answer:</span>
                    <span className="text-sm font-medium text-green-600">{q.correctAnswer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 sm:flex-none"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/practice-questions')}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
            >
              Choose Another Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>
          
          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 ${
                    selectedOption === option 
                      ? 'border-indigo-500 bg-indigo-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedOption === option && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`px-5 py-2.5 text-sm font-medium rounded-md ${
              currentQuestionIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            ← Previous
          </button>
          
          <button
            type="button"
            onClick={isLastQuestion ? handleFinish : handleNext}
            disabled={!selectedOption}
            className={`px-5 py-2.5 text-sm font-medium rounded-md ${
              !selectedOption
                ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isLastQuestion ? 'Submit Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestions;