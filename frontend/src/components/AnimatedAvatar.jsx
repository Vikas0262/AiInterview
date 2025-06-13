import React, { useState, useEffect, useRef } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const AnimatedAvatar = ({ 
  text = '', 
  onSpeakEnd = () => {},
  voice = null,
  rate = 1,
  pitch = 1
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [expression, setExpression] = useState('neutral');
  const [mouthPosition, setMouthPosition] = useState(0);
  const synthRef = useRef(window.speechSynthesis);
  const animationFrameRef = useRef();
  const utteranceRef = useRef(null);
  const startTimeRef = useRef(0);

  // Analyze text for emotion (simple implementation)
  const analyzeEmotion = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('wonderful')) {
      return 'happy';
    } else if (lowerText.includes('sad') || lowerText.includes('sorry') || lowerText.includes('unfortunate')) {
      return 'sad';
    }
    return 'neutral';
  };

  // Animate mouth based on speech
  const animateMouth = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    // Update mouth position based on time for a talking effect
    const position = Math.sin(elapsed / 100) * 5 + 5; // Creates a smooth wave pattern
    setMouthPosition(position);
    
    if (isSpeaking) {
      animationFrameRef.current = requestAnimationFrame(animateMouth);
    }
  };

  // Speak the provided text
  const speak = () => {
    if (!text || isSpeaking || isMuted) return;
    
    // Cancel any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice and speech parameters
    if (voice) {
      const voices = synthRef.current.getVoices();
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Set up event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setExpression(analyzeEmotion(text));
      startTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animateMouth);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setMouthPosition(5); // Reset mouth to neutral
      cancelAnimationFrame(animationFrameRef.current);
      onSpeakEnd();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setMouthPosition(5);
      cancelAnimationFrame(animationFrameRef.current);
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Auto-speak when text changes
  useEffect(() => {
    if (text) {
      speak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Toggle mute
  const toggleMute = () => {
    if (isSpeaking && !isMuted) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setMouthPosition(5);
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsMuted(!isMuted);
  };

  // Render the avatar with SVG for smooth animations
  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <div className="relative w-64 h-64">
        {/* Avatar container */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Head */}
          <circle cx="100" cy="100" r="80" fill="#FFD3B6" />
          
          {/* Eyes */}
          <g className="eyes">
            <circle cx="70" cy="80" r="10" fill="#333" />
            <circle cx="130" cy="80" r="10" fill="#333" />
            
            {/* Eye highlights */}
            <circle cx="73" cy="77" r="3" fill="#fff" />
            <circle cx="133" cy="77" r="3" fill="#fff" />
          </g>
          
          {/* Eyebrows - animate slightly for expressions */}
          <g className="eyebrows">
            <path 
              d="M55 65 Q 70 60, 85 65" 
              fill="none" 
              stroke="#333" 
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transform: expression === 'happy' ? 'translateY(-5px)' : 
                          expression === 'sad' ? 'translateY(0)' : 'translateY(-2px)'
              }}
            />
            <path 
              d="M115 65 Q 130 60, 145 65" 
              fill="none" 
              stroke="#333" 
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transform: expression === 'happy' ? 'translateY(-5px)' : 
                          expression === 'sad' ? 'translateY(0)' : 'translateY(-2px)'
              }}
            />
          </g>
          
          {/* Mouth - animated based on speech and expression */}
          <path 
            d={
              expression === 'happy' ? 
              `M60 130 Q100 ${150 + mouthPosition * 2} 140 130` :
              expression === 'sad' ?
              `M60 140 Q100 ${120 - mouthPosition} 140 140` :
              `M60 130 Q100 ${130 + mouthPosition} 140 130`
            } 
            fill="none" 
            stroke="#333" 
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Optional blush for happy expression */}
          {expression === 'happy' && (
            <>
              <circle cx="65" cy="100" r="15" fill="#FFB6C1" fillOpacity="0.5" />
              <circle cx="135" cy="100" r="15" fill="#FFB6C1" fillOpacity="0.5" />
            </>
          )}
        </svg>
        
        {/* Mute toggle */}
        <button 
          onClick={toggleMute}
          className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <FiVolumeX className="w-5 h-5 text-gray-600" />
          ) : (
            <FiVolume2 className="w-5 h-5 text-blue-600" />
          )}
        </button>
        
        {/* Loading indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-1">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedAvatar;
