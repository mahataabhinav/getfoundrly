import { Bell, User } from 'lucide-react';
import Logo from '../Logo';

interface TopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const tabs = ['Home', 'Create', 'Analyze', 'Grow', 'Foundii'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo variant="dark" iconSize={28} showWordmark={true} />

          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gray-100 text-[#1A1A1A]'
                    : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-all">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-sm font-medium">
                S
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
