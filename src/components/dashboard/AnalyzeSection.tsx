import { useState } from 'react';
import {
  RefreshCw,
  Loader2,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { getBrandsByUser } from '../../lib/database';
import { getValidAccessToken } from '../../lib/linkedin-oauth';
import { fetchLinkedInAnalytics, type LinkedInAnalyticsResponse } from '../../lib/n8n-webhook';

export default function AnalyzeSection() {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<LinkedInAnalyticsResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  // Mock Data for Demo
  const mockGrowthData = [
    { date: 'Jan 1', followers: 12400 },
    { date: 'Jan 5', followers: 12800 },
    { date: 'Jan 10', followers: 13500 },
    { date: 'Jan 15', followers: 14200 },
    { date: 'Jan 17', followers: 14500 },
  ];

  const mockPreviousContent = [
    {
      id: '1',
      content: "Why most founders fail at storytelling (and how to fix it)",
      date: 'Jan 16, 2026',
      status: 'Published',
      metrics: { impressions: '12.4k', likes: 842, comments: 124 }
    },
    {
      id: '2',
      content: "The 3 tools we used to scale to $10k MRR in 30 days 🚀",
      date: 'Jan 14, 2026',
      status: 'Published',
      metrics: { impressions: '8.5k', likes: 650, comments: 89 }
    },
    {
      id: '3',
      content: "Behind the scenes: Our roadmap for Q1 2026",
      date: 'Jan 12, 2026',
      status: 'Published',
      metrics: { impressions: '5.2k', likes: 420, comments: 56 }
    },
    {
      id: '4',
      content: "Join me for a live AMA this Friday! #FounderLife",
      date: 'Jan 10, 2026',
      status: 'Published',
      metrics: { impressions: '3.1k', likes: 210, comments: 34 }
    },
    {
      id: '5',
      content: "New Feature Alert: AI-powered Analytics is here 🤖",
      date: 'Jan 08, 2026',
      status: 'Published',
      metrics: { impressions: '15.8k', likes: 1205, comments: 245 }
    }
  ];

  const mockDemographics = [
    { name: 'Founders', value: 45 },
    { name: 'Investors', value: 25 },
    { name: 'Product Mgrs', value: 20 },
    { name: 'Other', value: 10 },
  ];

  const mockEngagementData = [
    { name: 'Mon', likes: 240, comments: 45 },
    { name: 'Tue', likes: 380, comments: 60 },
    { name: 'Wed', likes: 890, comments: 120 },
    { name: 'Thu', likes: 650, comments: 90 },
    { name: 'Fri', likes: 420, comments: 55 },
    { name: 'Sat', likes: 200, comments: 30 },
    { name: 'Sun', likes: 310, comments: 40 },
  ];

  const COLORS = ['#CCFF00', '#99CC00', '#669900', '#334D00'];

  const fallbackData = {
    summary: {
      totalImpressions: 145200,
      totalEngagements: 8430,
      totalFollowers: 18542,
      engagementRate: "5.8",
      followerGrowth: 1240,
      totalPosts: 45
    },
    topPosts: [
      {
        id: '1',
        content: "Stop building features nobody wants. Here's how to validate your MVP in 24 hours... 🚀 #Founder #Startup",
        metrics: { impressions: 45200, likes: 1240, comments: 342 },
        postedAt: new Date().toISOString()
      },
      {
        id: '2',
        content: "The biggest mistake I made raising my Seed round was assuming investors care about tech stack. They don't.",
        metrics: { impressions: 32100, likes: 890, comments: 215 },
        postedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: '3',
        content: "Does AI replace developers? No. But developers using AI will replace those who don't. 🤖",
        metrics: { impressions: 28400, likes: 765, comments: 180 },
        postedAt: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ],
    aiInsights: {
      insights: [
        "Your 'Founder Stories' perform 3.5x better than generic industry news.",
        "Wednesday at 9:00 AM EST is your peak engagement window.",
        "Video content is driving 60% of your new follower growth."
      ],
      bestPostingTimes: ["Wed 9AM", "Thu 2PM", "Tue 10AM"],
      growthTrend: "up"
    }
  };

  const currentData = analyticsData || fallbackData;
  const growthData = analyticsData ? [] : mockGrowthData; // Use mock if no real data
  const engagementData = analyticsData ? [] : mockEngagementData;

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
      let tokenData = null;
      for (const brand of brands) {
        const token = await getValidAccessToken(brand.id);
        if (token) {
          tokenData = token;
          break;
        }
      }

      if (!tokenData) {
        throw new Error("No active LinkedIn connection found. Please connect LinkedIn in the 'Create' tab.");
      }

      // 4. Fetch analytics via n8n
      const response = await fetchLinkedInAnalytics({
        userId: session.user.id,
        linkedinAccessToken: tokenData.accessToken,
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
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analyze Performance</h1>
          <p className="text-zinc-400 text-lg">Real-time insights on your growth engine</p>
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
            className="flex items-center gap-2 px-6 py-3 bg-[#CCFF00] hover:bg-[#b3e600] text-black rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Summary Stats - 4 Column */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard
          label="Total Followers"
          value={currentData.summary.totalFollowers.toLocaleString()}
          change="+12.5%"
          icon={Users}
        />
        <StatsCard
          label="Impressions (30d)"
          value={currentData.summary.totalImpressions.toLocaleString()}
          change="+24.2%"
          icon={Eye}
        />
        <StatsCard
          label="Engagements"
          value={currentData.summary.totalEngagements.toLocaleString()}
          change="+8.1%"
          icon={MousePointerClick}
        />
        <StatsCard
          label="Engagement Rate"
          value={`${currentData.summary.engagementRate}%`}
          change="+1.2%"
          icon={TrendingUp}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Growth Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-[#18181B] rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Follower Growth</h3>
              <p className="text-zinc-400 text-sm">Consistent growth over the last 30 days</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-zinc-400">7D</span>
              <span className="px-3 py-1 bg-[#CCFF00]/10 text-[#CCFF00] rounded-lg text-xs font-bold">30D</span>
              <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-zinc-400">90D</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#CCFF00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#52525B" tick={{ fill: '#52525B', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" tick={{ fill: '#52525B', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#27272A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="followers" stroke="#CCFF00" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics / AI Insights (1/3 width) */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-[#18181B] to-[#27272A] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              <h3 className="font-bold text-white">AI Studio Insights</h3>
            </div>
            <div className="space-y-3">
              {currentData.aiInsights.insights.map((insight, idx) => (
                <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-zinc-200 text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Best Posting Times</p>
              <div className="flex flex-wrap gap-2">
                {currentData.aiInsights.bestPostingTimes.map((time, i) => (
                  <span key={i} className="px-2 py-1 bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-bold rounded-lg">
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Demographics Donut */}
          <div className="bg-[#18181B] rounded-3xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-4">Audience</h3>
            <div className="h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockDemographics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockDemographics.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#27272A', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#A1A1AA' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-8">
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">18.5k</span>
                  <p className="text-xs text-zinc-500">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Viral Posts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Engagement Bar Chart */}
        <div className="lg:col-span-1 bg-[#18181B] rounded-3xl p-8 border border-white/5">
          <h3 className="font-bold text-white mb-6">Weekly Engagement</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#52525B" tick={{ fill: '#52525B', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#27272A', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="likes" fill="#CCFF00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" fill="#52525B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Posts List */}
        <div className="lg:col-span-2 bg-[#18181B] rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">Top Performing Content</h3>
            <button className="text-sm text-[#CCFF00] hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {currentData.topPosts.map((post, i) => (
              <div key={post.id} className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-[#CCFF00]/30 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium line-clamp-2 mb-2 group-hover:text-[#CCFF00] transition-colors">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.metrics.impressions.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {post.metrics.likes}</span>
                    <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {post.metrics.comments}</span>
                    <span>{new Date(post.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-[#CCFF00] font-bold text-lg">A+</div>
                  <div className="text-xs text-zinc-500">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Previous Content Section */}
      <div className="bg-[#18181B] rounded-3xl p-8 border border-white/5">
        <h3 className="font-bold text-white mb-6">Previous Content Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/5">
                <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider w-1/2">Post Content</th>
                <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date Posted</th>
                <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockPreviousContent.map((post) => (
                <tr key={post.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-6">
                    <p className="text-white text-sm font-medium line-clamp-1 group-hover:text-[#CCFF00] transition-colors">{post.content}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-zinc-400 text-sm">{post.date}</p>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.metrics.impressions}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> {post.metrics.likes}</span>
                      <span className="flex items-center gap-1"><MousePointerClick className="w-3.5 h-3.5" /> {post.metrics.comments}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, change, icon: Icon }: any) {
  return (
    <div className="bg-[#18181B] rounded-3xl p-6 border border-white/5 hover:border-[#CCFF00]/20 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-zinc-500 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
        </div>
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#CCFF00]/10 transition-colors">
          <Icon className="w-6 h-6 text-zinc-400 group-hover:text-[#CCFF00]" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-xs font-bold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
        <span className="text-zinc-600 text-xs">vs last 30 days</span>
      </div>
    </div>
  )
}
