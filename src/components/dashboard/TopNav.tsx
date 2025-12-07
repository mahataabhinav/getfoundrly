import { useState, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import Logo from '../Logo';
import { supabase } from '../../lib/supabase';

interface TopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState('U');

  useEffect(() => {
    getUserName();
  }, []);

  const getUserName = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.name) {
      setUserName(user.user_metadata.name.charAt(0).toUpperCase());
    } else if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name.charAt(0).toUpperCase());
    } else if (user?.email) {
      setUserName(user.email.charAt(0).toUpperCase());
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  const tabs = ['Home', 'Create', 'Analyze', 'Grow', 'BrandDNA'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-[73px]">
      <div className="px-6 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
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
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-sm font-medium">
                  {userName}
                </div>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
