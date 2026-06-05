import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Linkedin, Instagram, Mail, FileText, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getBrandsByUser } from '../../lib/database';
import EmptyState from './EmptyState';

interface UpcomingPost {
  id: string;
  title: string;
  platform: string;
  scheduled_at: string;
  content_preview?: string;
  media_urls?: string[];
  status: string;
}

interface UpcomingCarouselProps {
  onNavigate?: (tab: string) => void;
}

export default function UpcomingCarousel({ onNavigate }: UpcomingCarouselProps = {}) {
  const [scheduledPosts, setScheduledPosts] = useState<UpcomingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchScheduledContent();
  }, []);

  const fetchScheduledContent = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      // Get user's brand
      const brands = await getBrandsByUser(session.user.id);
      if (!brands || brands.length === 0) {
        setLoading(false);
        return;
      }

      const brandId = brands[0].id;

      // Fetch scheduled content
      const { data, error } = await supabase
        .from('content_schedules')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching scheduled content:', error);
        setLoading(false);
        return;
      }

      setScheduledPosts(data || []);
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin className="w-4 h-4 text-[#0077B5]" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-[#E4405F]" />;
      case 'email':
      case 'newsletter': return <Mail className="w-4 h-4 text-[#EA4335]" />;
      case 'blog': return <FileText className="w-4 h-4 text-emerald-500" />;
      default: return <FileText className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return '#0077B5';
      case 'instagram': return '#E4405F';
      case 'email':
      case 'newsletter': return '#EA4335';
      case 'blog': return '#10B981';
      default: return '#71717A';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#CCFF00]" />
            Upcoming Content
          </h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[400px] bg-[#18181B] border border-white/5 rounded-[32px] p-8 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-white/5 rounded w-2/3 mb-4"></div>
              <div className="h-48 bg-white/5 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scheduledPosts.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#CCFF00]" />
            Upcoming Content
          </h2>
        </div>
        <EmptyState
          icon={<Calendar className="w-16 h-16" />}
          title="No upcoming content"
          description="Schedule your first post to see it here and keep track of your content calendar"
          action={
            <button
              onClick={() => onNavigate?.('Create')}
              className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Content
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full relative group">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#CCFF00]" />
          Upcoming Content
        </h2>
        {scheduledPosts.length > 2 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {scheduledPosts.map((post) => {
          const { date, time } = formatDate(post.scheduled_at);
          const color = getColor(post.platform);

          return (
            <div
              key={post.id}
              className="snap-start min-w-[400px] bg-[#18181B] border border-white/5 rounded-[32px] p-8 hover:border-[#CCFF00]/30 transition-all group/card cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: color }}
              />

              <div className="flex justify-between items-start mb-6 pl-4">
                <div className="flex items-center gap-3">
                  <span className="bg-zinc-900 p-2.5 rounded-xl border border-white/5">
                    {getIcon(post.platform)}
                  </span>
                  <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    {post.platform}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{date}</p>
                  <p className="text-xs text-zinc-500">{time}</p>
                </div>
              </div>

              <div className="pl-4">
                <h3 className="text-lg font-bold text-zinc-100 line-clamp-2 leading-relaxed mb-4">
                  {post.title || 'Scheduled Post'}
                </h3>

                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="rounded-2xl overflow-hidden h-48 w-full mt-4 relative group/media">
                    <img
                      src={post.media_urls[0]}
                      alt=""
                      className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {post.content_preview && !post.media_urls && (
                  <div className="h-48 w-full mt-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium line-clamp-6">
                      {post.content_preview}
                    </p>
                  </div>
                )}

                {!post.content_preview && !post.media_urls && (
                  <div className="h-48 w-full mt-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center">
                    <p className="text-sm text-zinc-500">
                      Content will be published at scheduled time
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
