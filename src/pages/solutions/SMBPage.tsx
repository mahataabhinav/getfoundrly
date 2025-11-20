import { Rocket, Clock, TrendingUp, Users, Target, Zap, CheckCircle, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../../components/shared/PageHero';
import FeatureGrid from '../../components/shared/FeatureGrid';
import CTASection from '../../components/shared/CTASection';
import StatsBar from '../../components/shared/StatsBar';

export default function SMBPage() {
  const navigate = useNavigate();

  const painPoints = [
    {
      icon: Clock,
      title: 'No Time for Content',
      description: 'You\'re running the business, talking to customers, and building products. Content creation falls to the bottom of the priority list.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Users,
      title: 'Can\'t Afford a Marketing Team',
      description: 'Hiring writers, designers, and marketers isn\'t in the budget. You need results without the overhead.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Target,
      title: 'Inconsistent Presence',
      description: 'You post when you can, but there\'s no strategy. Your competitors are building authority while you\'re silent.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: BarChart,
      title: 'No Data to Guide You',
      description: 'You don\'t know what\'s working or where to focus. You\'re guessing instead of making data-driven decisions.',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const solutions = [
    {
      icon: Zap,
      title: 'Create Content in Minutes',
      description: 'Generate professional posts, ads, and articles in seconds. No writing skills required.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Strategy',
      description: 'See what works, track your growth, and make smart decisions backed by analytics.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Rocket,
      title: 'Scale Without Hiring',
      description: 'Get the output of a full marketing team without the cost or management overhead.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Consistent Brand Voice',
      description: 'AI learns your style and maintains consistency across all content and platforms.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { value: '10hrs', label: 'Saved Per Week', color: 'text-blue-600' },
    { value: '5x', label: 'More Content', color: 'text-green-600' },
    { value: '92%', label: 'Cost Savings', color: 'text-purple-600' },
    { value: '3x', label: 'Faster Growth', color: 'text-orange-600' }
  ];

  const results = [
    'Build authority in your industry without spending hours writing',
    'Maintain consistent presence across LinkedIn, Instagram, email, and blog',
    'Generate leads through valuable content that attracts your ideal customers',
    'Compete with larger companies that have full marketing teams',
    'Track performance and optimize strategy based on real data',
    'Focus on what you do best while Foundrly handles content creation'
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        subtitle="Solutions for AI-Powered SMBs"
        title="Scale Your Content Without Scaling Your Team"
        description="Built for small and medium businesses using AI to compete with enterprise companies. Get enterprise-level content marketing without the enterprise budget."
      >
        <button
          onClick={() => navigate('/signup')}
          className="group bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <span>Start Free Trial</span>
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </button>
      </PageHero>

      <StatsBar stats={stats} variant="light" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              The Content Marketing Challenge
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As an AI-powered SMB, you understand the importance of content marketing. But creating quality content consistently is a different challenge entirely.
            </p>
          </div>
          <FeatureGrid features={painPoints} columns={4} />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Foundrly Solves This
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We built Foundrly specifically for businesses like yours. Get the content marketing results you need without the traditional overhead.
            </p>
          </div>
          <FeatureGrid features={solutions} columns={4} />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Real Results for Real Businesses
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join hundreds of AI-powered SMBs using Foundrly to build their brands, generate leads, and grow their businesses through strategic content marketing.
              </p>
              <ul className="space-y-4">
                {results.map((result, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Case Study</div>
                <h3 className="text-2xl font-bold mb-4">
                  TechFlow AI: From Zero to 50K LinkedIn Followers
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">The Challenge</div>
                  <p className="text-gray-200">
                    3-person AI startup needed to build thought leadership but had no time for content creation.
                  </p>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1">The Solution</div>
                  <p className="text-gray-200">
                    Used Foundrly to create and schedule 5 LinkedIn posts per week, plus monthly newsletters.
                  </p>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1">The Results</div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-3xl font-bold text-blue-400">50K</div>
                      <div className="text-sm text-gray-400">Followers in 6 months</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">200+</div>
                      <div className="text-sm text-gray-400">Qualified leads</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-400">15hrs</div>
                      <div className="text-sm text-gray-400">Saved per week</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-400">$0</div>
                      <div className="text-sm text-gray-400">Hiring costs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        title="Ready to Scale Your Content Marketing?"
        description="Join AI-powered SMBs building undeniable brands with Foundrly."
        primaryButtonText="Start Your Free Trial"
        primaryButtonAction={() => navigate('/signup')}
        secondaryButtonText="View Pricing"
        secondaryButtonAction={() => navigate('/pricing')}
      />
    </div>
  );
}
