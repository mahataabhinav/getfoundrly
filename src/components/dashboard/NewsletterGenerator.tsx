import { useState } from 'react';
import { X, ArrowRight, RefreshCw, Edit, Sparkles, Mail, FileText, Megaphone, Users, Newspaper, Gift, Calendar, TrendingUp } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';
import VoiceInput from '../VoiceInput';
import NewsletterEditor from './NewsletterEditor';
import NewsletterPreview from './NewsletterPreview';

interface NewsletterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterGenerator({ isOpen, onClose }: NewsletterGeneratorProps) {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({
    name: '',
    website: ''
  });
  const [selectedType, setSelectedType] = useState('');
  const [newsletterContent, setNewsletterContent] = useState({
    subject: '',
    preheader: '',
    title: '',
    intro: '',
    sections: [] as { title: string; content: string }[],
    cta: '',
    ctaUrl: ''
  });
  const [tone, setTone] = useState('Professional & Engaging');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const newsletterTypes = [
    {
      id: 'weekly-update',
      title: 'Weekly Update',
      icon: Newspaper,
      color: 'from-blue-500 to-cyan-500',
      description: 'Regular updates and highlights from your week'
    },
    {
      id: 'product-announcement',
      title: 'Product Announcement',
      icon: Megaphone,
      color: 'from-purple-500 to-pink-500',
      description: 'Launch new features or products'
    },
    {
      id: 'founders-story',
      title: "Founder's Story",
      icon: Users,
      color: 'from-orange-500 to-red-500',
      description: 'Personal insights and behind-the-scenes'
    },
    {
      id: 'digest',
      title: 'Digest / Curated Insights',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      description: 'Collection of curated content and insights'
    },
    {
      id: 'promotional',
      title: 'Promotional Offer',
      icon: Gift,
      color: 'from-yellow-500 to-orange-500',
      description: 'Special offers and exclusive deals'
    },
    {
      id: 'event-invitation',
      title: 'Event Invitation',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      description: 'Invite subscribers to upcoming events'
    }
  ];

  const toneOptions = [
    'Professional & Engaging',
    'Casual & Friendly',
    'Bold & Direct',
    'Inspirational',
    'Educational'
  ];

  const handleContinue = () => {
    if (step === 1 && brandData.name && brandData.website) {
      setStep(2);
    }
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep(3);
    setTimeout(() => {
      handleGenerateNewsletter();
    }, 500);
  };

  const handleGenerateNewsletter = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockNewsletters = {
        'weekly-update': {
          subject: `${brandData.name} Weekly Update: Big News Inside`,
          preheader: 'Your weekly dose of updates and insights',
          title: 'This Week at ' + brandData.name,
          intro: "Hello! We've had an incredible week, and we can't wait to share what we've been working on. Here's your roundup of the latest updates, insights, and wins.",
          sections: [
            {
              title: `What's New`,
              content: `We've launched three major features this week based on your feedback. Our team has been working around the clock to bring you tools that make your workflow seamless.`
            },
            {
              title: `Community Spotlight`,
              content: `This week we're celebrating Sarah, who used our platform to grow her business by 300% in just two months. Her story is inspiring and we're honored to be part of her journey.`
            },
            {
              title: `Coming Up Next Week`,
              content: `Mark your calendars! We're hosting a live webinar on advanced techniques. Plus, we have a special surprise announcement coming Friday.`
            }
          ],
          cta: 'Read More Updates',
          ctaUrl: brandData.website
        },
        'product-announcement': {
          subject: `Introducing: The Future of ${brandData.name}`,
          preheader: `You asked, we built it. Check out what's new!`,
          title: `Big News: Our Latest Launch`,
          intro: `Today marks a milestone. After months of development and feedback from users like you, we're thrilled to announce our biggest product update yet.`,
          sections: [
            {
              title: `What We Built`,
              content: `Meet the all-new Dashboard 2.0. Faster, smarter, and designed with you in mind. Every feature was crafted based on real feedback from our community.`
            },
            {
              title: `Why It Matters`,
              content: `This isn't just an update—it's a complete transformation of how you work. Save 5+ hours per week with automation, insights, and seamless integrations.`
            },
            {
              title: `How to Get Started`,
              content: `Existing users: Your account has been upgraded automatically. New users: Sign up today and experience the difference from day one.`
            }
          ],
          cta: `Try It Now`,
          ctaUrl: brandData.website
        },
        'founders-story': {
          subject: `A Personal Note from the Founder`,
          preheader: `Why we do what we do`,
          title: `From the Desk of the Founder`,
          intro: `I usually let the product speak for itself, but today I wanted to share something more personal. The story behind why we built this, and where we're headed.`,
          sections: [
            {
              title: `Where We Started`,
              content: `Three years ago, I was frustrated. Every tool felt complicated, expensive, or just not built for people like me. So I decided to build something different.`
            },
            {
              title: `What We've Learned`,
              content: `Building a company is hard. But watching you succeed with our tools? That makes every late night worth it. Your wins are our wins.`
            },
            {
              title: `What's Next`,
              content: `We're just getting started. With your support, we're planning to expand into new markets, launch innovative features, and keep putting you first.`
            }
          ],
          cta: `Join Our Journey`,
          ctaUrl: brandData.website
        },
        'digest': {
          subject: `Your Weekly Digest: Top Insights & Resources`,
          preheader: `Handpicked content just for you`,
          title: `This Week's Must-Read Insights`,
          intro: `Every week, we curate the best articles, tools, and resources to help you stay ahead. Here's what caught our attention this week.`,
          sections: [
            {
              title: `Article of the Week`,
              content: `"How to Scale Without Burning Out" - A founder's guide to sustainable growth. This piece perfectly captures the challenges of scaling while maintaining work-life balance.`
            },
            {
              title: `Tool Spotlight`,
              content: `We discovered an amazing productivity tool that integrates perfectly with our platform. Early users report 40% faster workflows.`
            },
            {
              title: `Industry Trends`,
              content: `AI is reshaping our industry. Here's what it means for you and how to stay competitive in this evolving landscape.`
            }
          ],
          cta: `Explore All Resources`,
          ctaUrl: brandData.website
        },
        'promotional': {
          subject: `🎉 Exclusive Offer: 40% Off Ends Tonight!`,
          preheader: `Limited time only - don't miss out`,
          title: `Flash Sale: Your Exclusive Discount`,
          intro: `As a valued subscriber, you get first access to our biggest sale of the year. For the next 24 hours, enjoy 40% off all premium plans.`,
          sections: [
            {
              title: `What's Included`,
              content: `Upgrade to Premium and unlock advanced analytics, priority support, unlimited team members, and exclusive integrations.`
            },
            {
              title: `Why This Offer?`,
              content: `We're celebrating our community. You've supported us from day one, and this is our way of saying thank you.`
            },
            {
              title: `How to Claim`,
              content: `Click below and use code EXCLUSIVE40 at checkout. This code expires at midnight, so don't wait!`
            }
          ],
          cta: `Claim Your Discount`,
          ctaUrl: brandData.website + '/upgrade'
        },
        'event-invitation': {
          subject: `You're Invited: Exclusive Virtual Summit`,
          preheader: `Save your spot for our biggest event yet`,
          title: `Join Us for the Growth Summit 2024`,
          intro: `We're hosting an exclusive virtual summit with industry leaders, live workshops, and networking opportunities. And you're invited.`,
          sections: [
            {
              title: `Event Details`,
              content: `Date: March 15-16, 2024 | Time: 10 AM - 4 PM EST | Location: Virtual (Zoom link provided upon registration)`
            },
            {
              title: `What to Expect`,
              content: `Hear from 12+ speakers, including CEOs, growth experts, and successful founders. Plus, interactive Q&A sessions and exclusive networking.`
            },
            {
              title: `Special Perks`,
              content: `Early registrants get free access to our premium toolkit (valued at $299) and a chance to win a 1-on-1 strategy call with our founder.`
            }
          ],
          cta: `Register Now (Free)`,
          ctaUrl: brandData.website + '/events'
        }
      };

      setNewsletterContent(mockNewsletters[selectedType as keyof typeof mockNewsletters] || mockNewsletters['weekly-update']);
      setIsGenerating(false);
    }, 3000);
  };

  if (!isOpen) return null;

  if (showEditor) {
    return (
      <NewsletterEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        newsletterContent={newsletterContent}
        onSave={(updated) => {
          setNewsletterContent(updated);
          setShowEditor(false);
        }}
        brandName={brandData.name}
      />
    );
  }

  if (showPreview) {
    return (
      <NewsletterPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        newsletterContent={newsletterContent}
        brandName={brandData.name}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Create Newsletter</h2>
              <p className="text-xs text-gray-500">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          {step === 1 && (
            <div className="p-8 space-y-6 animate-slide-in">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                  Let's create your newsletter
                </h3>
                <p className="text-gray-600">
                  Start by telling us about your brand
                </p>
              </div>

              <div className="max-w-lg mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand/Website Name
                  </label>
                  <VoiceInput
                    value={brandData.name}
                    onChange={(value) => setBrandData({ ...brandData, name: value })}
                    placeholder="e.g., Acme Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <VoiceInput
                    value={brandData.website}
                    onChange={(value) => setBrandData({ ...brandData, website: value })}
                    placeholder="https://example.com"
                  />
                </div>

                <button
                  onClick={handleContinue}
                  disabled={!brandData.name || !brandData.website}
                  className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex justify-center mt-8">
                <div className="relative">
                  <RobotChatbot size={60} animate={true} gesture="wave" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Let's craft an engaging newsletter!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 space-y-6 animate-slide-in">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                  Choose Your Newsletter Type
                </h3>
                <p className="text-gray-600">
                  Select the template that matches your message
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {newsletterTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all hover:-translate-y-1 text-left"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A] text-lg mb-2">{type.title}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8">
                <RobotChatbot size={60} animate={true} gesture="thinking" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 space-y-6 animate-slide-in">
              {isGenerating ? (
                <div className="text-center space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                      Generating Your Newsletter
                    </h3>
                    <p className="text-gray-600">
                      Crafting engaging content for your subscribers
                    </p>
                  </div>

                  <div className="flex justify-center mt-8">
                    <div className="relative">
                      <RobotChatbot size={80} animate={true} gesture="thinking" />
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                        <p className="text-xs text-gray-700">Analyzing your brand and crafting the perfect newsletter...</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-gray-600">This will take just a moment...</span>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative">
                        <RobotChatbot size={40} animate={true} gesture="celebrate" />
                        <div className="absolute -top-12 left-12 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                          <p className="text-xs text-gray-700">Your newsletter is ready!</p>
                        </div>
                      </div>
                      <button
                        onClick={handleGenerateNewsletter}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 max-h-[600px] overflow-y-auto">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Subject Line</p>
                          <p className="font-bold text-lg text-[#1A1A1A]">{newsletterContent.subject}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Preheader</p>
                          <p className="text-sm text-gray-600">{newsletterContent.preheader}</p>
                        </div>
                        <hr className="border-gray-200" />
                        <div>
                          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">{newsletterContent.title}</h3>
                          <p className="text-gray-700 leading-relaxed mb-4">{newsletterContent.intro}</p>
                        </div>
                        {newsletterContent.sections.map((section, idx) => (
                          <div key={idx} className="mb-4">
                            <h4 className="font-semibold text-[#1A1A1A] mb-2">{section.title}</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">{section.content}</p>
                          </div>
                        ))}
                        <div className="mt-6 text-center">
                          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                            {newsletterContent.cta}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-semibold text-[#1A1A1A] mb-4">Customize Tone</h4>
                      <div className="space-y-2">
                        {toneOptions.map((toneOption) => (
                          <button
                            key={toneOption}
                            onClick={() => setTone(toneOption)}
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              tone === toneOption
                                ? 'bg-[#1A1A1A] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {toneOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-semibold text-[#1A1A1A] mb-3">Optional Refinements</h4>
                      <VoiceInput
                        value={customPrompt}
                        onChange={(value) => setCustomPrompt(value)}
                        placeholder="e.g., Add more statistics, Make it shorter..."
                        multiline
                        rows={4}
                      />
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A] mb-1">Suggested Assets</p>
                          <p className="text-xs text-gray-600">Header image, product shots, CTA banners</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isGenerating && (
                <div className="flex gap-3 max-w-2xl mx-auto pt-4">
                  <button
                    onClick={() => setShowEditor(true)}
                    className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit in Editor
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Preview Email
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
