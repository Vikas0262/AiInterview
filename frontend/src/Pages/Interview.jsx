import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FiArrowLeft, 
  FiMic, 
  FiMicOff, 
  FiVideo, 
  FiVideoOff, 
  FiPhone, 
  FiMessageSquare 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ChatWithAvatar from '../components/ChatWithAvatar';
import AnimatedAvatar from '../components/AnimatedAvatar';

// Gemini API client
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

const Interview = () => {
  // State management
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start with muted
  const [isVideoOn, setIsVideoOn] = useState(false); // Start with video off
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'AI', 
      message: 'Hello! Welcome to your interview. I\'ll be your interviewer today. Please enable your microphone and camera when ready.', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isSpeaking: false
    },
  ]);
  
  // Refs and hooks
  const videoRef = useRef(null);
  const navigate = useNavigate();
  
  // Initialize video stream
  useEffect(() => {
    let stream = null;
    const currentVideoRef = videoRef.current;
    
    const enableMedia = async () => {
      // If both mic and camera are off, don't request any media
      if (isMuted && !isVideoOn) {
        if (currentVideoRef?.srcObject) {
          currentVideoRef.srcObject.getTracks().forEach(track => track.stop());
          currentVideoRef.srcObject = null;
        }
        return;
      }

      try {
        // If video is off, only request audio if not muted
        if (!isVideoOn) {
          if (!isMuted) {
            const audioStream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: false
            });
            
            if (currentVideoRef) {
              // Stop any existing tracks
              if (currentVideoRef.srcObject) {
                currentVideoRef.srcObject.getTracks().forEach(track => track.stop());
              }
              currentVideoRef.srcObject = audioStream;
            }
          }
          return;
        }
        
        // If video is on, request both audio and video
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: !isMuted
        });
        
        if (currentVideoRef) {
          // Stop any existing tracks
          if (currentVideoRef.srcObject) {
            currentVideoRef.srcObject.getTracks().forEach(track => track.stop());
          }
          currentVideoRef.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        // If access is denied, update state to reflect this
        if (err.name === 'NotAllowedError') {
          alert('Please allow camera and microphone access to continue with the interview.');
          setIsMuted(true);
          setIsVideoOn(false);
        } else if (err.name === 'NotFoundError') {
          alert('Required media device not found. Please check your camera and microphone.');
          setIsVideoOn(false);
        }
      }
    };
    
    enableMedia();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, isMuted]);
  
  // Handle sending a new message
  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isSpeaking: false
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting perspective. Could you elaborate more on that?",
        "I appreciate your answer. Let me ask you another question...",
        "Great point! Now, moving on to the next topic...",
        "I see. What skills do you think are most important for this role?",
        "Thanks for sharing. Let's discuss your experience with..."
      ];
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'AI',
        message: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isSpeaking: true
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };
  
  // Toggle between chat and video modes
  const toggleChatMode = () => {
    setIsInChatMode(!isInChatMode);
  };
  
  // Toggle mute
  const toggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (!newMutedState && recognition) {
      // If unmuting, start listening
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Please allow microphone access to use voice commands.');
        setIsMuted(true);
      }
    } else if (recognition) {
      // If muting, stop listening
      recognition.stop();
      setIsListening(false);
    }
  };
  
  // Toggle video
  const toggleVideo = async () => {
    const newVideoState = !isVideoOn;
    
    // If we're turning video off, stop all video tracks
    if (!newVideoState && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getVideoTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsVideoOn(newVideoState);
    
    if (newVideoState) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Please allow camera access to enable video.');
        setIsVideoOn(false);
      }
    }
  };
  
  // Process user speech and get response from Gemini
  const processUserInput = useCallback(async (text) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        sender: 'User',
        message: text,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isSpeaking: false
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      // Get response from Gemini
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI interviewer. Respond to this in a professional and helpful manner: ${text}`
            }]
          }]
        })
      });
      
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";
      
      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'AI',
        message: aiResponse,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isSpeaking: true
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
      // Speak the response
      const speech = new SpeechSynthesisUtterance(aiResponse);
      speech.onend = () => {
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id ? {...msg, isSpeaking: false} : msg
          )
        );
      };
      window.speechSynthesis.speak(speech);
      
    } catch (error) {
      console.error('Error processing response:', error);
      const errorMessage = {
        id: Date.now(),
        sender: 'AI',
        message: "I'm having trouble processing your request. Please try again.",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isSpeaking: false
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, []);
  
  // Set up speech recognition
  useEffect(() => {
    if (!recognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      // If we have a final result, process it
      if (event.results[0].isFinal) {
        processUserInput(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice commands.');
        setIsMuted(true);
      }
    };
    
    recognition.onend = () => {
      if (!isMuted && recognition) {
        recognition.start();
      }
    };
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isMuted, processUserInput]);
  
  // Handle end call
  const endCall = () => {
    setShowEndCallConfirm(true);
  };
  
  // Confirm end call
  const confirmEndCall = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    navigate('/');
  };
  
  // Cancel end call
  const cancelEndCall = () => {
    setShowEndCallConfirm(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Back"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-lg">AI-Powered Interview</h1>
              <p className="text-sm text-gray-500">
                {isInChatMode ? 'Chat Mode' : 'Video Interview'}
              </p>
            </div>
          </div>
          <button 
            onClick={toggleChatMode}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center space-x-2"
          >
            <FiMessageSquare className="w-4 h-4" />
            <span>{isInChatMode ? 'Switch to Video' : 'Switch to Chat'}</span>
          </button>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col md:flex-row">
          {/* Video/Chat Area */}
          <div className="flex-1 flex flex-col mb-6 md:mb-0 md:mr-6">
            {isInChatMode ? (
              <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
                <ChatWithAvatar 
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={isProcessing}
                />
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg flex-1 relative overflow-hidden flex items-center justify-center">
                {/* Main Video Feed */}
                <div className="text-center p-6">
                  <div className="relative w-48 h-48 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 bg-blue-400 rounded-full flex items-center justify-center">
                        <div className="relative w-full h-full">
                          {/* Face */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-32 bg-blue-300 rounded-full"></div>
                          
                          {/* Eyes */}
                          <div className="absolute top-12 left-12 w-6 h-6 bg-white rounded-full"></div>
                          <div className="absolute top-12 right-12 w-6 h-6 bg-white rounded-full"></div>
                          
                          {/* Eye pupils - animate when speaking or listening */}
                          <div 
                            className={`absolute top-14 left-14 w-3 h-3 bg-blue-800 rounded-full transition-transform duration-300 ${(chatMessages.some(msg => msg.sender === 'AI' && msg.isSpeaking) || isListening) ? 'animate-bounce' : ''}`}
                          ></div>
                          <div 
                            className={`absolute top-14 right-14 w-3 h-3 bg-blue-800 rounded-full transition-transform duration-300 ${(chatMessages.some(msg => msg.sender === 'AI' && msg.isSpeaking) || isListening) ? 'animate-bounce' : ''}`}
                            style={{animationDelay: '0.2s'}}
                          ></div>
                          
                          {/* Smile - changes based on speaking/listening state */}
                          <div 
                            className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-8 border-b-4 border-blue-800 rounded-full transition-all duration-300 ${
                              chatMessages.some(msg => msg.sender === 'AI' && msg.isSpeaking) 
                                ? 'w-16 h-8 border-b-4' 
                                : isListening 
                                  ? 'w-12 h-6 border-b-2' 
                                  : 'w-16 h-8 border-b-4'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Speaking/Listening indicator */}
                    {(chatMessages.some(msg => msg.sender === 'AI' && msg.isSpeaking) || isListening) && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i}
                            className={`w-2 h-6 rounded-full animate-pulse ${
                              chatMessages.some(msg => msg.sender === 'AI' && msg.isSpeaking) 
                                ? 'bg-blue-300' 
                                : 'bg-green-300'
                            }`}
                            style={{
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: '0.8s'
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-white font-medium text-xl mb-1">AI Interviewer</h2>
                    <div className="inline-flex items-center bg-blue-500 bg-opacity-80 text-white text-xs px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      <span>Live</span>
                    </div>
                  </div>
                </div>

                {/* User Video */}
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-900 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    {isVideoOn ? (
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover"
                        onCanPlay={() => {
                          if (videoRef.current) {
                            videoRef.current.play().catch(e => console.error('Error playing video:', e));
                          }
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <div className="text-2xl mb-2">🎥</div>
                        <div className="text-sm">Camera is off</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                  <button 
                    onClick={toggleMute}
                    className={`p-3 rounded-full ${
                      isMuted 
                        ? 'bg-red-100 text-red-600' 
                        : isListening 
                          ? 'bg-green-100 text-green-600 animate-pulse' 
                          : 'bg-white text-gray-700'
                    } hover:bg-gray-100 transition-colors`}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                    disabled={isProcessing}
                  >
                    {isMuted ? (
                      <FiMicOff className="w-6 h-6" />
                    ) : isListening ? (
                      <div className="relative">
                        <FiMic className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                      </div>
                    ) : (
                      <FiMic className="w-6 h-6" />
                    )}
                  </button>
                  <button 
                    onClick={toggleVideo}
                    className={`p-3 rounded-full ${!isVideoOn ? 'bg-red-100 text-red-600' : 'bg-white text-gray-700'} hover:bg-gray-100 transition-colors`}
                    aria-label={isVideoOn ? 'Turn off video' : 'Turn on video'}
                    title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoOn ? <FiVideo className="w-6 h-6" /> : <FiVideoOff className="w-6 h-6" />}
                  </button>
                  <button 
                    onClick={endCall}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-105 transition-transform"
                    aria-label="End call"
                    title="End interview"
                  >
                    <FiPhone className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Interview Details</h2>
              <p className="text-sm text-gray-500">Position: Software Engineer</p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-medium text-gray-700 mb-3">Current Question</h3>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-800">
                  {chatMessages.filter(m => m.sender === 'AI').pop()?.message || 
                   "Let's start with a brief introduction. Tell me about yourself."}
                </p>
              </div>
              
              <h3 className="font-medium text-gray-700 mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Provide specific examples from your experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Ask for clarification if needed</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={toggleChatMode}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center justify-center space-x-2"
              >
                <FiMessageSquare className="w-4 h-4" />
                <span>{isInChatMode ? 'Switch to Video' : 'Open Chat'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* End Call Confirmation Modal */}
      {showEndCallConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">End Interview?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to end the interview? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelEndCall}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmEndCall}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
