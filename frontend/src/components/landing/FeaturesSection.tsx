import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FeatureItem {
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
      title: 'Knowledge Graph',
      description: 'Visualise relationships between ideas as a living, explorable network.',
      tag: 'Neo4j Engine',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="6" cy="6" r="2.5" strokeWidth="1.5" />
          <circle cx="18" cy="6" r="2.5" strokeWidth="1.5" />
          <circle cx="12" cy="18" r="2.5" strokeWidth="1.5" />
          <path d="M8.2 7.2L15.8 7.2M7.5 8.2L10.5 16M16.5 8.2L13.5 16" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Semantic Memory',
      description: 'Every idea is indexed by meaning, not just words. Nothing gets lost.',
      tag: 'Vector Storage',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'AI Workspace',
      description: 'Chat with your knowledge base. Organise, synthesise, and discover insights.',
      tag: 'Cognitive Engine',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Research Studio',
      description: 'Capture notes, links, papers, and highlights in one unified space.',
      tag: 'Multi-Source Capture',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Smart Search',
      description: 'Find ideas by concept and intent — not by guessing exact keywords.',
      tag: 'Neural Retrieval',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: 'Private by Design',
      description: 'Local-first architecture. Your knowledge never leaves without permission.',
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
              y: 24,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-20 lg:py-28 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400 mb-4">
          CORE CAPABILITIES
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-white mb-3">
          Designed for high-velocity thinkers.
        </h2>
        <p className="text-base text-zinc-400 font-normal leading-relaxed">
          Second Brain AI bridges raw human intuition with structured computational retrieval.
        </p>
      </div>

      {/* Feature Cards Grid — strict 3-col, equal height via grid-rows-subgrid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        style={{ gridAutoRows: '1fr' }}
      >
        {features.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col rounded-xl border border-white/[0.07] bg-zinc-900/50 p-6 cursor-pointer
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-zinc-900/80 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]"
          >
            {/* Icon Container */}
            <div
              className="mb-4 w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                bg-zinc-800/80 border border-white/[0.07]
                group-hover:bg-indigo-950/50 group-hover:border-indigo-500/30
                transition-all duration-300"
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="font-display text-base font-semibold text-zinc-100 group-hover:text-white transition-colors mb-1.5">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-zinc-400 leading-relaxed font-normal flex-1">
              {item.description}
            </p>

            {/* Divider + Footer Tag — pushed to bottom via mt-auto */}
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-zinc-500 group-hover:text-indigo-400 transition-colors tracking-wide">
                {item.tag}
              </span>
              <svg
                className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
