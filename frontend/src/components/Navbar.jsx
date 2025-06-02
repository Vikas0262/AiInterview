import React, { useState } from 'react';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <header className="backdrop-blur-md bg-white/10 fixed w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-robot text-2xl mr-2"></i>
            <span className="text-xl font-bold">InterviewAI</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-blue-300 transition-colors cursor-pointer">Features</a>
            <a href="#pricing" className="hover:text-blue-300 transition-colors cursor-pointer">Pricing</a>
            <a href="#about" className="hover:text-blue-300 transition-colors cursor-pointer">About</a>
            <a href="#contact" className="hover:text-blue-300 transition-colors cursor-pointer">Contact</a>
          </nav>
          <div className="flex space-x-4">
            <button 
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 text-sm border border-white/30 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={() => openAuthModal('signup')}
              className="px-4 py-2 text-sm bg-[#4A90E2] rounded-lg hover:bg-[#3A80D2] transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </div>
          <button className="md:hidden text-xl cursor-pointer">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        mode={authMode} 
      />
    </>
  );
};

export default Navbar;
