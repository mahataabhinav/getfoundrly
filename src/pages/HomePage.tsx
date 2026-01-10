import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/modern/HeroSection';
import TransformationShowcase from '../components/home/modern/TransformationShowcase';
import LeadGenTrial from '../components/home/modern/LeadGenTrial';
import HowItWorks from '../components/home/HowItWorks';
import LiveProductGlimpses from '../components/home/LiveProductGlimpses';
import BuiltForFounders from '../components/home/BuiltForFounders';
import FinalCTA from '../components/home/FinalCTA';

export default function HomePage() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <HeroSection
        onSignupClick={() => navigate('/signup')}
      />

      {/* Visual divider/transition */}
      <div className="h-24 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]"></div>

      <TransformationShowcase />

      <LeadGenTrial />

      <div className="bg-[#0A0A0A]">
        <HowItWorks />
        <LiveProductGlimpses />
        <BuiltForFounders />
        <FinalCTA
          onSignupClick={() => navigate('/signup')}
          onLoginClick={() => navigate('/login')}
        />
      </div>
    </div>
  );
}
