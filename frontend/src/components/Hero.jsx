import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import aiImage from '../assets/ai-image1.png';
const Hero = () => {
    const navigate = useNavigate();
    const [isTyping, setIsTyping] = useState(true);
    const [typedText, setTypedText] = useState('');
    const fullText = 'Practice with voice, quizzes, and personalized feedback in real-time.';

    useEffect(() => {
        if (isTyping) {
            const interval = setInterval(() => {
                if (typedText.length < fullText.length) {
                    setTypedText(fullText.substring(0, typedText.length + 1));
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                    setTimeout(() => {
                        setTypedText('');
                        setIsTyping(true);
                    }, 3000);
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [typedText, isTyping]);

    const handleChatClick = () => {
        navigate('/chat');
    };

    return (
        <section className="pt-24 pb-16 px-6 md:px-0 md:pt-32 md:pb-24 relative overflow-hidden">
            <div className="container px-6 mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Crack Your Next Interview with AI
                    </h1>
                    <div className="h-20">
                        <p className="text-xl md:text-2xl text-blue-100 mb-8">
                            {typedText}<span className={`${isTyping ? 'opacity-100' : 'opacity-0'}`}>|</span>
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                        <button 
                            onClick={handleChatClick}
                            className="px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#735D78] rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-lg font-medium cursor-pointer"
                        >
                            🎙️ Chat with AI
                        </button>
                        <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl shadow-md hover:bg-white/30 transition-all text-lg cursor-pointer">📝 Take a Quiz</button>
                        <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl shadow-md hover:bg-white/30 transition-all text-lg cursor-pointer">📅 Schedule an Interview</button>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <button className="px-5 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-all cursor-pointer">📊 View Progress</button>
                        <button className="px-5 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-all cursor-pointer">⚙️ Customize Practice Mode</button>
                    </div>
                </div>
                <div className="md:w-1/2 relative">
                    <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
                    <img
                        src={aiImage}
                        alt="AI Interview Assistant"
                        className="relative z-10 w-full h-auto max-w-md mx-auto transform hover:-translate-y-2 transition-transform duration-500"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
