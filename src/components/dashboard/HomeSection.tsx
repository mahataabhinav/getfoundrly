import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getBrandsByUser, getConnectionsByBrand } from '../../lib/database';
import ConnectAccountsSection from './ConnectAccountsSection';
import UpcomingCarousel from './UpcomingCarousel';
import PerformanceWidget from './PerformanceWidget';
import type { Connection } from '../../types/database';

export default function HomeSection({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [firstName, setFirstName] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const metadata = session.user.user_metadata;
        const fullName = metadata?.full_name || metadata?.name || metadata?.display_name || '';

        if (fullName) {
          const firstNameExtracted = fullName.split(' ')[0];
          setFirstName(firstNameExtracted);
        }

        // Fetch Connections
        const brands = await getBrandsByUser(session.user.id);
        if (brands && brands.length > 0) {
          const brandConnections = await getConnectionsByBrand(brands[0].id);
          setConnections(brandConnections);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingUser(false);
    }
  };



  const quickActions = [
    { title: 'Create LinkedIn Post', type: 'LinkedIn', preview: '📱' },
    { title: 'Create Instagram Ad', type: 'Instagram', preview: '📸' },
    { title: 'Create Newsletter', type: 'Email', preview: '✉️' },
  ];

  const getWelcomeMessage = () => {
    if (loadingUser) {
      return 'Welcome back 👋';
    }
    return firstName ? `Welcome back, ${firstName} 👋` : 'Welcome back 👋';
  };



  const handleConnectAccount = (_platform: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Navigate to create page or specific connection flow
    if (onNavigate) {
      onNavigate('Create');
    }
  };



  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Simplified Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            {getWelcomeMessage()}
          </h1>
          <p className="text-zinc-400 mt-2 text-xl">
            Here's what's happening with your content strategy today.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]"></span>
          </span>
          <span className="text-xs font-medium text-zinc-300">System Active</span>
        </div>
      </div>

      {/* Content Calendar Section */}
      <UpcomingCarousel onNavigate={onNavigate} />
      <div className="pt-6">
        <PerformanceWidget />
      </div>

      {/* Connection Section */}
      <div className="pt-4">
        <ConnectAccountsSection
          connections={connections}
          onConnect={handleConnectAccount}
        />
      </div>

      {/* Quick Create Tools */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-3xl font-bold text-white">Quick Create</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="w-full bg-[#18181B] rounded-[32px] p-8 border border-white/5 hover:border-[#CCFF00]/50 hover:bg-[#27272A] transition-all group text-left relative overflow-hidden"
              onClick={() => onNavigate?.('Create')}
            >
              <div className="absolute right-0 top-0 w-40 h-40 bg-gradient-to-br from-transparent to-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-4xl mb-4">{action.preview}</div>
                  <h3 className="text-2xl font-bold text-white">{action.title}</h3>
                  <p className="text-zinc-500 text-lg mt-1">{action.type}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
