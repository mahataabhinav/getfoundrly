import { BookOpen, HelpCircle, FileText, Video, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../../components/shared/PageHero';
import FeatureGrid from '../../components/shared/FeatureGrid';

export default function ResourcesHub() {
  const navigate = useNavigate();

  const resources = [
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Find answers to common questions about Foundrly, billing, features, and more.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Help Center',
      description: 'Step-by-step guides and tutorials to help you get the most out of Foundrly.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileText,
      title: 'Case Studies',
      description: 'See how other founders and businesses are using Foundrly to grow.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch quick video guides covering every feature and best practice.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Download,
      title: 'Templates & Downloads',
      description: 'Free templates, guides, and resources to accelerate your content strategy.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Calendar,
      title: 'Webinars & Events',
      description: 'Join live sessions and watch recordings of past webinars and workshops.',
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  const handleResourceClick = (index: number) => {
    const paths = [
      '/resources/faq',
      '/resources/help',
      '/resources/case-studies',
      '/resources/videos',
      '/resources/downloads',
      '/resources/webinars'
    ];
    navigate(paths[index]);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Resources & Support"
        description="Everything you need to succeed with Foundrly. From tutorials to templates, we've got you covered."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FeatureGrid
            features={resources}
            columns={3}
            onFeatureClick={handleResourceClick}
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need More Help?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is ready to help.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="group bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <span>Contact Support</span>
            <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
