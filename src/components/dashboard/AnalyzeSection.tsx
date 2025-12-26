import { useState } from 'react';
import {
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getBrandsByUser } from '../../lib/database';
import { getValidAccessToken } from '../../lib/linkedin-oauth';
import { fetchLinkedInAnalytics, type LinkedInAnalyticsResponse } from '../../lib/n8n-webhook';

export default function AnalyzeSection() {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<LinkedInAnalyticsResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  // Initial mock data as fallback until refreshed
  const fallbackData = {
    summary: {
      totalImpressions: 0,
      totalEngagements: 0,
      totalFollowers: 0,
      engagementRate: "0",
      followerGrowth: 0,
      totalPosts: 0
    },
    charts: {
      engagementTrends: [45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 88, 85].map((val, i) => ({ date: `Month ${i + 1}`, value: val })),
      impressionsOverTime: [],
      engagementsByType: [],
      followerGrowth: []
    },
    topPosts: [],
    profile: {},
    organization: {},
    aiInsights: {
      insights: ["Connect your LinkedIn account to see real AI-driven insights."],
      bestPostingTimes: [],
      contentTypeRecommendations: {},
      growthTrend: "neutral"
    }
  };

  const currentData = analyticsData || fallbackData;

  const handleRefreshAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("User not authenticated");

      // 2. Get primary brand
      const brands = await getBrandsByUser(session.user.id);
      if (!brands || brands.length === 0) {
        throw new Error("No brand found. Please create a brand first.");
      }
      // 3. Get valid LinkedIn token (decrypted)
      // Check ALL brands for a valid token, not just the first one
      let tokenData = null;

      for (const brand of brands) {
        const token = await getValidAccessToken(brand.id);
        if (token) {
          tokenData = token;
          break; // Found a valid token, stop searching
        }
      }

      if (!tokenData) {
        throw new Error("No active LinkedIn connection found. Please connect LinkedIn in the 'Create' tab.");
      }

      // 4. Fetch analytics via n8n
      const response = await fetchLinkedInAnalytics({
        userId: session.user.id,
        linkedinAccessToken: tokenData.accessToken,
        // organizationId: 'optional', // Add if available in brand metadata
        timeRange: 'last_30_days'
      });

      if (response && response.success) {
        setAnalyticsData(response.data);
        setLastRefreshed(new Date().toLocaleTimeString());
      } else {
        throw new Error("Failed to fetch analytics data.");
      }

    } catch (err: any) {
      console.error("Analytics refresh failed:", err);
      setError(err.message || "Failed to refresh analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Analyze Performance</h1>
          <p className="text-zinc-400">Data-driven insights for smarter decisions</p>
        </div>
        <div className="flex items-center gap-4">
          {lastRefreshed && (
            <span className="text-xs text-zinc-500 hidden sm:inline-block">
              Updated: {lastRefreshed}
            </span>
          )}
          <button
            onClick={handleRefreshAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#CCFF00] hover:bg-[#b3e600] text-black rounded-full text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh Analytics
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#18181B] rounded-[24px] p-6 border border-white/5">
          <p className="text-zinc-500 text-sm font-medium mb-2">Impressions</p>
          <p className="text-3xl font-bold text-white">{currentData.summary.totalImpressions.toLocaleString()}</p>
        </div>
        <div className="bg-[#18181B] rounded-[24px] p-6 border border-white/5">
          <p className="text-zinc-500 text-sm font-medium mb-2">Engagements</p>
          <p className="text-3xl font-bold text-white">{currentData.summary.totalEngagements.toLocaleString()}</p>
        </div>
        <div className="bg-[#18181B] rounded-[24px] p-6 border border-white/5">
          <p className="text-zinc-500 text-sm font-medium mb-2">Engagement Rate</p>
          <p className="text-3xl font-bold text-white">{currentData.summary.engagementRate}%</p>
        </div>
        <div className="bg-[#18181B] rounded-[24px] p-6 border border-white/5">
          <p className="text-zinc-500 text-sm font-medium mb-2">Follower Growth</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-white">+{currentData.summary.followerGrowth}</p>
            <span className="text-green-500 text-sm bg-green-500/10 px-2 py-0.5 rounded-full">New</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Engagement Trends Chart */}
        <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Engagement Trends (Last 30 Days)</h3>
          {currentData.charts.engagementTrends.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {currentData.charts.engagementTrends.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all relative"
                    style={{ height: `${Math.max(5, (point.value / Math.max(...currentData.charts.engagementTrends.map(p => p.value))) * 100)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {point.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500 bg-white/5 rounded-xl">
              No trend data available
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
            <h3 className="font-semibold text-white">AI Insights</h3>
          </div>

          <div className="space-y-4">
            {currentData.aiInsights.insights.map((insight, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-zinc-300 text-sm leading-relaxed">{insight}</p>
              </div>
            ))}

            {currentData.aiInsights.bestPostingTimes.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">Best Times to Post</p>
                <div className="flex flex-wrap gap-2">
                  {currentData.aiInsights.bestPostingTimes.map((time, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Posts Table */}
      {currentData.topPosts.length > 0 && (
        <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Top Performing Posts</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/5">
                  <th className="pb-3 pl-2">Post Content</th>
                  <th className="pb-3 text-right">Impressions</th>
                  <th className="pb-3 text-right">Likes</th>
                  <th className="pb-3 text-right">Comments</th>
                  <th className="pb-3 text-right pr-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentData.topPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-2">
                      <p className="text-sm text-zinc-300 line-clamp-1 max-w-md group-hover:text-white transition-colors">{post.content}</p>
                    </td>
                    <td className="py-4 text-right text-sm text-white font-medium">{post.metrics.impressions.toLocaleString()}</td>
                    <td className="py-4 text-right text-sm text-zinc-400">{post.metrics.likes}</td>
                    <td className="py-4 text-right text-sm text-zinc-400">{post.metrics.comments}</td>
                    <td className="py-4 text-right text-sm text-zinc-500 pr-2">{new Date(post.postedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
