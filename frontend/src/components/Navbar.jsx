import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRobot, FaBars, FaTimes } from 'react-icons/fa';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);// state to control auth modal visibility
  const [authMode, setAuthMode] = useState('login');// state to control auth mode (login or signup)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);// state to control mobile menu visibility
  const location = useLocation();// get current location

  const openAuthModal = (mode) => {
    setAuthMode(mode);// set auth mode to login or signup
    setIsAuthModalOpen(true);// open auth modal
    setIsMobileMenuOpen(false);// close mobile menu
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);// close auth modal
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Navigation links
  const navLinks = [
    { name: 'Features', path: '#features', isExternal: true },
    { name: 'Pricing', path: '#pricing', isExternal: true },
    { name: 'About', path: '/about', isExternal: false },
    { name: 'Contact', path: '/contact', isExternal: false },
  ];

  // Render navigation link
  const renderNavLink = (link) => {
    if (link.isExternal) {
      return (
        <a 
          href={link.path} 
          className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
        >
          {link.name}
        </a>
      );
    }
    return (
      <Link
        to={link.path}
        className={`px-3 py-2 text-sm font-medium ${
          location.pathname === link.path ? 'text-white' : 'text-white/90 hover:text-white'
        } transition-colors`}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <>
      <header className="backdrop-blur-md bg-gray-900/80 fixed w-full z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <FaRobot className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-white">InterviewAI</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <div key={index} className="px-2">
                  {renderNavLink(link)}
                </div>
              ))}
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link, index) => (
                <div key={index} className="px-3 py-2">
                  {link.isExternal ? (
                    <a 
                      href={link.path}
                      className="block px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-gray-700 rounded-md"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block px-3 py-2 text-base font-medium rounded-md ${
                        location.pathname === link.path 
                          ? 'text-white bg-gray-900' 
                          : 'text-white/90 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="space-y-1 px-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-gray-700 rounded-md"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
