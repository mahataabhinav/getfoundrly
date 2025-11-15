import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  CheckCircle
} from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import DashboardTeaser from './components/DashboardTeaser';
import HowItWorks from './components/HowItWorks';
import MascotSection from './components/MascotSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Header scrollY={scrollY} />
      <Hero />
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
