import { useState } from 'react';
import { Check, Sparkles, TrendingUp, Rocket, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/shared/PageHero';
import AccordionFAQ from '../components/shared/AccordionFAQ';

export default function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for solo founders getting started',
      priceMonthly: 29,
      priceAnnual: 24,
      features: [
        '50 content pieces per month',
        'LinkedIn & Instagram posts',
        'Basic analytics dashboard',
        'Website analyzer',
        'Email support',
        '1 brand voice profile'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      description: 'For growing businesses scaling content',
      priceMonthly: 79,
      priceAnnual: 66,
      features: [
        '200 content pieces per month',
        'All content types (LinkedIn, Instagram, Email, Blog)',
        'Advanced analytics & insights',
        'Competitive analysis',
        'Authority score tracking',
        'Content calendar',
        'Priority support',
        '3 brand voice profiles',
        'Team collaboration'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for larger teams',
      priceMonthly: null,
      priceAnnual: null,
      features: [
        'Unlimited content generation',
        'All Professional features',
        'White-label reports',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Custom brand training',
        'Unlimited brand profiles',
        'Advanced team permissions',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I try Foundrly before committing to a plan?',
      answer: 'Yes! We offer a 14-day free trial on all plans. No credit card required. You can explore all features and create real content during your trial period.'
    },
    {
      question: 'What happens when I reach my content limit?',
      answer: 'You\'ll receive a notification when you\'re close to your limit. You can either upgrade to a higher plan or wait until your limit resets at the start of your next billing cycle. We never interrupt your workflow unexpectedly.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all annual plans. If you\'re not satisfied within the first 30 days, we\'ll refund your payment in full, no questions asked.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and can accommodate wire transfers for Enterprise plans.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use bank-level encryption and never share your data with third parties. Your content, brand information, and analytics are completely private and secure.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === null) return 'Custom';
    const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
    return `$${price}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === null || plan.priceAnnual === null) return null;
    const annualTotal = plan.priceAnnual * 12;
    const monthlyTotal = plan.priceMonthly * 12;
    const savings = Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100);
    return savings;
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Simple, Transparent Pricing"
        description="Choose the perfect plan for your needs. All plans include a 14-day free trial."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = index === 0 ? Sparkles : index === 1 ? TrendingUp : Rocket;
              const savings = getSavings(plan);

              return (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl p-8 transition-all ${
                    plan.popular
                      ? 'bg-gray-900 text-white shadow-2xl scale-105 border-4 border-gray-900'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.popular ? 'bg-white/10' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-900'}`} />
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mb-6 ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                        {getPrice(plan)}
                      </span>
                      {plan.priceMonthly !== null && (
                        <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                          /month
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && savings && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        Save ${plan.priceMonthly! * 12 - plan.priceAnnual! * 12}/year
                      </div>
                    )}
                    {billingCycle === 'annual' && plan.priceAnnual && (
                      <div className={`text-sm mt-1 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                        Billed ${plan.priceAnnual * 12} annually
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (plan.cta === 'Contact Sales') {
                        navigate('/contact');
                      } else {
                        navigate('/signup');
                      }
                    }}
                    className={`w-full py-3 rounded-full font-medium transition-all hover:scale-105 mb-8 ${
                      plan.popular
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <HelpCircle className="w-6 h-6 text-gray-700" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-xl text-gray-600">
              Everything you need to know about pricing and plans
            </p>
          </div>

          <AccordionFAQ items={faqs} />

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-900 font-medium hover:underline"
            >
              Contact our sales team →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
