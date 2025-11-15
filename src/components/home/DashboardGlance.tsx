import { BarChart3, TrendingUp, Eye, Calendar, Sparkles } from 'lucide-react';
import Foundii from '../Foundii';

export default function DashboardGlance() {
  return (
    <section className="relative py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            One dashboard for your visibility.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you create, schedule, and publish — tracked in one place.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Welcome back, Founder</h3>
                <p className="text-gray-400">Here's your visibility overview</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                  Create Content
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition-all hover:scale-105 text-left">
                <div className="text-sm opacity-90 mb-1">LinkedIn</div>
                <div className="font-bold">Create Post</div>
              </button>
              <button className="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-2xl transition-all hover:scale-105 text-left">
                <div className="text-sm opacity-90 mb-1">Instagram</div>
                <div className="font-bold">Create Ad</div>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl transition-all hover:scale-105 text-left">
                <div className="text-sm opacity-90 mb-1">Email</div>
                <div className="font-bold">Create Newsletter</div>
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl transition-all hover:scale-105 text-left">
                <div className="text-sm opacity-90 mb-1">Web</div>
                <div className="font-bold">Create Blog Post</div>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Visibility Score</div>
                    <div className="text-3xl font-bold text-white">87.5</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">↑ 12.3%</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Eye className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Impressions</div>
                    <div className="text-3xl font-bold text-white">24.8K</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">↑ 18.7%</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Engagement Rate</div>
                    <div className="text-3xl font-bold text-white">4.2%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">↑ 0.8%</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-white">Top Performing Content</h4>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium text-sm">How AI is transforming...</div>
                      <div className="text-gray-400 text-xs">LinkedIn • 3 days ago</div>
                    </div>
                    <div className="text-green-400 font-bold">2.4K</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium text-sm">Product launch video</div>
                      <div className="text-gray-400 text-xs">Instagram • 5 days ago</div>
                    </div>
                    <div className="text-green-400 font-bold">1.8K</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Foundii size={80} animate={true} gesture="thinking" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-white">Foundi's Suggestion</h4>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  I'll help you create and optimize content that reaches your audience at the perfect time.
                </p>
                <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-white">Upcoming Scheduled Posts</h4>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-400">LinkedIn</span>
                  </div>
                  <div className="text-white font-medium text-sm mb-1">Thought leadership post</div>
                  <div className="text-gray-400 text-xs">Tomorrow, 9:14 AM</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-400">Newsletter</span>
                  </div>
                  <div className="text-white font-medium text-sm mb-1">Weekly digest</div>
                  <div className="text-gray-400 text-xs">Oct 22, 8:00 AM</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-400">Blog</span>
                  </div>
                  <div className="text-white font-medium text-sm mb-1">SEO guide</div>
                  <div className="text-gray-400 text-xs">Oct 23, 10:04 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
