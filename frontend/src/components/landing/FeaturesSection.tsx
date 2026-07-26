import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FeatureItem {
  number: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features: FeatureItem[] = [
    {
      number: '01',
      title: 'Knowledge Graph',
      description: 'Visualise relationships between ideas.',
      tag: 'Neo4j Engine',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="6" cy="6" r="3" strokeWidth="1.5" />
          <circle cx="18" cy="6" r="3" strokeWidth="1.5" />
          <circle cx="12" cy="18" r="3" strokeWidth="1.5" />
          <path d="M8.5 7.5L15.5 7.5M7.5 8.5L10.5 15.5M16.5 8.5L13.5 15.5" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Semantic Memory',
      description: 'Everything stays connected forever.',
      tag: 'Vector Storage',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'AI Workspace',
      description: 'Chat, organise, discover.',
      tag: 'Cognitive Engine',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Research Studio',
      description: 'Capture everything in one place.',
      tag: 'Multi-Source Capture',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      number: '05',
      title: 'Smart Search',
      description: 'Search concepts instead of keywords.',
      tag: 'Neural Retrieval',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: '06',
      title: 'Private by Design',
      description: 'Your knowledge remains yours.',
      tag: 'Local & Encrypted',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && cardsRef.current) {
            gsap.from(cardsRef.current.children, {
              opacity: 0,
              y: 30,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power2.out',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400">
          CORE CAPABILITIES
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Designed for high-velocity thinkers.
        </h2>
        <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          Second Brain AI bridges raw human intuition with structured computational retrieval.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="glass-card p-8 rounded-2xl relative flex flex-col justify-between group cursor-pointer"
          >
            <div>
              {/* Card Top Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 group-hover:bg-indigo-950/20 transition-colors">
                  {item.icon}
                </div>
                <span className="text-xs font-mono text-zinc-500 font-medium tracking-wider">
                  {item.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            {/* Bottom Tag */}
            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 group-hover:text-indigo-400 transition-colors">
                {item.tag}
              </span>
              <svg
                className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
