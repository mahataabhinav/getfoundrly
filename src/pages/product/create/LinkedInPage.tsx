import { Linkedin, CheckCircle, Zap, MessageSquare, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../../../components/shared/PageHero';
import FeatureGrid from '../../../components/shared/FeatureGrid';
import CTASection from '../../../components/shared/CTASection';

export default function LinkedInPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: 'Instant Generation', description: 'Create professional LinkedIn posts in seconds, not hours.', color: 'from-blue-500 to-blue-600' },
    { icon: MessageSquare, title: 'Your Voice', description: 'AI learns your tone and style for authentic, on-brand posts.', color: 'from-purple-500 to-purple-600' },
    { icon: TrendingUp, title: 'Engagement Optimized', description: 'Posts crafted using proven engagement patterns and best practices.', color: 'from-green-500 to-green-600' },
    { icon: CheckCircle, title: 'Ready to Publish', description: 'Get perfectly formatted posts ready for immediate publishing.', color: 'from-orange-500 to-orange-600' }
  ];

  const benefits = [
    'Generate thought leadership posts that position you as an industry expert',
    'Create engaging stories that resonate with your target audience',
    'Write compelling company updates that drive engagement',
    'Craft educational content that provides real value',
    'Design promotional posts that convert without being salesy',
    'Schedule posts for optimal visibility and reach'
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        subtitle="Create > LinkedIn"
        title="Professional LinkedIn Posts in Seconds"
        description="Build your professional brand with AI-generated LinkedIn content that sounds authentically you."
      >
        <button
          onClick={() => navigate('/signup')}
          className="group bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <Linkedin className="w-5 h-5" />
          <span>Start Creating Posts</span>
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </button>
      </PageHero>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Everything You Need for LinkedIn Success
          </h2>
          <FeatureGrid features={features} columns={4} />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Build Thought Leadership Without the Time Investment
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Great LinkedIn content takes time, expertise, and consistency. Foundrly handles the heavy lifting so you can focus on running your business while building your professional brand.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-900">Your Name</div>
                    <div className="text-sm text-gray-500">Founder & CEO</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Just launched our new AI-powered content platform and the response has been incredible.
                  <br /><br />
                  Here's what we learned about building products that founders actually want to use... 🧵
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>💬 45 comments</span>
                  <span>🔄 23 reposts</span>
                  <span>❤️ 312 likes</span>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                Example of AI-generated LinkedIn post
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variant="gradient"
        title="Start Building Your LinkedIn Presence Today"
        description="Join thousands of professionals creating engaging LinkedIn content with Foundrly."
        primaryButtonText="Try Foundrly Free"
        primaryButtonAction={() => navigate('/signup')}
        secondaryButtonText="View All Features"
        secondaryButtonAction={() => navigate('/product')}
      />
    </div>
  );
}
