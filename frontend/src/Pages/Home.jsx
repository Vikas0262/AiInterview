import React from 'react';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Hero />
                <Features />
                <Testimonials />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
