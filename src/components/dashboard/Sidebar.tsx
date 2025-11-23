import { Home, Sparkles, BarChart3, TrendingUp, MessageCircle, Settings, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'Create', icon: Sparkles, label: 'Create' },
    { id: 'Analyze', icon: BarChart3, label: 'Analyze' },
    { id: 'Grow', icon: TrendingUp, label: 'Grow' },
    { id: 'Foundii', icon: MessageCircle, label: 'Foundii' },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-[73px] bottom-0 w-64 bg-white border-r border-gray-100 z-40 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-1 pb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-gray-100 text-[#1A1A1A]'
                    : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
