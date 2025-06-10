import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
    const [showPopup, setShowPopup] = useState(true);

    // Close popup after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(false);
        }, 90000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2B3A67] to-[#735D78] text-white font-sans">
            <Navbar />
            <Hero />
            <Features />
            <Testimonials />
            <Footer />
            
            {/* Semi-transparent overlay when popup is shown */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            )}
            
            {/* Centered Popup Notification */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="text-center">
                            <h3 className="font-bold text-2xl text-[#2B3A67] mb-4">🚧 Website Under Construction</h3>
                            <p className="mb-6">We're currently working on some exciting improvements! The website will be fully functional in 1 week. Thank you for your patience and understanding.</p>
                            {/* <button 
                                // onClick={() => setShowPopup(false)}
                                className="bg-[#2B3A67] text-white px-6 py-2 rounded-md hover:bg-[#1e2a4a] transition-colors"
                                aria-label="Close notification"
                            >
                                Got it, I'll check back later!
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
