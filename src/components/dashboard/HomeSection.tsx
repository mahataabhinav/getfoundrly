import { ArrowRight, TrendingUp, ArrowUp, ArrowDown, Calendar, FileText } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';

export default function HomeSection() {
  const quickActions = [
    { title: 'Create LinkedIn Post', type: 'LinkedIn', preview: '📱' },
    { title: 'Create Instagram Ad', type: 'Instagram', preview: '📸' },
    { title: 'Create Newsletter', type: 'Email', preview: '✉️' },
  ];

  const analytics = [
    { label: 'Visibility Score', value: '72', max: '100', trend: '+8%' },
    { label: 'Top Performing Post', value: '+2.4k', sublabel: 'views', trend: '+12%' },
    { label: 'Keyword Opportunities', value: '12', sublabel: 'new', trend: 'new' },
    { label: 'Competitor Movement', value: '3', sublabel: 'trending topics', trend: 'watch' },
  ];

  const contentQueue = [
    { title: 'AI Productivity Tips for SMBs', status: 'Scheduled', date: 'Jan 18, 9:00 AM', platform: 'LinkedIn' },
    { title: 'Visibility Strategies 2024', status: 'Draft', date: 'Jan 19', platform: 'Newsletter' },
    { title: 'Brand Authority Checklist', status: 'Posted', date: 'Jan 15, 2:00 PM', platform: 'Instagram' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-6 md:p-8 border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-2 break-words">
              Welcome back, Sarah 👋
            </h1>
            <p className="text-sm md:text-base text-gray-600">Here's what's happening with your visibility today</p>
          </div>
          <div className="hidden md:block flex-shrink-0">
            <RobotChatbot size={80} animate={true} gesture="wave" />
          </div>
        </div>
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 inline-block">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Foundi says:</span> "Ready to boost visibility today?"
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all text-left group"
            >
              <div className="text-4xl mb-4">{action.preview}</div>
              <h3 className="font-medium text-[#1A1A1A] mb-1">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.type}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 group-hover:text-[#1A1A1A] transition-colors">
                <span>Generate</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Analytics Snapshot</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {analytics.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-semibold text-[#1A1A1A]">{stat.value}</span>
                {stat.max && <span className="text-gray-500">/ {stat.max}</span>}
              </div>
              {stat.sublabel && <p className="text-sm text-gray-500">{stat.sublabel}</p>}
              {stat.trend && stat.trend.includes('%') && (
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50/50 to-slate-50/50 rounded-2xl p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Foundi Recommendations</h3>
            <p className="text-gray-700 leading-relaxed">
              Based on your audience trends, posting about <span className="font-medium">'AI productivity for SMBs'</span> may drive <span className="font-medium text-blue-600">+34% engagement</span>.
            </p>
          </div>
        </div>
        <button className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all hover:shadow-lg text-sm font-medium">
          Generate Post
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Content Queue</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contentQueue.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#1A1A1A] font-medium">{item.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : item.status === 'Draft'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
