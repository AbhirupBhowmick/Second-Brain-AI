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
            <span>Next-Generation Cognitive Workspace</span>
          </div>

          {/* Apple-Style Large Bold Headline */}
          <h1
            ref={headlineRef}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]"
          >
            Your ideas deserve a <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">permanent memory.</span>
          </h1>

          {/* Subheading */}
          <p
            ref={subheadRef}
            className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-xl"
          >
            Transform scattered thoughts into an intelligent knowledge network that grows with you.
          </p>

          {/* Action Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 group"
            >
              <span>Start Building</span>
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
              className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-200 font-medium text-base transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>View Demo</span>
            </button>
          </div>

          {/* Trusted Technologies */}
          <div ref={techRef} className="pt-6 border-t border-white/[0.08]">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono font-medium block mb-3.5">
              Trusted technologies:
            </span>
            <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm font-medium">
              <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="2.5" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
                </svg>
                <span className="text-zinc-300">React</span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-8h2v8z" />
                </svg>
                <span className="text-zinc-300">Spring Boot</span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="6" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path stroke="currentColor" strokeWidth="1.5" d="M8.5 16.5L15.5 7.5M8.5 18H15" />
                </svg>
                <span className="text-zinc-300">Neo4j</span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-zinc-300">AI Powered</span>
              </div>
            </div>
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
