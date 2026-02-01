import { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, ArrowUpRight, TrendingDown, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getBrandsByUser } from '../../lib/database';
import EmptyState from './EmptyState';

interface AnalyticsData {
  totalReach: number;
  reachGrowth: number;
  engagement: number;
  engagementGrowth: number;
  audience: number;
  audienceGrowth: number;
  totalPosts: number;
}

export default function PerformanceWidget() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasConnection, setHasConnection] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
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

      // Check if user has LinkedIn connection
      const { data: connections } = await supabase
        .from('connections')
        .select('*')
        .eq('brand_id', brandId)
        .eq('platform', 'linkedin')
        .eq('status', 'connected');

      setHasConnection(!!connections && connections.length > 0);

      // Fetch LinkedIn analytics if available
      const { data: analyticsData, error } = await supabase
        .from('linkedin_analytics')
        .select('*')
        .eq('brand_id', brandId)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
        return;
      }

      if (!analyticsData || analyticsData.length === 0) {
        setLoading(false);
        return;
      }

      // Calculate aggregate metrics
      const totalReach = analyticsData.reduce((sum, item) => sum + (item.impressions || 0), 0);
      const totalEngagements = analyticsData.reduce((sum, item) => sum + (item.engagement_count || 0), 0);
      const engagementRate = totalReach > 0 ? (totalEngagements / totalReach) * 100 : 0;

      // Calculate growth (compare last 15 days vs previous 15 days)
      const recent = analyticsData.slice(0, 15);
      const previous = analyticsData.slice(15, 30);

      const recentReach = recent.reduce((sum, item) => sum + (item.impressions || 0), 0);
      const previousReach = previous.reduce((sum, item) => sum + (item.impressions || 0), 0);
      const reachGrowth = previousReach > 0 ? ((recentReach - previousReach) / previousReach) * 100 : 0;

      const recentEngagements = recent.reduce((sum, item) => sum + (item.engagement_count || 0), 0);
      const previousEngagements = previous.reduce((sum, item) => sum + (item.engagement_count || 0), 0);
      const recentEngagementRate = recentReach > 0 ? (recentEngagements / recentReach) * 100 : 0;
      const previousEngagementRate = previousReach > 0 ? (previousEngagements / previousReach) * 100 : 0;
      const engagementGrowth = previousEngagementRate > 0
        ? ((recentEngagementRate - previousEngagementRate) / previousEngagementRate) * 100
        : 0;

      // Get follower count from most recent entry
      const followerCount = analyticsData[0]?.follower_count || 0;
      const previousFollowerCount = analyticsData[analyticsData.length - 1]?.follower_count || 0;
      const audienceGrowth = previousFollowerCount > 0
        ? ((followerCount - previousFollowerCount) / previousFollowerCount) * 100
        : 0;

      setAnalytics({
        totalReach,
        reachGrowth,
        engagement: engagementRate,
        engagementGrowth,
        audience: followerCount,
        audienceGrowth,
        totalPosts: analyticsData.length,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#18181B] rounded-[32px] p-8 border border-white/5 animate-pulse">
            <div className="h-6 bg-white/5 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/5 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics || analytics.totalPosts === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="w-16 h-16" />}
        title="No analytics yet"
        description={
          hasConnection
            ? "Publish your first post to see performance metrics here"
            : "Connect your LinkedIn account and publish posts to see performance metrics"
        }
        action={
          !hasConnection ? (
            <a
              href="/dashboard"
              className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all inline-block"
            >
              Connect LinkedIn
            </a>
          ) : undefined
        }
      />
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const renderGrowthBadge = (growth: number) => {
    const isPositive = growth >= 0;
    const Icon = isPositive ? ArrowUpRight : TrendingDown;
    const colorClass = isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10';

    return (
      <span className={`flex items-center text-sm font-bold mb-2 px-2 py-1 rounded-lg ${colorClass}`}>
        <Icon className="w-4 h-4 mr-0.5" /> {Math.abs(growth).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
      {/* Total Reach */}
      <div className="bg-[#18181B] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Eye className="w-12 h-12 text-blue-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-zinc-400 mb-3">
            <Eye className="w-6 h-6" />
            <span className="text-lg font-medium">Total Reach</span>
          </div>
          <div className="flex items-end gap-4">
            <h3 className="text-5xl font-bold text-white">{formatNumber(analytics.totalReach)}</h3>
            {renderGrowthBadge(analytics.reachGrowth)}
          </div>
        </div>
      </div>

      {/* Engagement */}
      <div className="bg-[#18181B] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-16 h-16 text-[#CCFF00]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-zinc-400 mb-3">
            <TrendingUp className="w-6 h-6" />
            <span className="text-lg font-medium">Engagement</span>
          </div>
          <div className="flex items-end gap-4">
            <h3 className="text-5xl font-bold text-white">{analytics.engagement.toFixed(1)}%</h3>
            {renderGrowthBadge(analytics.engagementGrowth)}
          </div>
        </div>
      </div>

      {/* Audience Growth */}
      <div className="bg-[#18181B] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users className="w-16 h-16 text-purple-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-zinc-400 mb-3">
            <Users className="w-6 h-6" />
            <span className="text-lg font-medium">Audience</span>
          </div>
          <div className="flex items-end gap-4">
            <h3 className="text-5xl font-bold text-white">{formatNumber(analytics.audience)}</h3>
            {renderGrowthBadge(analytics.audienceGrowth)}
          </div>
        </div>
      </div>
    </div>
  );
}
