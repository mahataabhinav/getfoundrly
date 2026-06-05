import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import TopNav from '../components/dashboard/TopNav';
import Sidebar from '../components/dashboard/Sidebar';
import HomeSection from '../components/dashboard/HomeSection';
import CalendarSection from '../components/dashboard/CalendarSection';
import CreateSection from '../components/dashboard/CreateSection';
import AnalyzeSection from '../components/dashboard/AnalyzeSection';
import GrowSection from '../components/dashboard/GrowSection';
import BrandDNASection from '../components/dashboard/BrandDNASection';
import OnboardingWelcome from '../components/dashboard/OnboardingWelcome';
import { supabase } from '../lib/supabase';
import { checkUserOnboardingStatus } from '../lib/onboarding';
import type { OnboardingStatus } from '../lib/onboarding';


interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        onLogout();
      } else {
        // Check onboarding status
        const status = await checkUserOnboardingStatus(session.user.id);
        setOnboardingStatus(status);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      onLogout();
    }
  };

  const handleOnboardingComplete = async () => {
    // Re-check onboarding status after completion
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const status = await checkUserOnboardingStatus(session.user.id);
        setOnboardingStatus(status);
      }
    } catch (error) {
      console.error('Error refreshing onboarding status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F11] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#CCFF00] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding for first-time users
  if (onboardingStatus && !onboardingStatus.hasCompletedOnboarding) {
    return <OnboardingWelcome onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeSection />;
      case 'Calendar':
        return <CalendarSection />;
      case 'Create':
        return <CreateSection />;
      case 'Analyze':
        return <AnalyzeSection />;
      case 'Grow':
        return <GrowSection />;
      case 'BrandDNA':
        return <BrandDNASection />;
      case 'Settings':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-semibold text-[#1A1A1A]">Settings</h1>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F11]">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-[110px] z-30 lg:hidden p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      <main className="lg:ml-80 pt-[120px] px-6 sm:px-8 lg:px-12 pb-32">
        <div className="w-full mx-auto">{renderContent()}</div>
      </main>


    </div>
  );
}
