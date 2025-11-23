import { useState } from 'react';
import { Menu, X, ChevronDown, Sparkles, TrendingUp, Rocket, Linkedin, Instagram, Mail, FileText, BarChart, Target, Users, Award, Globe, Gift, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface HeaderEnhancedProps {
  scrollY: number;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function HeaderEnhanced({ scrollY, onLoginClick, onSignupClick }: HeaderEnhancedProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const isScrolled = scrollY > 20;

  const productMenuItems = {
    create: [
      { icon: Linkedin, label: 'LinkedIn Posts', path: '/product/create/linkedin', desc: 'Professional thought leadership' },
      { icon: Instagram, label: 'Instagram Ads', path: '/product/create/instagram', desc: 'Visual brand storytelling' },
      { icon: Mail, label: 'Newsletters', path: '/product/create/newsletters', desc: 'Email campaigns that convert' },
      { icon: FileText, label: 'Blog Posts', path: '/product/create/blog', desc: 'SEO-optimized articles' }
    ],
    analyze: [
      { icon: BarChart, label: 'Engagement Trends', path: '/product/analyze/engagement', desc: 'Track performance metrics' },
      { icon: Target, label: 'Keyword Performance', path: '/product/analyze/keywords', desc: 'SEO insights and rankings' },
      { icon: Users, label: 'Audience Insights', path: '/product/analyze/audience', desc: 'Know your followers' },
      { icon: TrendingUp, label: 'Competitive Analysis', path: '/product/analyze/competitive', desc: 'Stay ahead of rivals' }
    ],
    grow: [
      { icon: Globe, label: 'Website Analyzer', path: '/product/grow/website', desc: 'Instant brand feedback' },
      { icon: Award, label: 'Authority Score', path: '/product/grow/authority', desc: 'Track thought leadership' },
      { icon: Gift, label: 'Offer Builder', path: '/product/grow/offers', desc: 'Create lead magnets' },
      { icon: Calendar, label: 'Content Calendar', path: '/product/grow/calendar', desc: 'Plan and schedule' }
    ]
  };

  const solutionsMenuItems = [
    { icon: Rocket, label: 'AI-Powered SMBs', path: '/solutions/smb', desc: 'Scale content without scaling teams' },
    { icon: Users, label: 'Business Owners', path: '/solutions/business-owners', desc: 'Build authority while running your business' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="cursor-pointer">
            <Logo variant="dark" iconSize={32} showWordmark={true} />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative group"
              onMouseEnter={() => setHoveredMenu('product')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {hoveredMenu === 'product' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[720px]">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-fade-in">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">Create</h3>
                        </div>
                        <div className="space-y-2">
                          {productMenuItems.create.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                              >
                                <div className="flex items-start gap-3">
                                  <Icon className="w-5 h-5 text-gray-400 group-hover/item:text-gray-900 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 mb-0.5">{item.label}</div>
                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">Analyze</h3>
                        </div>
                        <div className="space-y-2">
                          {productMenuItems.analyze.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                              >
                                <div className="flex items-start gap-3">
                                  <Icon className="w-5 h-5 text-gray-400 group-hover/item:text-gray-900 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 mb-0.5">{item.label}</div>
                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Rocket className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-gray-900">Grow</h3>
                        </div>
                        <div className="space-y-2">
                          {productMenuItems.grow.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                              >
                                <div className="flex items-start gap-3">
                                  <Icon className="w-5 h-5 text-gray-400 group-hover/item:text-gray-900 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 mb-0.5">{item.label}</div>
                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <Link
                        to="/product"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group/overview"
                      >
                        <span className="text-sm font-medium text-gray-900">View Full Product Overview</span>
                        <span className="transform transition-transform group-hover/overview:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setHoveredMenu('solutions')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {hoveredMenu === 'solutions' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[380px]">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-fade-in">
                    <div className="space-y-2">
                      {solutionsMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group/item"
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="w-6 h-6 text-gray-400 group-hover/item:text-gray-900 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900 mb-1">{item.label}</div>
                                <div className="text-sm text-gray-500">{item.desc}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={onLoginClick} className="text-gray-700 hover:text-gray-900 transition-colors px-4 py-2">
              Login
            </button>
            <button onClick={onSignupClick} className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 group">
              <span>Try for Free</span>
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/product" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Product</Link>
              <Link to="/solutions/smb" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/resources" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <button onClick={onLoginClick} className="text-gray-700 hover:text-gray-900 text-left">Login</button>
              <button onClick={onSignupClick} className="bg-gray-900 text-white px-6 py-2.5 rounded-full w-full">
                Try for Free →
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
