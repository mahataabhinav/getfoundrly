import { BarChart3, Users, Target, TrendingUp } from 'lucide-react';

export default function DashboardTeaser() {
  return (
    <section className="py-32 bg-gradient-to-b from-slate-50/50 via-white to-blue-50/30 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-200/15 rounded-full blur-3xl animate-float-delayed" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Your Digital Footprint
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 font-medium">
            Measured, optimized, simplified.
          </p>
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            See your impact. Feel your growth.
          </p>
        </div>

        <div className="relative">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 flex items-center gap-6 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex gap-6 text-sm font-medium">
                <button className="text-white border-b-2 border-white pb-1">Analytics</button>
                <button className="text-gray-400 hover:text-gray-200 transition-colors">Audience</button>
                <button className="text-gray-400 hover:text-gray-200 transition-colors">Keywords</button>
                <button className="text-gray-400 hover:text-gray-200 transition-colors">Competitors</button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: BarChart3, label: 'Total Reach', value: '124.5K', change: '+12%', color: 'blue' },
                  { icon: Users, label: 'Engagement', value: '8.2K', change: '+24%', color: 'green' },
                  { icon: Target, label: 'Conversions', value: '342', change: '+18%', color: 'purple' },
                  { icon: TrendingUp, label: 'Growth Rate', value: '45%', change: '+8%', color: 'orange' },
                ].map((stat, index) => (
                  <div key={index} className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:from-blue-50 hover:to-slate-50 transition-all duration-300 hover:scale-105 border border-gray-100">
                    <stat.icon className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-green-600 font-medium">{stat.change}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 h-64 border border-blue-100">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Performance Trends</h3>
                  <div className="h-40 flex items-end gap-2">
                    {[40, 65, 45, 80, 60, 95, 70, 85].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:scale-105 shadow-sm" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 h-64 border border-slate-100">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Top Content</h3>
                  <div className="space-y-3">
                    {['LinkedIn post: AI trends', 'Blog: Visibility tactics', 'Email: Weekly roundup'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all hover:scale-105 border border-gray-100">
                        <span className="text-sm">{item}</span>
                        <span className="text-sm font-bold text-blue-600">{95 - i * 10}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-slate-300/20 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
}
