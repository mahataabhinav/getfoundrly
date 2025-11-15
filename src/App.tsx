import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroEnhanced from './components/home/HeroEnhanced';
import WhatFoundrlyDoes from './components/home/WhatFoundrlyDoes';
import HowItWorks from './components/home/HowItWorks';
import LiveProductGlimpses from './components/home/LiveProductGlimpses';
import SmartScheduling from './components/home/SmartScheduling';
import DashboardGlance from './components/home/DashboardGlance';
import BuiltForFounders from './components/home/BuiltForFounders';
import FinalCTA from './components/home/FinalCTA';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { supabase } from './lib/supabase';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'dashboard'>('home');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentPage('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return <Dashboard onLogout={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'login') {
    return <AuthPage initialMode="login" onBack={() => setCurrentPage('home')} onSuccess={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'signup') {
    return <AuthPage initialMode="signup" onBack={() => setCurrentPage('home')} onSuccess={() => setCurrentPage('dashboard')} />;
  }

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Header scrollY={scrollY} onLoginClick={() => setCurrentPage('login')} onSignupClick={() => setCurrentPage('signup')} />
      <HeroEnhanced
        onSignupClick={() => setCurrentPage('signup')}
        onSeeHowItWorks={scrollToHowItWorks}
      />
      <WhatFoundrlyDoes onCardClick={scrollToHowItWorks} />
      <HowItWorks />
      <LiveProductGlimpses />
      <SmartScheduling />
      <DashboardGlance />
      <BuiltForFounders />
      <FinalCTA
        onSignupClick={() => setCurrentPage('signup')}
        onLoginClick={() => setCurrentPage('login')}
      />
      <Footer />
    </div>
  );
}

export default App;
