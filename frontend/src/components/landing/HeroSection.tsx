import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import LivingKnowledgeGraph from './LivingKnowledgeGraph';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headlineRef.current, subheadRef.current, buttonsRef.current, techRef.current], {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToDemo = () => {
    const demoEl = document.getElementById('live-demo');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background soft ambient highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-medium text-zinc-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
            <span>AI Knowledge Platform</span>
          </div>

          {/* Large Bold Headline */}
          <h1
            ref={headlineRef}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]"
          >
            Your ideas deserve a <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">permanent memory.</span>
          </h1>

          {/* Subheading */}
          <p
            ref={subheadRef}
            className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl"
          >
            Capture notes, connect ideas, and explore them through an AI-powered knowledge graph.
          </p>

          {/* Action Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={scrollToDemo}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-200 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>View Demo</span>
            </button>
          </div>

          {/* Simple Technology Line */}
          <div ref={techRef} className="pt-6 border-t border-white/[0.08]">
            <p className="text-xs text-zinc-400 font-medium">
              Built with React • Spring Boot • Neo4j • AI
            </p>
          </div>
        </div>

        {/* Right Side: Animated Knowledge Graph */}
        <div className="lg:col-span-6 w-full">
          <LivingKnowledgeGraph />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
