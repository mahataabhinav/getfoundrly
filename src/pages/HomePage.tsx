import { useNavigate } from 'react-router-dom';
import HeroEnhanced from '../components/home/HeroEnhanced';
import WhatFoundrlyDoes from '../components/home/WhatFoundrlyDoes';
import HowItWorks from '../components/home/HowItWorks';
import LiveProductGlimpses from '../components/home/LiveProductGlimpses';
import SmartScheduling from '../components/home/SmartScheduling';
import DashboardGlance from '../components/home/DashboardGlance';
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
    <>
      <HeroEnhanced
        onSignupClick={() => navigate('/signup')}
        onSeeHowItWorks={scrollToHowItWorks}
      />
      <WhatFoundrlyDoes onCardClick={scrollToHowItWorks} />
      <HowItWorks />
      <LiveProductGlimpses />
      <SmartScheduling />
      <DashboardGlance />
      <BuiltForFounders />
      <FinalCTA
        onSignupClick={() => navigate('/signup')}
        onLoginClick={() => navigate('/login')}
      />
    </>
  );
}
