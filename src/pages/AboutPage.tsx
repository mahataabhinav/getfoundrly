import { useState } from 'react';
import { Heart, Zap, ShieldCheck, Search, Rocket, Smile, Users, Target, Globe, TrendingUp, Sparkles, Lightbulb, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CTASection from '../components/shared/CTASection';

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'We root for the underdog',
      description: 'The small business owner is always the hero of this story. Everything we build starts with what makes their life easier, not what makes ours more impressive.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'No fluff, just forward',
      description: "We don't sell complexity. We cut through it. If something isn't moving your business forward, we're not building it.",
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: ShieldCheck,
      title: 'Trust is the product',
      description: 'AI only works if you trust it to act on your behalf. We earn that by being transparent, staying in your corner, and never doing anything you didn\'t ask for.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Search,
      title: 'We dig before we build',
      description: 'Your real bottleneck is rarely the one you can see. We uncover what\'s actually slowing you down and start solving it before you get out of bed the next morning.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Rocket,
      title: 'Scrappy is a feature',
      description: 'We move fast, stay lean, and ship things that work. We\'re not waiting for perfect -- we\'re building toward it with you.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Smile,
      title: 'Dogs (and cats) welcome',
      description: 'We\'re a team that takes the work seriously and ourselves less so. Good culture shows up in the product. Pets, chaos, and bad puns are all part of it.',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const team = [
    {
      name: "Abhinav Mahata",
      title: "CEO",
      role: "Strategy & Operations",
      bio: "Background in AI tools and DTC brand building. Leads company vision, growth, and engineering. Climbs Mount Everest on the weekends.",
      initials: "AM",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      email: "abhinav@getfoundrly.com",
      image: "/team/abhinav.jpg"
    },
    {
      name: "Erin Grimes",
      title: "CMO",
      role: "Brand & Growth",
      bio: "Background in marketing and brand strategy. Leads voice, positioning, and go-to-market strategy. Confirmed cat person.",
      initials: "EG",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      email: "erin@getfoundrly.com",
      image: "/team/erin.jpg"
    },
    {
      name: "Jeff Fons",
      title: "COO",
      role: "Innovation & Growth",
      bio: "Background in accelerating innovation across startups, PE, non-profits, and Fortune 500s. Turns vision into velocity, chaos into growth. Proudly mission-driven, hopelessly dog-obsessed.",
      initials: "JF",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      email: "jeff@getfoundrly.com",
      image: "/team/jeff.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-purple-400/10 rounded-full blur-3xl mix-blend-multiply" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100">
                <Sparkles className="w-4 h-4" />
                <span>WHY WE BUILT FOUNDRLY</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                The AI engine built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 whitespace-nowrap">small businesses.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
                Small business owners are drowning in operational quicksand. We built Foundrly to automate the busywork across every part of your business, giving you your time back to focus on growth.
              </p>
            </div>

            {/* Right Column - Graphics */}
            <div className="relative h-[500px] hidden lg:block">
              {/* Floating Cards Graphic */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-72 bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] z-10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-inner">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Brand Growth</div>
                    <div className="text-xs text-green-600 font-medium">+142% this month</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 w-64 bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] z-10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-inner">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">AI Co-founder</div>
                    <div className="text-xs text-purple-600 font-medium">Working for you</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse delay-75"></div>
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse delay-150"></div>
                </div>
              </motion.div>

              {/* Central decorative element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full mix-blend-multiply opacity-20 blur-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Bento Card 1: The Meetup (spans 2 cols) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 w-32 h-32 bg-pink-100 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
              <Users className="w-10 h-10 text-pink-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Meetup</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                A mountain climber, a dog lover and a spicy little tamale walked into a bar, or rather, an international AI Generalist Cohort where they learned, laughed, loved their way to solving a real business problem.
              </p>
            </div>

            {/* Bento Card 2: The Problem (spans 1 col) */}
            <div className="md:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:rotate-12">
                <TrendingUp className="w-40 h-40 text-white" />
              </div>
              <Target className="w-10 h-10 text-red-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">The Problem</h3>
              <p className="text-gray-300 leading-relaxed">
                Small business owners are drowning in "operational quicksand." Getting buried alive under admin, chasing invoices, posting to Instagram at midnight.
              </p>
            </div>

            {/* Bento Card 3: The Catalyst (spans 1 col) */}
            <div className="md:col-span-1 bg-blue-600 rounded-3xl p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-500 rounded-tl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
              <Lightbulb className="w-10 h-10 text-white mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">The Catalyst</h3>
              <p className="text-blue-100 leading-relaxed">
                They knew AI could help. They just didn't know where to start and hiring an agency wasn't an option.
              </p>
            </div>

            {/* Bento Card 4: The Solution (spans 2 cols) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute -right-10 -top-10 opacity-5 transition-transform group-hover:scale-110">
                <Sparkles className="w-64 h-64 text-blue-600" />
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">The Solution: Foundrly</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Not another tool to learn. Not another subscription to forget about.
                  </p>
                  <p className="text-lg font-medium text-blue-600 leading-relaxed">
                    An evolving AI co-founder that plugs into what you already use, figures out where you're losing time and money, and starts fixing it - without you having to become a complete tech genius.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              What We Believe
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Left Column: Titles List */}
            <div className="space-y-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setActiveValue(index)}
                  className={`cursor-pointer group p-6 rounded-3xl transition-all duration-300 border ${activeValue === index ? 'bg-white border-gray-200 shadow-md' : 'border-transparent hover:bg-white/60'}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${activeValue === index ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>
                      {value.title}
                    </h3>
                    <div className={`transform transition-all duration-300 ${activeValue === index ? 'translate-x-0 opacity-100 text-blue-600' : '-translate-x-4 opacity-0 text-gray-400'}`}>
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        →
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Active Details */}
            <div className="sticky top-24 bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl overflow-hidden min-h-[400px] flex flex-col justify-center relative">
              {/* Dynamic Abstract Background */}
              <motion.div
                key={`bg-${activeValue}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] bg-gradient-to-br ${values[activeValue].color} opacity-15`}
              />
              <motion.div
                key={`bg2-${activeValue}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-[80px] bg-gradient-to-br ${values[activeValue].color} opacity-15`}
              />

              <div className="relative z-10 bg-white/40 backdrop-blur-sm rounded-3xl p-4 -m-4">
                <motion.div
                  key={`icon-${activeValue}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${values[activeValue].color} mb-8 shadow-lg`}
                >
                  {(() => {
                    const ActiveIcon = values[activeValue].icon;
                    return <ActiveIcon className="w-10 h-10 text-white" />;
                  })()}
                </motion.div>

                <motion.div
                  key={`content-${activeValue}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h4 className="text-3xl font-bold text-gray-900 mb-6">{values[activeValue].title}</h4>
                  <p className="text-xl text-gray-800 leading-relaxed">
                    {values[activeValue].description}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Team Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              The Team
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all h-[460px]">
                {/* Default State (Clean) */}
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center transition-opacity duration-500 group-hover:opacity-0 bg-slate-50">
                  {member.image ? (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-6 overflow-hidden border-4 border-white shadow-md">
                      <img 
                        src={member.image} 
                        alt={`${member.name}`} 
                        className="w-full h-full object-cover object-top" 
                      />
                    </div>
                  ) : (
                    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${member.bgColor} ${member.textColor} flex items-center justify-center mb-6`}>
                      <span className="text-4xl md:text-5xl font-bold opacity-50">{member.initials}</span>
                    </div>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className={`text-base md:text-lg font-medium ${member.textColor}`}>{member.title}</p>
                </div>

                {/* Hover Reveal State */}
                <div className={`absolute inset-0 p-8 flex flex-col justify-center bg-gradient-to-br ${member.color} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out`}>
                  <div className="text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-1">{member.name}</h3>
                    <p className="text-white/80 font-medium mb-4 text-sm md:text-base">{member.title} — {member.role}</p>
                    <div className="w-12 h-1 bg-white/30 rounded-full mb-4"></div>
                    <p className="text-white/90 leading-relaxed text-sm md:text-base font-light mb-6">
                      {member.bio}
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                      <a href="#" className="text-white/70 hover:text-white transition-colors hover:scale-110 transform"><Linkedin className="w-5 h-5" /></a>
                      <a href="#" className="text-white/70 hover:text-white transition-colors hover:scale-110 transform"><Twitter className="w-5 h-5" /></a>
                      <a href="#" className="text-white/70 hover:text-white transition-colors hover:scale-110 transform"><Instagram className="w-5 h-5" /></a>
                      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}`} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors hover:scale-110 transform"><Mail className="w-5 h-5" /></a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        description="Join founders using Foundrly to create content, analyze performance, and grow their visibility."
        primaryButtonText="Start Free Trial"
        primaryButtonAction={() => navigate('/signup')}
        secondaryButtonText="Contact Us"
        secondaryButtonAction={() => navigate('/contact')}
      />
    </div>
  );
}
