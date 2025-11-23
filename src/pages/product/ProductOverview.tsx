import { Sparkles, TrendingUp, Rocket, Linkedin, Instagram, Mail, FileText, BarChart, Target, Users, Award, Globe, Gift, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../../components/shared/PageHero';
import FeatureGrid from '../../components/shared/FeatureGrid';
import CTASection from '../../components/shared/CTASection';
import StatsBar from '../../components/shared/StatsBar';

export default function ProductOverview() {
  const navigate = useNavigate();

  const createFeatures = [
    { icon: Linkedin, title: 'LinkedIn Posts', description: 'Professional thought leadership content that positions you as an industry expert.', color: 'from-blue-500 to-blue-600' },
    { icon: Instagram, title: 'Instagram Ads', description: 'Eye-catching visual ads with AI-optimized timing and targeting.', color: 'from-pink-500 to-purple-600' },
    { icon: Mail, title: 'Newsletters', description: 'Conversion-focused email campaigns created and scheduled in minutes.', color: 'from-green-500 to-emerald-600' },
    { icon: FileText, title: 'Blog Posts', description: 'Long-form SEO-optimized articles ready to publish and rank.', color: 'from-orange-500 to-red-600' }
  ];

  const analyzeFeatures = [
    { icon: BarChart, title: 'Engagement Trends', description: 'Track performance metrics across all your content platforms.', color: 'from-blue-500 to-blue-600' },
    { icon: Target, title: 'Keyword Performance', description: 'Monitor SEO rankings and discover new keyword opportunities.', color: 'from-green-500 to-green-600' },
    { icon: Users, title: 'Audience Insights', description: 'Understand your followers demographics and behavior patterns.', color: 'from-purple-500 to-purple-600' },
    { icon: TrendingUp, title: 'Competitive Analysis', description: 'Stay ahead by tracking your competitors visibility and strategy.', color: 'from-orange-500 to-orange-600' }
  ];

  const growFeatures = [
    { icon: Globe, title: 'Website Analyzer', description: 'Get instant feedback on your brand messaging and website SEO.', color: 'from-blue-500 to-blue-600' },
    { icon: Award, title: 'Authority Score', description: 'Track your thought leadership and industry credibility over time.', color: 'from-green-500 to-green-600' },
    { icon: Gift, title: 'Offer Builder', description: 'Create irresistible lead magnets that grow your email list.', color: 'from-purple-500 to-purple-600' },
    { icon: Calendar, title: 'Content Calendar', description: 'Plan and schedule content across all platforms from one place.', color: 'from-orange-500 to-orange-600' }
  ];

  const stats = [
    { value: '10M+', label: 'Content Pieces Created', color: 'text-blue-600' },
    { value: '50K+', label: 'Active Users', color: 'text-green-600' },
    { value: '95%', label: 'Time Saved', color: 'text-purple-600' },
    { value: '4.9/5', label: 'Customer Rating', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        subtitle="Complete Platform"
        title="Everything you need to build an undeniable brand"
        description="Create, analyze, and grow your visibility with AI-powered tools designed for modern founders and business owners."
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/signup')}
            className="group bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            <span>Start Free Trial</span>
            <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl hover:scale-105"
          >
            View Pricing
          </button>
        </div>
      </PageHero>

      <StatsBar stats={stats} variant="light" />

      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Create</h2>
          </div>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            Generate professional, on-brand content across all platforms in seconds. From LinkedIn posts to blog articles, Foundrly understands your voice and creates content that resonates.
          </p>
          <FeatureGrid
            features={createFeatures}
            columns={4}
            onFeatureClick={(index) => {
              const paths = ['/product/create/linkedin', '/product/create/instagram', '/product/create/newsletters', '/product/create/blog'];
              navigate(paths[index]);
            }}
          />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Analyze</h2>
          </div>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            Make data-driven decisions with comprehensive analytics. Track what works, understand your audience, and stay ahead of the competition with real-time insights.
          </p>
          <FeatureGrid
            features={analyzeFeatures}
            columns={4}
            onFeatureClick={(index) => {
              const paths = ['/product/analyze/engagement', '/product/analyze/keywords', '/product/analyze/audience', '/product/analyze/competitive'];
              navigate(paths[index]);
            }}
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Rocket className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Grow</h2>
          </div>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            Amplify your reach and accelerate growth with powerful tools designed to build authority, generate leads, and streamline your content strategy.
          </p>
          <FeatureGrid
            features={growFeatures}
            columns={4}
            onFeatureClick={(index) => {
              const paths = ['/product/grow/website', '/product/grow/authority', '/product/grow/offers', '/product/grow/calendar'];
              navigate(paths[index]);
            }}
          />
        </div>
      </section>

      <CTASection
        variant="dark"
        title="Ready to transform your visibility?"
        description="Join thousands of founders and business owners who've made their brands undeniable with Foundrly."
        primaryButtonText="Start Your Free Trial"
        primaryButtonAction={() => navigate('/signup')}
        secondaryButtonText="Schedule a Demo"
        secondaryButtonAction={() => navigate('/contact')}
      />
    </div>
  );
}
