import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMic, FiPaperclip, FiPlus, FiMinus } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// console.log("api key",apiKey);


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userName = 'Alexis'; // This would typically come from user context
  const [chat, setChat] = useState(null);
  const [model, setModel] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize Gemini
  useEffect(() => {
    const initGemini = async () => {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });
        setModel(model);
        setChat(chat);
      } catch (error) {
        console.error('Error initializing Gemini:', error);
      }
    };

    initGemini();
  }, []);

  const quickPrompts = [
    'Create image',
    'Analyze code',
    'Summarize text',
    'Make a plan'
    // 'Surprise me'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !chat) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to Gemini
      const result = await chat.sendMessage(inputValue);
      const response = await result.response;
      const text = response.text();

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: text,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
    // Optional: Auto-submit the quick prompt
    // const event = { preventDefault: () => {} };
    // handleSubmit(event);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleNewChat = () => {
    // Clear messages to start a new chat
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="flex h-screen bg-white relative">
      {/* Mobile menu button - moved to bottom */}
      <div className="fixed bottom-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? (
            <FiMinus className="w-5 h-5" />
          ) : (
            <FiPlus className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64`}
      >
        <Sidebar onNewChat={handleNewChat} onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden md:ml-64 ">
        {/* Add padding to the bottom of the message container */}
        <div className="flex-1 flex flex-col h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center mt-8 mb-24 md:mt-[13rem] max-w-full ">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <FaRobot className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Hello {userName} 👋</h1>
            <p className="text-gray-600 max-w-md mb-6 sm:mb-8 px-2">
              I'm your AI assistant. I'm here to help you with any questions or tasks you have.
            </p>
            
            <div className="w-full max-w-2xl px-2 sm:px-0">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="How can AI help you today?"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-28 sm:pr-32 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                  />
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex gap-1 sm:gap-2">
                    <button 
                      type="button" 
                      className="p-2 text-gray-400 hover:text-gray-600"
                      aria-label="Attach file"
                    >
                      <FiPaperclip className="w-5 h-5" />
                    </button>
                    <button 
                      type="button" 
                      className="p-2 text-gray-400 hover:text-gray-600"
                      aria-label="Voice message"
                    >
                      <FiMic className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-8">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Choose a quick prompt</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 mt-[5rem]">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[90%] sm:max-w-3xl rounded-2xl px-3 sm:px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 text-right ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(new Date(message.timestamp))}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSubmit} className="flex items-center px-2 sm:px-4">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <button 
                      type="button" 
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Attach file"
                    >
                      <FiPaperclip className="w-5 h-5" />
                    </button>
                    <button 
                      type="button" 
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Voice message"
                    >
                      <FiMic className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="ml-1 sm:ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
