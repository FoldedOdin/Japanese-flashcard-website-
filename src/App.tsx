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
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';
import Upgrade from './pages/Upgrade';
import KanaCity from './pages/KanaCity';
import AiCoach from './pages/AiCoach';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
        { path: 'login', element: <Auth /> },
        { path: 'welcome', element: <ProtectedRoute><Welcome /></ProtectedRoute> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
        { path: 'learn', element: <ProtectedRoute><Learn /></ProtectedRoute> },
        { path: 'quiz', element: <ProtectedRoute><Quiz /></ProtectedRoute> },
        { path: 'statistics', element: <ProtectedRoute><Statistics /></ProtectedRoute> },
        { path: 'achievements', element: <ProtectedRoute><Achievements /></ProtectedRoute> },
        { path: 'kana-city', element: <ProtectedRoute><KanaCity /></ProtectedRoute> },
        { path: 'ai-coach', element: <ProtectedRoute><AiCoach /></ProtectedRoute> },
        { path: 'settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
        { path: 'upgrade', element: <ProtectedRoute><Upgrade /></ProtectedRoute> },
      ],
    },
  ]
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ProgressProvider>
          <RouterProvider router={router} />
        </ProgressProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
