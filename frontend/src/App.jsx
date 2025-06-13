import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Chat from './Pages/Chat';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Interview from './Pages/Interview';
import Navbar from './components/Navbar';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/interview" element={<Interview />} />
          </Routes>
        </div>
      </Router>
      <ToastProvider />
    </>
  );
}

export default App;
