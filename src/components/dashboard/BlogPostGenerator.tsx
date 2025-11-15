import { useState } from 'react';
import { X, ArrowRight, RefreshCw, Edit, Sparkles, Newspaper, FileText, List, HelpCircle, GitCompare, BookOpen, Lightbulb, TrendingUp, Target } from 'lucide-react';
import Foundi from '../Foundii';
import VoiceInput from '../VoiceInput';
import BlogPostEditor from './BlogPostEditor';
import BlogPostPreview from './BlogPostPreview';

interface BlogPostGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BlogPostGenerator({ isOpen, onClose }: BlogPostGeneratorProps) {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({
    name: '',
    website: '',
    keywords: ''
  });
  const [selectedType, setSelectedType] = useState('');
  const [blogContent, setBlogContent] = useState({
    metaTitle: '',
    metaDescription: '',
    title: '',
    readingTime: '',
    heroImage: '',
    sections: [] as { heading: string; level: string; content: string }[],
    callout: '',
    quote: '',
    cta: '',
    ctaUrl: '',
    internalLinks: [] as { text: string; url: string }[]
  });
  const [tone, setTone] = useState('Professional & Informative');
  const [competitorUrls, setCompetitorUrls] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seoScore, setSeoScore] = useState(0);

  const blogTypes = [
    {
      id: 'seo-longform',
      title: 'SEO Long-Form Pillar Article',
      icon: Newspaper,
      color: 'from-blue-500 to-cyan-500',
      description: 'Comprehensive 2000+ word articles that rank'
    },
    {
      id: 'listicle',
      title: 'Listicle',
      icon: List,
      color: 'from-purple-500 to-pink-500',
      description: 'Numbered lists that drive engagement'
    },
    {
      id: 'how-to',
      title: 'How-to Guide',
      icon: HelpCircle,
      color: 'from-green-500 to-emerald-500',
      description: 'Step-by-step instructional content'
    },
    {
      id: 'case-study',
      title: 'Case Study',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      description: 'Real results and customer success stories'
    },
    {
      id: 'product-comparison',
      title: 'Product Comparison',
      icon: GitCompare,
      color: 'from-indigo-500 to-purple-500',
      description: 'Detailed feature and pricing comparisons'
    },
    {
      id: 'beginners-guide',
      title: `Beginner's Guide`,
      icon: BookOpen,
      color: 'from-yellow-500 to-orange-500',
      description: 'Introduction to complex topics'
    },
    {
      id: 'thought-leadership',
      title: 'Thought Leadership',
      icon: Lightbulb,
      color: 'from-pink-500 to-rose-500',
      description: 'Opinion pieces and industry insights'
    }
  ];

  const toneOptions = [
    'Professional & Informative',
    'Conversational & Friendly',
    'Technical & Detailed',
    'Inspirational & Motivational',
    'Educational & Simple'
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
      handleGenerateBlog();
    }, 500);
  };

  const handleGenerateBlog = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockBlogs = {
        'seo-longform': {
          metaTitle: `Complete Guide to ${brandData.keywords || 'Digital Growth'} in 2024 | ${brandData.name}`,
          metaDescription: `Everything you need to know about ${brandData.keywords || 'digital growth'} in 2024. Expert insights, strategies, and actionable tips from ${brandData.name}.`,
          title: `The Complete Guide to ${brandData.keywords || 'Digital Growth'} in 2024`,
          readingTime: '12 min read',
          heroImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
          sections: [
            {
              heading: `What is ${brandData.keywords || 'Digital Growth'}?`,
              level: 'H2',
              content: `${brandData.keywords || 'Digital growth'} has become a critical factor for businesses looking to scale in today's competitive landscape. It encompasses strategies, tools, and methodologies that drive measurable results across digital channels. In this comprehensive guide, we'll explore everything you need to know to succeed in 2024 and beyond.`
            },
            {
              heading: 'Why It Matters in 2024',
              level: 'H2',
              content: `The digital landscape is evolving faster than ever. With AI-powered tools, changing consumer behavior, and new platforms emerging constantly, businesses must adapt or risk falling behind. Recent studies show that companies investing in digital transformation see 3x higher revenue growth compared to their competitors. The question isn't whether to invest in digital growth—it's how to do it effectively.`
            },
            {
              heading: 'Key Strategies for Success',
              level: 'H2',
              content: `Success in digital growth requires a multi-faceted approach. First, understand your audience deeply through data analytics and customer feedback. Second, create content that genuinely solves problems rather than just promoting products. Third, leverage automation tools to scale your efforts without sacrificing quality. Finally, measure everything and iterate based on real results.`
            },
            {
              heading: 'Getting Started: First Steps',
              level: 'H3',
              content: `Begin by auditing your current digital presence. What's working? What's not? Use tools like Google Analytics and social media insights to understand your baseline. Then, set specific, measurable goals. Don't try to do everything at once—focus on 2-3 high-impact areas where you can make real progress in the next 90 days.`
            },
            {
              heading: 'Advanced Techniques',
              level: 'H3',
              content: `Once you've mastered the basics, it's time to level up. Implement A/B testing across all channels to optimize conversion rates. Use predictive analytics to anticipate customer needs. Create personalized experiences at scale with marketing automation. And don't forget the power of community building—engaged communities drive long-term sustainable growth.`
            },
            {
              heading: 'Common Mistakes to Avoid',
              level: 'H2',
              content: `Even experienced marketers make mistakes. The biggest? Focusing on vanity metrics instead of business outcomes. Likes and followers mean nothing if they don't translate to revenue. Other common pitfalls include neglecting mobile optimization, ignoring page speed, and failing to have a clear content strategy. Learn from others' mistakes and avoid these traps from day one.`
            }
          ],
          callout: `Pro Tip: Start with one channel and master it before expanding. Depth beats breadth every time when building sustainable growth.`,
          quote: `The best time to start was yesterday. The second best time is now. Digital growth compounds over time—every day you wait is potential growth lost.`,
          cta: `Ready to accelerate your growth?`,
          ctaUrl: brandData.website,
          internalLinks: [
            { text: 'Our Platform', url: `${brandData.website}/platform` },
            { text: 'Pricing', url: `${brandData.website}/pricing` },
            { text: 'Case Studies', url: `${brandData.website}/case-studies` }
          ]
        },
        'listicle': {
          metaTitle: `10 ${brandData.keywords || 'Marketing'} Strategies That Actually Work in 2024`,
          metaDescription: `Discover the top 10 ${brandData.keywords || 'marketing'} strategies proven to drive results. Real examples, actionable tips, and expert insights.`,
          title: `10 ${brandData.keywords || 'Marketing'} Strategies That Actually Work in 2024`,
          readingTime: '8 min read',
          heroImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
          sections: [
            {
              heading: 'Introduction',
              level: 'H2',
              content: `Tired of marketing tactics that sound good but deliver zero results? We've tested hundreds of strategies and narrowed it down to the 10 that consistently deliver measurable ROI. These aren't theoretical—they're battle-tested methods used by successful companies today.`
            },
            {
              heading: '1. Content That Solves Real Problems',
              level: 'H2',
              content: `Stop creating content for content's sake. Instead, identify the top 10 questions your customers ask and create in-depth resources addressing each one. This approach has helped companies increase organic traffic by 300% in just 6 months. The key is depth over breadth—one comprehensive guide beats ten shallow blog posts.`
            },
            {
              heading: '2. Strategic Partnerships',
              level: 'H2',
              content: `Partner with complementary brands to reach new audiences. A software company partnered with an education platform and gained 5,000 qualified leads in one quarter. Look for win-win collaborations where both audiences benefit from the partnership.`
            },
            {
              heading: '3. Video Content at Scale',
              level: 'H2',
              content: `Video drives 3x more engagement than static content. But quality over quantity—one well-produced weekly video beats seven rushed ones. Focus on solving specific problems in 2-5 minute videos. Repurpose across platforms for maximum reach.`
            },
            {
              heading: '4. Email Segmentation',
              level: 'H2',
              content: `Generic emails get ignored. Segment your list by behavior, interests, and stage in the buyer journey. Personalized emails generate 6x higher transaction rates. Use automation to scale personalization without burning out your team.`
            },
            {
              heading: '5. Community Building',
              level: 'H2',
              content: `Build a community around your brand, not just around your product. Host events, create private forums, facilitate connections between members. Strong communities have 10x higher customer lifetime value and become your best marketing channel.`
            }
          ],
          callout: `Quick Win: Implement just one of these strategies this week. Pick the one that aligns best with your current strengths and resources.`,
          quote: `Marketing isn't about doing everything—it's about doing the right things consistently. Focus beats frenzy.`,
          cta: `Want to implement these strategies?`,
          ctaUrl: brandData.website,
          internalLinks: [
            { text: 'Get Started', url: `${brandData.website}/get-started` },
            { text: 'Resources', url: `${brandData.website}/resources` }
          ]
        },
        'how-to': {
          metaTitle: `How to ${brandData.keywords || 'Launch Your Product'}: Step-by-Step Guide`,
          metaDescription: `Learn how to ${brandData.keywords || 'launch your product'} successfully with this detailed step-by-step guide. Includes templates, examples, and expert tips.`,
          title: `How to ${brandData.keywords || 'Launch Your Product'} Successfully: A Complete Guide`,
          readingTime: '10 min read',
          heroImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
          sections: [
            {
              heading: 'Introduction',
              level: 'H2',
              content: `Launching a product can feel overwhelming. But with the right process, you can execute a successful launch that generates buzz, attracts customers, and drives revenue from day one. This guide breaks down the exact steps we've used to launch products that have generated millions in revenue.`
            },
            {
              heading: 'Step 1: Define Your Target Audience',
              level: 'H2',
              content: `Before anything else, get crystal clear on who you're building for. Create detailed buyer personas including demographics, pain points, goals, and preferred channels. Interview 10-20 potential customers to validate your assumptions. This foundation makes every subsequent step easier and more effective.`
            },
            {
              heading: 'Step 2: Build Pre-Launch Momentum',
              level: 'H2',
              content: `Start building anticipation 6-8 weeks before launch. Create a waitlist landing page, share behind-the-scenes content, run early access programs for select users. The goal is to have an engaged audience ready to buy on day one. Successful pre-launches convert 15-25% of waitlist subscribers.`
            },
            {
              heading: 'Step 3: Create Your Launch Content',
              level: 'H2',
              content: `Develop a content calendar covering announcement posts, educational content, customer testimonials, and how-to guides. Prepare assets for email, social media, blog, and partner channels. Create templates to maintain consistency across platforms. Quality content is your force multiplier during launch week.`
            },
            {
              heading: 'Step 4: Execute Launch Week',
              level: 'H2',
              content: `Launch day is just the beginning. Run a full week of coordinated activities: day 1 announcement, day 2 deep dive demo, day 3 customer stories, day 4 Q&A session, day 5 special offer. This sustained momentum keeps your launch trending and gives people multiple touchpoints to convert.`
            },
            {
              heading: 'Step 5: Analyze and Iterate',
              level: 'H2',
              content: `Track metrics daily during launch week: signups, conversions, traffic sources, social mentions. Set up dashboards for real-time monitoring. Gather qualitative feedback through surveys and support tickets. Use these insights to refine messaging and identify opportunities for improvement.`
            }
          ],
          callout: `Remember: A successful launch isn't about doing everything perfectly—it's about learning fast and adapting in real-time.`,
          quote: `Perfect is the enemy of launched. Ship, learn, iterate. Your first version just needs to be good enough to generate feedback.`,
          cta: `Ready to launch your product?`,
          ctaUrl: brandData.website,
          internalLinks: [
            { text: 'Launch Checklist', url: `${brandData.website}/resources/launch-checklist` },
            { text: 'Book a Demo', url: `${brandData.website}/demo` }
          ]
        },
        'case-study': {
          metaTitle: `How ${brandData.name} Helped [Client] Achieve 300% Growth`,
          metaDescription: `Real results: See how we helped a company achieve 300% growth in 6 months. Detailed case study with strategies, metrics, and lessons learned.`,
          title: `Case Study: How We Helped a SaaS Company Achieve 300% Growth in 6 Months`,
          readingTime: '7 min read',
          heroImage: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
          sections: [
            {
              heading: 'The Challenge',
              level: 'H2',
              content: `Our client, a B2B SaaS company, was struggling despite having a great product. They had grown to $50K MRR but hit a plateau. Their marketing was scattered, their messaging was unclear, and they were burning through cash on ads that didn't convert. They needed a complete strategic overhaul—fast.`
            },
            {
              heading: 'The Approach',
              level: 'H2',
              content: `We started with a comprehensive audit of their entire funnel. The problems were clear: wrong target audience, generic messaging, and no clear differentiation. We rebuilt their positioning from the ground up, identified their ideal customer profile through extensive research, and created a focused content strategy targeting high-intent keywords.`
            },
            {
              heading: 'Strategy 1: Repositioning',
              level: 'H3',
              content: `We narrowed their focus from "project management for everyone" to "project management for remote creative teams." This specific positioning immediately resonated with their best customers and improved conversion rates by 40%. Sometimes less is more—trying to appeal to everyone means appealing to no one.`
            },
            {
              heading: 'Strategy 2: Content-Led Growth',
              level: 'H3',
              content: `We created 12 comprehensive guides addressing the exact problems their target customers searched for. Within 3 months, organic traffic increased 5x. More importantly, these leads converted at 3x the rate of paid traffic because they found us while actively seeking solutions.`
            },
            {
              heading: 'The Results',
              level: 'H2',
              content: `In 6 months: MRR grew from $50K to $150K (300% growth). Customer acquisition cost dropped by 60%. Organic traffic increased 5x. Trial-to-paid conversion improved from 8% to 22%. They went from struggling to survive to having multiple acquisition offers. The best part? Growth was sustainable and compound—they've continued growing at 25% quarter over quarter.`
            },
            {
              heading: 'Key Takeaways',
              level: 'H2',
              content: `Three lessons from this transformation: 1) Positioning matters more than product features. 2) Organic growth takes time but delivers compounding returns. 3) Quality over quantity—12 great articles beat 100 mediocre ones. The fundamentals always win.`
            }
          ],
          callout: `Your Results May Vary: Every business is different, but the principles remain the same. Clear positioning + focused execution = sustainable growth.`,
          quote: `Strategy without execution is just dreaming. Execution without strategy is just busy work. You need both.`,
          cta: `Want similar results?`,
          ctaUrl: brandData.website,
          internalLinks: [
            { text: 'More Case Studies', url: `${brandData.website}/case-studies` },
            { text: 'Work With Us', url: `${brandData.website}/contact` }
          ]
        },
        'product-comparison': {
          metaTitle: `${brandData.name} vs Competitors: Honest Comparison for 2024`,
          metaDescription: `Unbiased comparison of ${brandData.name} vs top alternatives. Features, pricing, pros, cons, and which option is best for your use case.`,
          title: `${brandData.name} vs Competitors: An Honest Comparison`,
          readingTime: '9 min read',
          heroImage: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
          sections: [
            {
              heading: 'Why This Comparison Exists',
              level: 'H2',
              content: `You're researching solutions and want the truth—not marketing fluff. This comparison honestly evaluates ${brandData.name} against major competitors. We'll cover features, pricing, ideal use cases, and help you make the right decision for your specific needs. Transparency builds trust, and we'd rather you choose the right tool than just our tool.`
            },
            {
              heading: 'Feature Comparison',
              level: 'H2',
              content: `Let's break down the key features. ${brandData.name} excels at ease of use and customer support—our NPS is 72 vs industry average of 31. However, Competitor A offers more advanced reporting if you have a data team. Competitor B is cheaper but requires significant setup time. The right choice depends on your priorities: speed to value, customization, or budget.`
            },
            {
              heading: 'Pricing Analysis',
              level: 'H2',
              content: `${brandData.name} starts at $99/month for teams up to 10. Competitor A starts at $79/month but charges per user after 5 (most teams end up paying more). Competitor B is free initially but limits features heavily—most companies upgrade within 2 months. Consider total cost of ownership, not just sticker price. Factor in implementation time, training, and support costs.`
            },
            {
              heading: 'Who Should Choose ${brandData.name}',
              level: 'H2',
              content: `You're the ideal fit if you: value speed to value over endless customization, need exceptional customer support, want a tool that grows with you, prefer simplicity over complexity. We're built for teams that want to focus on their work, not managing their tools.`
            },
            {
              heading: 'Who Should Choose Alternatives',
              level: 'H2',
              content: `Be honest: if you need deep customization and have a technical team, Competitor A might be better. If budget is your only concern and you have time for setup, Competitor B works. If you're in a highly regulated industry with specific compliance needs, Competitor C specializes in that. We want happy customers, not just any customers.`
            },
            {
              heading: 'Making Your Decision',
              level: 'H2',
              content: `Try before you buy. Most companies offer free trials—test your actual use case, not just demo scenarios. Talk to current users (not just those in testimonials). Calculate ROI based on time saved, not features gained. The best tool is the one your team will actually use consistently.`
            }
          ],
          callout: `Pro Tip: The best software isn't the one with the most features—it's the one that solves your specific problems efficiently.`,
          quote: `Choose tools based on problems you have today, not features you might need someday. Feature bloat kills productivity.`,
          cta: `Try ${brandData.name} free for 14 days`,
          ctaUrl: `${brandData.website}/trial`,
          internalLinks: [
            { text: 'Pricing Details', url: `${brandData.website}/pricing` },
            { text: 'Start Free Trial', url: `${brandData.website}/trial` }
          ]
        },
        'beginners-guide': {
          metaTitle: `Beginner's Guide to ${brandData.keywords || 'Content Marketing'}: Start Here`,
          metaDescription: `New to ${brandData.keywords || 'content marketing'}? This beginner-friendly guide covers everything you need to know to get started and see results.`,
          title: `The Complete Beginner's Guide to ${brandData.keywords || 'Content Marketing'}`,
          readingTime: '11 min read',
          heroImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
          sections: [
            {
              heading: `What is ${brandData.keywords || 'Content Marketing'}?`,
              level: 'H2',
              content: `If you're new here, let's start with the basics. ${brandData.keywords || 'Content marketing'} is the practice of creating valuable content that attracts and engages your target audience. Instead of interrupting people with ads, you earn their attention by solving their problems. It's not about selling—it's about helping. And when you help people consistently, business naturally follows.`
            },
            {
              heading: 'Why It Works',
              level: 'H2',
              content: `People hate being sold to, but they love discovering helpful resources. When you create genuinely useful content, you build trust. Trust leads to brand preference. Brand preference leads to customers. Plus, great content compounds over time—a single article can drive traffic for years. It's the gift that keeps giving.`
            },
            {
              heading: 'Getting Started: The Basics',
              level: 'H2',
              content: `Don't overthink this. Start by answering the questions your customers ask every day. Write down the top 10 questions you hear in sales calls or support tickets. Each question becomes a piece of content. Use simple language—write like you talk. Focus on being helpful, not clever. That's 80% of success right there.`
            },
            {
              heading: `Essential Tools You'll Need`,
              level: 'H3',
              content: `You don't need fancy tools starting out. A Google Doc for writing, Canva for graphics, your phone for videos. That's enough to launch. As you grow, consider tools for SEO research, email marketing, and analytics. But don't let tool paralysis stop you from starting. Tools amplify good strategy—they don't replace it.`
            },
            {
              heading: 'Creating Your First Content',
              level: 'H3',
              content: `Pick your easiest win first. If you're comfortable writing, start with blog posts. Prefer talking? Try video or podcasts. Natural at design? Start with infographics. Use your strengths. Your first piece won't be perfect—that's fine. You learn by doing. Publish, get feedback, improve. Rinse and repeat.`
            },
            {
              heading: 'Common Beginner Mistakes',
              level: 'H2',
              content: `Biggest mistakes: trying to do everything at once, caring more about perfection than publishing, copying competitors instead of being authentic, forgetting to promote content after creating it, giving up after one month. Avoid these traps and you're already ahead of 90% of beginners.`
            },
            {
              heading: 'Next Steps',
              level: 'H2',
              content: `After reading this, take action today. Write an outline for your first piece of content. Schedule 30 minutes tomorrow to write. Launch within a week. Speed beats perfection when starting out. You'll learn more from publishing 10 imperfect pieces than from planning one perfect piece forever.`
            }
          ],
          callout: `Remember: Every expert was once a beginner. The only difference is they started. Don't let perfect be the enemy of good enough.`,
          quote: `The best way to learn is by doing. Stop researching, start creating. You'll figure it out along the way.`,
          cta: `Ready to start creating?`,
          ctaUrl: brandData.website,
          internalLinks: [
            { text: 'Content Templates', url: `${brandData.website}/templates` },
            { text: 'Join Our Community', url: `${brandData.website}/community` }
          ]
        },
        'thought-leadership': {
          metaTitle: `Why Most ${brandData.keywords || 'Marketing Strategies'} Fail (And What to Do Instead)`,
          metaDescription: `An honest take on why traditional ${brandData.keywords || 'marketing approaches'} are broken and what forward-thinking companies are doing differently.`,
          title: `Why Most ${brandData.keywords || 'Marketing Strategies'} Fail (And What to Do Instead)`,
          readingTime: '8 min read',
          heroImage: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
          sections: [
            {
              heading: 'The Uncomfortable Truth',
              level: 'H2',
              content: `Let's be honest: most marketing strategies fail. Not because of poor execution, but because they're built on flawed assumptions. We copy what worked for others five years ago and wonder why we get different results. The game has changed, but most playbooks haven't. It's time for a reality check.`
            },
            {
              heading: 'Why the Old Playbook is Broken',
              level: 'H2',
              content: `The traditional funnel is dead. Customers don't move linearly from awareness to purchase anymore. They research backwards, sideways, and in circles. They trust peers over brands. They block ads and skip commercials. Yet we still optimize for impressions and clicks like it's 2010. Insanity is doing the same thing and expecting different results.`
            },
            {
              heading: 'The New Reality',
              level: 'H2',
              content: `Here's what actually works now: building in public, being radically transparent, creating genuine value before asking for anything in return, building community not just audience, focusing on lifetime value over acquisition cost. These aren't tactics—they're philosophy shifts. They require patience, authenticity, and the courage to be different.`
            },
            {
              heading: 'What Forward-Thinking Companies Do Differently',
              level: 'H2',
              content: `The winners today share their learnings openly. They admit mistakes publicly. They give away their best ideas for free. Sounds crazy? It works because generosity compounds. When you help people without asking for anything, they remember. They tell others. They become advocates. Traditional marketing pushes. Modern marketing pulls.`
            },
            {
              heading: 'The Compound Effect',
              level: 'H2',
              content: `This approach doesn't work overnight. That's why most companies won't do it—they want quick wins. But quick wins don't compound. Sustainable growth takes time. Six months of consistent value creation beats six years of sporadic campaigns. Play long-term games with long-term people. That's where real wealth is built.`
            },
            {
              heading: 'Taking Action',
              level: 'H2',
              content: `Stop optimizing for vanity metrics. Stop interrupting people. Stop copying competitors. Start building genuine relationships. Start sharing openly. Start playing infinite games. The companies that win the next decade won't be the ones with the biggest ad budgets—they'll be the ones with the strongest communities and the most trust.`
            }
          ],
          callout: `Unpopular Opinion: Your marketing problem isn't a tactics problem—it's a strategy problem. No amount of A/B testing will fix a fundamentally flawed approach.`,
          quote: `Trust is the ultimate moat. You can't buy it, fake it, or hack it. You can only earn it—one interaction at a time.`,
          cta: `Ready to think differently?`,
          ctaUrl: brandData.website,
          internalLinks: [
            { text: 'Our Approach', url: `${brandData.website}/approach` },
            { text: 'Read More Insights', url: `${brandData.website}/blog` }
          ]
        }
      };

      setBlogContent(mockBlogs[selectedType as keyof typeof mockBlogs] || mockBlogs['seo-longform']);
      setSeoScore(Math.floor(Math.random() * 15) + 85);
      setIsGenerating(false);
    }, 3500);
  };

  if (!isOpen) return null;

  if (showEditor) {
    return (
      <BlogPostEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        blogContent={blogContent}
        onSave={(updated) => {
          setBlogContent(updated);
          setShowEditor(false);
        }}
        brandName={brandData.name}
      />
    );
  }

  if (showPreview) {
    return (
      <BlogPostPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        blogContent={blogContent}
        brandName={brandData.name}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Create SEO Blog Post</h2>
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
                  Let's create an SEO-optimized blog post
                </h3>
                <p className="text-gray-600">
                  Start by telling us about your brand and target keywords
                </p>
              </div>

              <div className="max-w-lg mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website Name
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Keywords <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <VoiceInput
                    value={brandData.keywords}
                    onChange={(value) => setBrandData({ ...brandData, keywords: value })}
                    placeholder="e.g., content marketing, SEO growth"
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
                  <Foundi size={60} animate={true} gesture="wave" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Let's craft content that ranks!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 space-y-6 animate-slide-in">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                  Choose Your Blog Post Type
                </h3>
                <p className="text-gray-600">
                  Select the format that best matches your goals
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {blogTypes.map((type) => {
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
                <Foundi size={60} animate={true} gesture="thinking" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 space-y-6 animate-slide-in">
              {isGenerating ? (
                <div className="text-center space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                      Generating Your SEO-Optimized Blog Post
                    </h3>
                    <p className="text-gray-600">
                      Creating comprehensive content with proper structure and keywords
                    </p>
                  </div>

                  <div className="flex justify-center mt-8">
                    <div className="relative">
                      <Foundi size={80} animate={true} gesture="thinking" />
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                        <p className="text-xs text-gray-700">Analyzing keywords, researching topics, and crafting SEO-optimized content...</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-green-600" />
                    <span className="text-gray-600">This will take just a moment...</span>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative">
                        <Foundi size={40} animate={true} gesture="celebrate" />
                        <div className="absolute -top-12 left-12 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                          <p className="text-xs text-gray-700">Your article is ready!</p>
                        </div>
                      </div>
                      <button
                        onClick={handleGenerateBlog}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 max-h-[600px] overflow-y-auto">
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 mb-1 font-medium">Meta Title</p>
                          <p className="text-sm text-[#1A1A1A]">{blogContent.metaTitle}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 mb-1 font-medium">Meta Description</p>
                          <p className="text-xs text-gray-600">{blogContent.metaDescription}</p>
                        </div>
                        <hr className="border-gray-200" />
                        <div>
                          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">{blogContent.title}</h1>
                          <p className="text-xs text-gray-500">{blogContent.readingTime}</p>
                        </div>
                        {blogContent.sections.map((section, idx) => (
                          <div key={idx} className="mb-4">
                            <h3 className={`font-semibold text-[#1A1A1A] mb-2 ${section.level === 'H2' ? 'text-xl' : 'text-lg'}`}>
                              {section.heading}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{section.content}</p>
                          </div>
                        ))}
                        {blogContent.callout && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-sm text-gray-800 font-medium">{blogContent.callout}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-[#1A1A1A]">SEO Health Score</h4>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-green-600">{seoScore}</div>
                          <Target className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${seoScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Excellent optimization!</p>
                    </div>

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
                      <h4 className="font-semibold text-[#1A1A1A] mb-3">Target Keywords</h4>
                      <VoiceInput
                        value={brandData.keywords}
                        onChange={(value) => setBrandData({ ...brandData, keywords: value })}
                        placeholder="e.g., SEO, content marketing..."
                      />
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-semibold text-[#1A1A1A] mb-3">Competitor URLs <span className="text-xs text-gray-400">(Optional)</span></h4>
                      <VoiceInput
                        value={competitorUrls}
                        onChange={(value) => setCompetitorUrls(value)}
                        placeholder="Paste competitor article URLs..."
                        multiline
                        rows={3}
                      />
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-semibold text-[#1A1A1A] mb-3">Optional Refinements</h4>
                      <VoiceInput
                        value={customPrompt}
                        onChange={(value) => setCustomPrompt(value)}
                        placeholder="e.g., Add more examples, Include statistics..."
                        multiline
                        rows={4}
                      />
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A] mb-1">Suggested Assets</p>
                          <p className="text-xs text-gray-600">Hero image, inline graphics, data visualizations</p>
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
                    Preview Article
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
