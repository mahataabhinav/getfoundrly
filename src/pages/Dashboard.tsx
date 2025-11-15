import { useState } from 'react';
import { Menu } from 'lucide-react';
import TopNav from '../components/dashboard/TopNav';
import Sidebar from '../components/dashboard/Sidebar';
import HomeSection from '../components/dashboard/HomeSection';
import CreateSection from '../components/dashboard/CreateSection';
import AnalyzeSection from '../components/dashboard/AnalyzeSection';
import GrowSection from '../components/dashboard/GrowSection';
import FoundiiSection from '../components/dashboard/FoundiiSection';
import Foundii from '../components/Foundii';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeSection />;
      case 'Create':
        return <CreateSection />;
      case 'Analyze':
        return <AnalyzeSection />;
      case 'Grow':
        return <GrowSection />;
      case 'Foundii':
        return <FoundiiSection />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-20 z-30 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-gray-100"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      <main className="lg:ml-64 pt-[73px] p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>

      <div className="fixed bottom-6 right-6 z-30 hidden lg:block">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/50 to-slate-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative animate-float">
            <Foundii size={80} animate={true} gesture="wave" />
          </div>
          <div className="absolute -top-16 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
              <p className="text-sm font-medium text-[#1A1A1A]">Need help?</p>
              <p className="text-xs text-gray-600">Click to chat with me!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
