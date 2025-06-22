import React, { useState } from 'react';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Footer from '../components/Footer.jsx';
import DevelopmentUpdate from '../components/DevelopmentUpdate';

const Home = () => {
    const [showNotification, setShowNotification] = useState(true);

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white font-sans relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Hero />
                <Features />
                <Testimonials />
                <Footer />
            </div>

            {/* Development Update Notification */}
            {showNotification && (
                <DevelopmentUpdate onClose={handleCloseNotification} />
            )}
        </div>
    );
};

export default Home;
