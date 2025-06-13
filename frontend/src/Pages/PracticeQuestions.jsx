import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const questions = [
  {
    id: 1,
    question: 'What is the output of `console.log(2 + "2")` in JavaScript?',
    options: ['4', '22', 'NaN', 'Error'],
    correctAnswer: '22',
    explanation: 'In JavaScript, the + operator performs string concatenation when one of the operands is a string.'
  },
  {
    id: 2,
    question: 'Which of the following is NOT a JavaScript framework?',
    options: ['React', 'Angular', 'Vue', 'Django'],
    correctAnswer: 'Django',
    explanation: 'Django is a Python web framework, not a JavaScript framework.'
  },
  {
    id: 3,
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
    question: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctAnswer: 'push()',
    explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.'
  },
  {
    id: 5,
    question: 'What is the correct way to create a function in JavaScript?',
    options: [
      'function = myFunction()',
      'function myFunction()',
      'create function myFunction()',
      'function:myFunction()'
    ],
    correctAnswer: 'function myFunction()',
    explanation: 'The correct syntax for function declaration in JavaScript is `function functionName() { }`.'
  }
];

const PracticeQuestions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;
    const passed = score >= questions.length / 2;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header Section */}
            <div className={`${isPerfect ? 'bg-gradient-to-r from-green-500 to-emerald-600' : passed ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'} px-8 py-10 text-center`}>
              <div className="max-w-md mx-auto">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(percentage / 100) * 283}, 283`}
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="55"
                      className="text-3xl font-bold"
                      textAnchor="middle"
                      fill="white"
                      style={{ fontSize: '28px', fontWeight: '700' }}
                    >
                      {percentage}%
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isPerfect ? (
                      <span className="text-5xl">🎉</span>
                    ) : passed ? (
                      <span className="text-5xl">👍</span>
                    ) : (
                      <span className="text-5xl">💪</span>
                    )}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isPerfect ? 'Perfect Score!' : passed ? 'Quiz Completed!' : 'Keep Practicing!'}
                </h1>
                <p className="text-white/90 text-lg">
                  You scored {score} out of {questions.length} questions correct
                </p>
                <p className="mt-2 text-white/80">
                  {isPerfect
                    ? 'Outstanding! You aced the quiz!'
                    : passed
                    ? 'Well done! You passed with flying colors!'
                    : 'Review the answers below and try again!'}
                </p>
              </div>
            </div>

            {/* Results Summary */}
            <div className="px-6 py-8 sm:px-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-indigo-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">Performance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Correct Answers</span>
                      <span className="font-medium text-green-600">{score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Incorrect Answers</span>
                      <span className="font-medium text-red-600">{questions.length - score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium text-indigo-700">{percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleRestart}
                      className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-amber-200 rounded-lg text-amber-700 font-medium hover:bg-amber-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Try Again
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full flex items-center justify-center px-4 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                  Detailed Results
                </h2>
                <div className="space-y-4">
                  {questions.map((q, index) => {
                    const answer = answers[q.id];
                    const isCorrect = answer?.isCorrect;
                    
                    return (
                      <div 
                        key={q.id}
                        className={`p-5 rounded-xl border ${
                          isCorrect 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex">
                          <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                            isCorrect 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {isCorrect ? '✓' : '✗'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-3">
                              <span className="font-bold text-indigo-700">Q{index + 1}:</span> {q.question}
                            </h3>
                            
                            <div className="ml-6 space-y-3">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Your answer:</span>
                                <p className={`mt-1 px-3 py-2 rounded-lg inline-block ${
                                  isCorrect 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {answer?.selectedOption || 'Not answered'}
                                </p>
                              </div>
                              
                              {!isCorrect && (
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Correct answer:</span>
                                  <p className="mt-1 px-3 py-2 rounded-lg bg-green-100 text-green-800 inline-block">
                                    {q.correctAnswer}
                                  </p>
                                </div>
                              )}
                              
                              <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
                                <span className="text-sm font-medium text-gray-600">Explanation:</span>
                                <p className="mt-1 text-gray-700">{q.explanation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final CTA */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold text-indigo-900 mb-3">How did you find this quiz?</h3>
                <p className="text-gray-600 mb-5">We'd love to hear your feedback to help us improve!</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    It was great! 👍
                  </button>
                  <button className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Could be better
                  </button>
                  <button className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Share Feedback
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Practice Questions</h1>
              <div className="bg-indigo-700 text-white text-sm font-medium px-3 py-1 rounded-full">
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-indigo-400 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-indigo-100">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(getProgressPercentage())}% Complete</span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                {currentQuestion.question}
              </h2>
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === option 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 ${
                        selectedOption === option 
                          ? 'border-indigo-500 bg-indigo-100' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option && (
                          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                Previous
              </button>
              
              <button
                type="button"
                onClick={isLastQuestion ? handleFinish : handleNext}
                disabled={!selectedOption}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  !selectedOption
                    ? 'bg-indigo-300 cursor-not-allowed text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isLastQuestion ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PracticeQuestions;