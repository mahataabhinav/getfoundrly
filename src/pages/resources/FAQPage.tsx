import { useState } from 'react';
import { Search, HelpCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../../components/shared/PageHero';
import AccordionFAQ from '../../components/shared/AccordionFAQ';

export default function FAQPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Getting Started',
    'Billing & Plans',
    'Features',
    'Content Creation',
    'Analytics',
    'Integrations',
    'Account & Security'
  ];

  const allFaqs = [
    {
      category: 'Getting Started',
      question: 'How do I get started with Foundrly?',
      answer: 'Getting started is simple! Sign up for a free trial, connect your social accounts, and input your website URL. Foundrly will analyze your brand and start generating content immediately. You can create your first post in under 5 minutes.'
    },
    {
      category: 'Getting Started',
      question: 'Do I need technical skills to use Foundrly?',
      answer: 'Not at all! Foundrly is designed for non-technical users. If you can use social media, you can use Foundrly. Our interface is intuitive and we provide guided tutorials for every feature.'
    },
    {
      category: 'Getting Started',
      question: 'What information does Foundrly need from me?',
      answer: 'Just your website URL or brand guidelines. Foundrly analyzes your existing content, understands your voice, and creates new content that matches your style. You can also customize your brand voice in the settings.'
    },
    {
      category: 'Billing & Plans',
      question: 'Can I try Foundrly before committing to a plan?',
      answer: 'Yes! We offer a 14-day free trial on all plans. No credit card required. You can explore all features and create real content during your trial period.'
    },
    {
      category: 'Billing & Plans',
      question: 'What happens when I reach my content limit?',
      answer: 'You\'ll receive a notification when you\'re close to your limit. You can either upgrade to a higher plan or wait until your limit resets at the start of your next billing cycle. We never interrupt your workflow unexpectedly.'
    },
    {
      category: 'Billing & Plans',
      question: 'Can I change plans later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.'
    },
    {
      category: 'Billing & Plans',
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all annual plans. If you\'re not satisfied within the first 30 days, we\'ll refund your payment in full, no questions asked.'
    },
    {
      category: 'Features',
      question: 'What types of content can Foundrly create?',
      answer: 'Foundrly creates LinkedIn posts, Instagram ads (with images and video scripts), email newsletters, SEO blog posts, social media captions, website copy, and multi-platform ad campaigns. More content types are added regularly.'
    },
    {
      category: 'Features',
      question: 'Can I edit the AI-generated content?',
      answer: 'Yes! Every piece of content can be edited before publishing. Foundrly provides a starting point, and you have full control to refine and customize the output to perfectly match your needs.'
    },
    {
      category: 'Features',
      question: 'Does Foundrly schedule posts automatically?',
      answer: 'Yes! Our content calendar lets you schedule posts across all platforms. You can set custom posting schedules or use our AI-recommended times for maximum engagement.'
    },
    {
      category: 'Content Creation',
      question: 'How does Foundrly learn my brand voice?',
      answer: 'Foundrly analyzes your website, existing content, and any brand guidelines you provide. The AI learns your tone, style, and messaging preferences. The more you use it and provide feedback, the better it becomes at matching your voice.'
    },
    {
      category: 'Content Creation',
      question: 'Can I create content in multiple brand voices?',
      answer: 'Yes! Professional and Enterprise plans support multiple brand voice profiles. This is perfect if you manage multiple brands or need different tones for different audiences.'
    },
    {
      category: 'Content Creation',
      question: 'How long does it take to generate content?',
      answer: 'Most content is generated in seconds. A LinkedIn post takes 5-10 seconds, while longer content like blog posts might take 30-60 seconds. You can generate multiple pieces simultaneously.'
    },
    {
      category: 'Analytics',
      question: 'What analytics does Foundrly provide?',
      answer: 'Foundrly tracks engagement metrics, keyword performance, audience insights, competitive analysis, and content performance across all platforms. You get real-time dashboards and weekly summary reports.'
    },
    {
      category: 'Analytics',
      question: 'Can I track competitors?',
      answer: 'Yes! Our competitive analysis feature (available on Professional and Enterprise plans) lets you track competitor visibility, content strategy, and performance metrics to stay ahead in your industry.'
    },
    {
      category: 'Analytics',
      question: 'How often is analytics data updated?',
      answer: 'Analytics data is updated in real-time. You can see engagement metrics, keyword rankings, and performance trends as they happen. Historical data is available for trend analysis.'
    },
    {
      category: 'Integrations',
      question: 'What platforms does Foundrly integrate with?',
      answer: 'Foundrly currently integrates with LinkedIn, Instagram, major email marketing platforms, and popular CMS systems for blog publishing. We\'re constantly adding new integrations based on user feedback.'
    },
    {
      category: 'Integrations',
      question: 'Do I need to connect my social accounts?',
      answer: 'Connecting your accounts is optional but recommended. It enables direct posting, scheduling, and analytics tracking. You can also copy content and post manually if you prefer.'
    },
    {
      category: 'Integrations',
      question: 'Is my account data secure?',
      answer: 'Yes! We use bank-level encryption and OAuth authentication. We never store your passwords, and you can revoke Foundrly\'s access at any time through your social media platform settings.'
    },
    {
      category: 'Account & Security',
      question: 'How is my data protected?',
      answer: 'We use industry-standard encryption, secure data centers, and strict access controls. Your content, brand information, and analytics are completely private. We never share your data with third parties.'
    },
    {
      category: 'Account & Security',
      question: 'Can I export my data?',
      answer: 'Yes! You can export all your content, analytics data, and reports at any time. We believe your data belongs to you, and we make it easy to take it with you.'
    },
    {
      category: 'Account & Security',
      question: 'What happens if I cancel my subscription?',
      answer: 'You\'ll retain access to all features until the end of your billing period. Your content history remains accessible in read-only mode. You can reactivate your account anytime to regain full access.'
    }
  ];

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Frequently Asked Questions"
        description="Find answers to common questions about Foundrly. Can't find what you're looking for? Contact our support team."
      >
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-gray-400 transition-colors text-gray-900"
            />
          </div>
        </div>
      </PageHero>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Questions' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          {filteredFaqs.length > 0 ? (
            <>
              <div className="mb-8 text-gray-600">
                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </div>
              <AccordionFAQ items={filteredFaqs} />
            </>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-gray-900 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="group bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 justify-center"
            >
              <span>Contact Support</span>
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => navigate('/resources')}
              className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg hover:scale-105"
            >
              Browse Resources
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
