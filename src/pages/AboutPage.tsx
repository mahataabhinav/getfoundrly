import { Target, Users, Lightbulb, Heart, TrendingUp, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/shared/PageHero';
import CTASection from '../components/shared/CTASection';
import StatsBar from '../components/shared/StatsBar';

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Founder-First',
      description: 'We build for founders, by founders. Every feature solves a real problem we\'ve experienced ourselves.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We push the boundaries of what\'s possible with AI, always staying at the cutting edge of technology.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Heart,
      title: 'Authenticity',
      description: 'Your voice matters. We enhance your message, never replace it. Real content from real people.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Results-Driven',
      description: 'We measure success by your growth. Every feature is designed to deliver measurable business impact.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const stats = [
    { value: '2023', label: 'Founded', color: 'text-blue-600' },
    { value: '50K+', label: 'Users', color: 'text-green-600' },
    { value: '120+', label: 'Countries', color: 'text-purple-600' },
    { value: '10M+', label: 'Content Created', color: 'text-orange-600' }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'Founded by frustrated founders who were tired of choosing between building their product and building their brand.'
    },
    {
      year: 'Early 2024',
      title: 'First 1,000 Users',
      description: 'Reached 1,000 active users within 4 months. The response validated that we were solving a real problem.'
    },
    {
      year: 'Mid 2024',
      title: 'AI Enhancement',
      description: 'Launched advanced AI models trained specifically on high-performing business content.'
    },
    {
      year: 'Late 2024',
      title: 'Enterprise Launch',
      description: 'Introduced team features and enterprise solutions for larger organizations.'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Now serving 50,000+ users across 120+ countries, helping founders build undeniable brands.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Turn Invisible Brands Into Undeniable Ones"
        description="We're on a mission to help every founder and business owner build a brand that can't be ignored."
      />

      <StatsBar stats={stats} variant="light" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Foundrly was born from a frustration every founder knows too well: you're building an amazing product, but nobody knows about it.
                </p>
                <p>
                  We spent years watching talented founders struggle with the same problem. They knew content marketing was important. They knew they needed to build thought leadership. But between product development, customer support, and everything else, content creation kept falling to the bottom of the priority list.
                </p>
                <p>
                  The options weren't great. Hire expensive agencies that don't understand your business. Bring on full-time marketers you can't afford. Or sacrifice product development time to write posts and articles.
                </p>
                <p>
                  So we built Foundrly. An AI co-founder that handles content creation so you can focus on what you do best. Not a tool that replaces your voice, but one that amplifies it.
                </p>
                <p className="font-semibold text-gray-900">
                  Today, we're helping thousands of founders build brands that can't be ignored.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-8 border border-gray-200">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Make world-class content marketing accessible to every founder and business owner, regardless of budget or team size.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-600 rounded-xl">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    A world where great products get the visibility they deserve, and founders can build brands without sacrificing their time or authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we build and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} bg-opacity-10 mb-4`}>
                    <Icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From an idea to a global platform helping founders worldwide
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-24">
                  <div className="absolute left-0 w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-gray-900">{milestone.year}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 text-lg">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Team
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We're always looking for talented, passionate people who want to help founders build undeniable brands. If that sounds like you, we'd love to hear from you.
          </p>
          <button
            onClick={() => navigate('/careers')}
            className="group bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <span>View Open Positions</span>
            <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>

      <CTASection
        variant="light"
        title="Ready to Build Your Undeniable Brand?"
        description="Join thousands of founders using Foundrly to create content, analyze performance, and grow their visibility."
        primaryButtonText="Start Free Trial"
        primaryButtonAction={() => navigate('/signup')}
        secondaryButtonText="Contact Us"
        secondaryButtonAction={() => navigate('/contact')}
      />
    </div>
  );
}
