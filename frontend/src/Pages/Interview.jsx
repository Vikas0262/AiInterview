import React, { useState, useRef, useEffect, useCallback } from 'react';
import { auth } from '../Firebase'; // Import Firebase auth
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
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
  const [user, setUser] = useState(null);
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start with muted
  const [micError, setMicError] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(false); // Start with video off
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  // Refs and hooks
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Add initial greeting when component mounts
  useEffect(() => {
    if (!hasGreeted) {
      const greetingMessage = {
        id: Date.now(),
        sender: 'AI',
        message: 'Hello! Welcome to your interview. I will be your interviewer today. Please enable your microphone and camera when you are ready to begin.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSpeaking: true
      };

      setChatMessages([greetingMessage]);
      setHasGreeted(true);
      
      // Speak the greeting
      const speech = new SpeechSynthesisUtterance(greetingMessage.message);
      speech.onend = () => {
        setChatMessages(prev =>
          prev.map(msg =>
            msg.id === greetingMessage.id ? { ...msg, isSpeaking: false } : msg
          )
        );
      };
      window.speechSynthesis.speak(speech);
    }
  }, [hasGreeted]);

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

  // Get appropriate follow-up question based on user's message
  const getFollowUpQuestion = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for technical skills
    const techKeywords = [
      'fullstack', 'frontend', 'backend', 'react', 'node', 'javascript',
      'python', 'java', 'sql', 'database', 'api', 'aws', 'cloud', 'devops'
    ];
    
    // Check for experience-related keywords
    const expKeywords = [
      'experience', 'worked', 'years', 'project', 'developed', 'built',
      'created', 'implemented', 'designed', 'led', 'managed', 'team'
    ];
    
    // Check for behavioral aspects
    const behavioralKeywords = [
      'challenge', 'difficult', 'problem', 'solved', 'conflict', 'teamwork',
      'failure', 'success', 'proud', 'learned', 'mistake', 'improve'
    ];
    
    // Check for role-specific terms
    const roleKeywords = [
      'developer', 'engineer', 'designer', 'manager', 'architect', 'analyst',
      'lead', 'director', 'specialist', 'consultant'
    ];
    
    // Count keyword matches
    const techMatch = techKeywords.filter(word => message.includes(word)).length;
    const expMatch = expKeywords.filter(word => message.includes(word)).length;
    const behavioralMatch = behavioralKeywords.filter(word => message.includes(word)).length;
    const roleMatch = roleKeywords.filter(word => message.includes(word)).length;
    
    // Define question categories
    const technicalQuestions = [
      "Can you elaborate on your experience with that technology?",
      "What challenges did you face while working with that technology?",
      "How do you stay updated with the latest developments in this area?",
      "Can you give me an example of a project where you used this technology?",
      "What do you consider best practices when working with this technology?"
    ];
    
    const experienceQuestions = [
      "What were your key responsibilities in that role?",
      "What was the impact of your work in that position?",
      "What was the most challenging project you worked on and why?",
      "How did you measure success in that role?",
      "What were the key technologies you used in that position?"
    ];
    
    const behavioralQuestions = [
      "How did you handle that situation?",
      "What would you do differently if faced with the same challenge again?",
      "How did your team respond to your approach?",
      "What did you learn from that experience?",
      "Can you walk me through your thought process during that situation?"
    ];
    
    const roleSpecificQuestions = [
      "What attracted you to this type of role?",
      "What do you enjoy most about working in this type of position?",
      "How do you see this role evolving in the next few years?",
      "What skills do you think are most important for success in this role?",
      "How do you handle the challenges specific to this type of position?"
    ];
    
    // Default questions if no specific keywords are found
    const defaultQuestions = [
      "Could you tell me more about that?",
      "What were the key takeaways from that experience?",
      "How does this experience relate to the position you're applying for?",
      "What was your role in that situation?",
      "How did you approach that challenge?"
    ];
    
    // Determine which category has the most matches
    const maxMatch = Math.max(techMatch, expMatch, behavioralMatch, roleMatch);
    
    // Select a random question from the most relevant category
    if (maxMatch > 0) {
      if (techMatch === maxMatch) return technicalQuestions[Math.floor(Math.random() * technicalQuestions.length)];
      if (expMatch === maxMatch) return experienceQuestions[Math.floor(Math.random() * experienceQuestions.length)];
      if (behavioralMatch === maxMatch) return behavioralQuestions[Math.floor(Math.random() * behavioralQuestions.length)];
      return roleSpecificQuestions[Math.floor(Math.random() * roleSpecificQuestions.length)];
    }
    
    // Fallback to default questions
    return defaultQuestions[Math.floor(Math.random() * defaultQuestions.length)];
  };

  // Handle sending a new message
  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSpeaking: false
    };

    setChatMessages(prev => [...prev, userMessage]);
    console.log('📩 User sent message:', message);
    setIsProcessing(true);

    // Generate AI response
    setTimeout(() => {
      // Get a relevant follow-up question based on user's message
      const response = getFollowUpQuestion(message);
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'AI',
        message: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSpeaking: true
      };

      setChatMessages(prev => [...prev, aiMessage]);
      console.log('🤖 AI response:', aiMessage.message);
      setIsProcessing(false);
    }, 1500);
  };

  // Toggle between chat and video modes
  const toggleChatMode = () => {
    const newMode = !isInChatMode;
    console.log(`🔄 Switching to ${newMode ? 'Chat' : 'Video'} mode`);
    setIsInChatMode(newMode);
  };

  // Toggle mute
  const toggleMute = async () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stop any ongoing AI speech
    }
    const newMutedState = !isMuted;
    console.log(`🔇 Microphone ${newMutedState ? 'muted' : 'unmuted'}`);
    setMicError(null);

    if (!newMutedState && recognition) {
      // If unmuting, start listening
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        // Test if we can actually get audio data
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);

        try {
          recognition.start();
          console.log('🎤 Speech recognition started');
          setIsListening(true);

          // Visual feedback for audio level
          const checkAudioLevel = () => {
            if (!isListening) return;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

            if (average < 5) {
              console.log('🔈 Low audio input detected');
              setMicError('Speak louder or move closer to the microphone');
            } else {
              setMicError(null);
            }

            requestAnimationFrame(checkAudioLevel);
          };

          checkAudioLevel();

        } catch (err) {
          console.error('Error starting speech recognition:', err);
          setMicError('Error initializing speech recognition');
          setIsMuted(true);
          return;
        }
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setMicError('Microphone access denied. Please allow access in your browser settings.');
        setIsMuted(true);
        return;
      }
    } else if (recognition) {
      // If muting, stop listening
      try {
        recognition.stop();
        console.log('🔇 Speech recognition stopped');
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
      setIsListening(false);
      setMicError(null);
    }

    setIsMuted(newMutedState);
  };

  // Toggle video
  const toggleVideo = async () => {
    const newVideoState = !isVideoOn;
    console.log(`🎥 Camera ${newVideoState ? 'enabled' : 'disabled'}`);

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
    if (!text.trim() || window.speechSynthesis.speaking) {
      // If AI is speaking, restart recognition when done
      if (window.speechSynthesis.speaking) {
        const checkSpeaking = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(checkSpeaking);
            if (recognition && !isMuted) {
              try {
                recognition.start();
                console.log('Restarted speech recognition after AI finished speaking');
              } catch (e) {
                console.log('Error restarting recognition:', e);
              }
            }
          }
        }, 500);
      }
      return;
    }
    
    // Check for interruption commands
    const lowerText = text.toLowerCase();
    if (lowerText.includes('stop') || lowerText.includes('interrupt') || lowerText.includes('hold on')) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      // Update any speaking messages to not speaking
      setChatMessages(prev => 
        prev.map(msg => 
          msg.isSpeaking ? { ...msg, isSpeaking: false } : msg
        )
      );
      return;
    }
    
    // Prevent processing if we're already processing or if this is a duplicate of the last message
    if (isProcessing || chatMessages.some(msg => 
      msg.sender === 'User' && 
      msg.message.toLowerCase() === text.toLowerCase()
    )) {
      console.log('Skipping duplicate or already processing message');
      return;
    }

    console.log('🎤 User speech detected:', text);
    setIsProcessing(true);

    try {
      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        sender: 'User',
        message: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSpeaking: false
      };

      setChatMessages(prev => [...prev, userMessage]);

      // Get conversation history for context
      const conversationHistory = chatMessages
        .filter(msg => msg.sender === 'AI' || msg.sender === 'User')
        .slice(-4) // Get last 4 messages for context
        .map(msg => `${msg.sender}: ${msg.message}`)
        .join('\n');

      // Get response from Gemini
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI interviewer. The user is a candidate in an interview. 
              
Previous conversation for context (you can reference this but don't repeat it):
${conversationHistory}

User's latest message: ${text}

Instructions for your response:
1. Do NOT introduce yourself or say your name
2. Be concise and to the point
3. Focus on asking relevant follow-up questions or providing feedback
4. If the user asks you to stop or says they need a moment, acknowledge briefly and wait for their next input

Your response:`
            }]
          }]
        })
      });

      const data = await response.json();
      let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";

      // Clean up common AI intros if they still appear
      aiResponse = aiResponse.replace(/^(hi|hello|hey|hi there|hello there|hi!|hello!|hey!|hi there!|hello there!),?\s*(my name is \w+ |i am \w+ |i'm \w+ )?(the )?(ai )?(interviewer )?(here )?(to )?(help )?(you )?(with )?(the )?(interview )?/i, '');
      aiResponse = aiResponse.trim() || "Could you please rephrase that?";

      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'AI',
        message: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSpeaking: true
      };

      setChatMessages(prev => [...prev, aiMessage]);

      // Speak the response
      console.log('🔊 AI speaking response:', aiResponse);
      // Stop any ongoing speech before starting new one
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(aiResponse);
      speech.onend = () => {
        setChatMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessage.id ? { ...msg, isSpeaking: false } : msg
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSpeaking: false
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Function to add AI greeting message
  const addAIGreeting = useCallback(() => {
    const greetingMessage = {
      id: Date.now(),
      sender: 'AI',
      message: 'Hello! Welcome to your interview. I will be your interviewer today. Please enable your microphone and camera when you are ready to begin.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSpeaking: true
    };

    setChatMessages(prev => [greetingMessage]);
    
    // Speak the greeting
    const speech = new SpeechSynthesisUtterance(greetingMessage.message);
    speech.onend = () => {
      setChatMessages(prev =>
        prev.map(msg =>
          msg.id === greetingMessage.id ? { ...msg, isSpeaking: false } : msg
        )
      );
    };
    window.speechSynthesis.speak(speech);
  }, []);

  // Add initial greeting when component mounts
  useEffect(() => {
    if (!hasGreeted) {
      const greetingMessage = {
        id: Date.now(),
        sender: 'AI',
        message: 'Hello! Welcome to your interview. I will be your interviewer today. Please enable your microphone and camera when you are ready to begin.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSpeaking: true
      };

      setChatMessages([greetingMessage]);
      setHasGreeted(true);
      
      // Speak the greeting
      const speech = new SpeechSynthesisUtterance(greetingMessage.message);
      speech.onend = () => {
        setChatMessages(prev =>
          prev.map(msg =>
            msg.id === greetingMessage.id ? { ...msg, isSpeaking: false } : msg
          )
        );
      };
      window.speechSynthesis.speak(speech);
    }
  }, [hasGreeted]);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser({
          displayName: authUser.displayName,
          email: authUser.email,
          photoURL: authUser.photoURL
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
      window.speechSynthesis.cancel(); // Clean up any ongoing speech
    };
  }, []);

  // Set up speech recognition
  useEffect(() => {
    if (!recognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }
    
    // Add this to track if we're currently processing
    let isProcessingInput = false;

    let debounceTimer;
    let lastProcessedText = '';
    let isUserSpeaking = false;
    let finalTranscript = '';

    recognition.onresult = (event) => {
      // Clear any pending debounce
      clearTimeout(debounceTimer);
      
      // Get the current transcript
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // If we're getting interim results, the user is still speaking
      if (interimTranscript) {
        isUserSpeaking = true;
        return; // Don't process anything while user is still speaking
      }
      
      // Only process if we have a final result, it's not empty, and it's different from last processed
      finalTranscript = finalTranscript.trim();
      if (finalTranscript && finalTranscript !== lastProcessedText && !isProcessingInput) {
        // Set a longer debounce to ensure user has finished speaking
        debounceTimer = setTimeout(() => {
          isProcessingInput = true;
          lastProcessedText = finalTranscript;
          isUserSpeaking = false; // User has finished speaking
          
          // Process the input and ensure recognition restarts
          processUserInput(finalTranscript).finally(() => {
            isProcessingInput = false;
            if (recognition && !isMuted) {
              try {
                recognition.start();
                console.log('Restarted speech recognition after processing input');
              } catch (e) {
                console.log('Error restarting recognition after processing:', e);
              }
            }
          });
        }, 1000); // 1s debounce to ensure user is done speaking
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      switch (event.error) {
        case 'no-speech':
          console.log('No speech was detected. Microphone might be muted or not working.');
          setMicError('No speech detected. Try speaking louder or checking your microphone.');
          break;
        case 'audio-capture':
          console.error('No microphone was found.');
          setMicError('No microphone detected. Please check your audio device.');
          break;
        case 'not-allowed':
          console.error('Microphone access was denied.');
          setMicError('Microphone access denied. Please allow access in your browser settings.');
          setIsMuted(true);
          break;
        case 'aborted':
          console.log('Speech recognition was aborted.');
          setMicError('Speech recognition was interrupted. Try again.');
          break;
        default:
          console.error('Speech recognition error occurred:', event.error);
          setMicError('Error with speech recognition. Please try again.');
      }
    };

    recognition.onend = () => {
      if (!isMuted && recognition && !isProcessing) {
        // Small delay before restarting recognition to prevent rapid restarts
        setTimeout(() => {
          if (!isMuted && recognition) {
            try {
              recognition.start();
            } catch (e) {
              console.log('Error restarting recognition:', e);
            }
          }
        }, 1000);
      }
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isMuted, processUserInput, isProcessing]);

  // Handle end call
  const endCall = () => {
    console.log('📞 Call end requested');
    setShowEndCallConfirm(true);
  };

  // Confirm end call
  const confirmEndCall = () => {
    console.log('🛑 Call ended by user');
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => {
        console.log(`🛑 Stopping track: ${track.kind}`);
        track.stop();
      });
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
                            style={{ animationDelay: '0.2s' }}
                          ></div>

                          {/* Smile - changes based on speaking/listening state */}
                          <div
                            className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-8 border-b-4 border-blue-800 rounded-full transition-all duration-300 ${chatMessages.some(msg => msg.sender === 'AI' && msg.isSpeaking)
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
                            className={`w-2 h-6 rounded-full animate-pulse ${chatMessages.some(msg => msg.sender === 'AI' && msg.isSpeaking)
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
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                    {/* Microphone status indicator */}
                    {!isMuted && (
                      <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 px-2 py-1 bg-black bg-opacity-50 rounded-full">
                        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                        <span className="text-white text-xs">{isListening ? 'Listening...' : 'Ready'}</span>
                      </div>
                    )}
                    {micError && (
                      <div className="absolute bottom-2 left-2 right-2 bg-red-500 bg-opacity-80 text-white text-xs p-1 rounded text-center">
                        {micError}
                      </div>
                    )}
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
                        <div className="text-2xl mb-2">
                          {isMuted ? '🎤' : '🎧'}
                        </div>
                        <div className="text-sm">
                          {isMuted ? 'Mic is off' : 'Listening...'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                  <button
                    onClick={toggleMute}
                    className={`p-3 rounded-full ${isMuted
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

          {/* Right Side Panel */}
          <div className="w-full md:w-96 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            {/* Profile Card */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">
                    {user?.displayName || user?.email || 'Interview Candidate'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {user?.email || 'Software Engineer'}
                  </p>
                  <button 
                    className="mt-1 text-xs text-blue-600 hover:underline"
                    onClick={() => {}}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Timer and Progress */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Time Remaining</span>
                <span className="text-lg font-bold text-blue-600">24:35</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Question 3 of 5</span>
                <span>65% Complete</span>
              </div>
            </div>

            {/* Current Question */}
            {/* <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-medium text-gray-700 mb-2">Current Question</h3>
              <div className="bg-blue-50 p-3 rounded-lg mb-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-800">
                  {chatMessages.filter(m => m.sender === 'AI').pop()?.message || 
                   "Let's start with a brief introduction. Tell me about yourself."}
                </p>
              </div>

              {/* Notes Section */}
            {/* <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Your Notes</h3>
                  <button className="text-xs text-blue-600 hover:underline">Clear</button>
                </div>
                <textarea 
                  className="w-full h-24 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write down your thoughts here..."
                ></textarea>
              </div> */}

            {/* Question Tips */}
            <div className="bg-yellow-50 p-3 rounded-lg mb-4">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Answering Tips
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Use the <strong>STAR</strong> method: Situation, Task, Action, Result</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Keep your answer between 1-2 minutes</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Focus on relevant experience and achievements</span>
                </div>
              </div>
            </div>

            {/* Keywords Tracker */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2 px-3">Keywords to Include</h3>
              <div className="flex flex-wrap gap-2 px-3">
                {['JavaScript', 'React', 'Node.js', 'Problem Solving', 'Teamwork'].map((keyword, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {keyword}
                    <svg className="ml-1.5 w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ))}
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
    </div>
  );
};

export default Interview;