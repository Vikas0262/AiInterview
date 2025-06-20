import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './Pages/Home';
import Chat from './Pages/Chat';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Interview from './Pages/Interview';
import PracticeQuestions from './Pages/PracticeQuestions';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ToastProvider from './components/ToastProvider';
import Profile from './Pages/Profile';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    // Check if it's the user's first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    const isLoggedIn = localStorage.getItem('user');
    
    if (!hasVisitedBefore && !isLoggedIn) {
      // Set a timeout to show the login modal after 5 seconds
      const timer = setTimeout(() => {
        setAuthMode('login');
        setIsAuthModalOpen(true);
        // Mark that the user has seen the modal
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 5000);
      
      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    } else if (!isLoggedIn) {
      // If not first visit but not logged in, set the flag for future visits
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const openAuthModal = (mode) => {
    console.log('openAuthModal called with mode:', mode);
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  console.log('Rendering App with isAuthModalOpen:', isAuthModalOpen, 'authMode:', authMode);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar 
            onOpenAuthModal={openAuthModal}
            authMode={authMode}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/practice-question" element={<PracticeQuestions />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        mode={authMode} 
      />
      <ToastProvider />
    </>
  );
}

export default App;
