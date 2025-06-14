import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
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
