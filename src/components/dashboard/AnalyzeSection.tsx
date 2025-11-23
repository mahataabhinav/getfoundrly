import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function AnalyzeSection() {
  const keywordData = [
    { keyword: 'AI productivity tools', change: '+24%', trend: 'up', volume: '12.4k' },
    { keyword: 'SMB marketing automation', change: '+18%', trend: 'up', volume: '8.2k' },
    { keyword: 'Brand visibility strategies', change: '-5%', trend: 'down', volume: '6.7k' },
    { keyword: 'Content creation AI', change: '+32%', trend: 'up', volume: '15.1k' },
  ];

  const competitorData = [
    { name: 'Competitor A', score: 85, change: '+12' },
    { name: 'Competitor B', score: 72, change: '+5' },
    { name: 'Your Brand', score: 72, change: '+8' },
    { name: 'Competitor C', score: 68, change: '-3' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Analyze Performance</h1>
          <p className="text-gray-600">Data-driven insights for smarter decisions</p>
        </div>
        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Early Access Preview
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-[#1A1A1A] mb-4">Engagement Trends</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 88, 85].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-[#1A1A1A] mb-4">Audience Insights</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  className="transition-all duration-1000"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="125.6"
                  className="transition-all duration-1000"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-700">LinkedIn</span>
              </div>
              <p className="text-lg font-semibold text-[#1A1A1A]">45%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-gray-700">Instagram</span>
              </div>
              <p className="text-lg font-semibold text-[#1A1A1A]">30%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-700">Email</span>
              </div>
              <p className="text-lg font-semibold text-[#1A1A1A]">25%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">Keyword Performance</h3>
        <div className="space-y-3">
          {keywordData.map((item) => (
            <div key={item.keyword} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${item.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.trend === 'up' ? (
                    <TrendingUp className={`w-5 h-5 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingDown className={`w-5 h-5 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A]">{item.keyword}</p>
                  <p className="text-sm text-gray-500">{item.volume} monthly searches</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 font-semibold ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {item.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">Competitive Visibility</h3>
        <div className="space-y-4">
          {competitorData.map((competitor, index) => (
            <div key={competitor.name} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500 w-8">{index + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${competitor.name === 'Your Brand' ? 'text-blue-600' : 'text-[#1A1A1A]'}`}>
                    {competitor.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1A1A1A]">{competitor.score}</span>
                    <span className={`text-xs ${competitor.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {competitor.change}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      competitor.name === 'Your Brand' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${competitor.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
