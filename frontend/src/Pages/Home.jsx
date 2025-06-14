import React from 'react';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2B3A67] to-[#735D78] text-white font-sans">
            <Hero />
            <Features />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default Home;
