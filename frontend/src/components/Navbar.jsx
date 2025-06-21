import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRobot, FaBars, FaTimes, FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import img from '../assets/logo1.png'

const Navbar = (props) => {
  const { onOpenAuthModal } = props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleAuthClick = (mode) => {
    console.log('Auth button clicked with mode:', mode);
    console.log('onOpenAuthModal prop:', onOpenAuthModal);
    if (typeof onOpenAuthModal === 'function') {
      onOpenAuthModal(mode);
    } else {
      console.error('onOpenAuthModal is not a function');
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    // { name: 'Features', path: '#features', isExternal: true },
    { name: 'Practice Question', path: '/practice-question', isExternal: false },
    { name: 'About', path: '/about', isExternal: false },
    { name: 'Contact', path: '/contact', isExternal: false },
    { name: 'Interview', path: '/domain', isExternal: false },
  ];

  const renderNavLink = (link,) => {
    
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
    <nav className="fixed w-full z-50 bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center h-16" onClick={() => window.scrollTo(0, 0)}>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img 
                    src={img} 
                    alt="PrepIQ Logo" 
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      console.error('Error loading logo:', img);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-2xl font-extrabold text-white">
                  PrepIQ
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                {renderNavLink(link)}
              </div>
            ))}
          </div>

          {/* Auth Buttons / Profile - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-white hover:bg-white/10 rounded-full p-1 pr-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm uppercase overflow-hidden">
                    {user?.name ? (
                      <span className="leading-none">{user.name.charAt(0).toUpperCase()}</span>
                    ) : (
                      <FaUserCircle className="w-6 h-6" />
                    )}
                  </div>
                  <span className="hidden sm:inline">{user.name || 'Profile'}</span>
                  <FaChevronDown className={`w-3 h-3 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="px-4 py-2 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleAuthClick('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
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
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link, index) => (
              <div key={index} className="py-2">
                {link.isExternal ? (
                  <a 
                    href={link.path}
                    className="block px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-gray-700 rounded-md"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block w-full px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-white/20 text-white shadow-md'
                        : 'text-white/90 hover:bg-white/10 hover:text-white hover:shadow-sm'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="space-y-1 px-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-gray-700 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-gray-700 rounded-md"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => handleAuthClick('signup')}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      

    </nav>
  );
};

export default Navbar;
