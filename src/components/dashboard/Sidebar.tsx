import { Home, Sparkles, BarChart3, TrendingUp, Database, Settings, Calendar } from 'lucide-react';

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
    { id: 'BrandDNA', icon: Database, label: 'BrandDNA' },
    { id: 'Calendar', icon: Calendar, label: 'Calendar' },
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
        className={`fixed left-0 top-24 bottom-0 w-80 bg-[#0F0F11] border-r border-white/5 z-40 transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all ${activeTab === item.id
                  ? 'bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
