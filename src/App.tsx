import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import DashboardTeaser from './components/DashboardTeaser';
import HowItWorks from './components/HowItWorks';
import MascotSection from './components/MascotSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'dashboard'>('home');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (currentPage === 'dashboard') {
    return <Dashboard />;
  }

  if (currentPage === 'login') {
    return <AuthPage initialMode="login" onBack={() => setCurrentPage('home')} onSuccess={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'signup') {
    return <AuthPage initialMode="signup" onBack={() => setCurrentPage('home')} onSuccess={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Header scrollY={scrollY} onLoginClick={() => setCurrentPage('login')} onSignupClick={() => setCurrentPage('signup')} />
      <Hero onSignupClick={() => setCurrentPage('signup')} />
      <ProblemSection />
      <SolutionSection />
      <DashboardTeaser />
      <HowItWorks />
      <MascotSection />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
