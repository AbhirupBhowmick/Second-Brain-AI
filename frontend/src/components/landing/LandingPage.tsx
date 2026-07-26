import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import SocialProofSection from './SocialProofSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import ProductPreviewSection from './ProductPreviewSection';
import WhySecondBrainSection from './WhySecondBrainSection';
import RoadmapSection from './RoadmapSection';
import FinalCTASection from './FinalCTASection';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans relative">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Landing Page Content */}
      <main className="relative z-10 space-y-0">
        <HeroSection />
        <SocialProofSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProductPreviewSection />
        <WhySecondBrainSection />
        <RoadmapSection />
        <FinalCTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
