import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
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

const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-paper text-ink transition-colors duration-300">
    <Navigation />
    <main id="main-content" className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'learn', element: <Learn /> },
        { path: 'quiz', element: <Quiz /> },
        { path: 'statistics', element: <Statistics /> },
        { path: 'achievements', element: <Achievements /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <RouterProvider
          router={router}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        />
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
