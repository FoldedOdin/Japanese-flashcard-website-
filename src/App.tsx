import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import Statistics from './pages/Statistics';
import Achievements from './pages/Achievements';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <Router>
          <div className="min-h-screen bg-paper text-ink transition-colors duration-300">
            <Navigation />
            <main id="main-content" className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
