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
      description: 'Map relationships between ideas as a living, traversable network — built on Neo4j.',
      tag: 'Powered by Neo4j',
      icon: (
        <svg className="w-[18px] h-[18px] text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="6"  cy="5"  r="2.2" strokeWidth="1.5" />
          <circle cx="18" cy="5"  r="2.2" strokeWidth="1.5" />
          <circle cx="12" cy="19" r="2.2" strokeWidth="1.5" />
          <path d="M8 6.5L16 6.5M7.5 7.5L10.8 16.5M16.5 7.5L13.2 16.5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Semantic Memory',
      description: 'Every note is stored as a vector embedding, so concepts surface by meaning — not keywords.',
      tag: 'Semantic Embeddings',
      icon: (
        <svg className="w-[18px] h-[18px] text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'AI Workspace',
      description: 'Chat with your own knowledge base. Ask questions, get synthesis, uncover hidden connections.',
      tag: 'AI Workspace',
      icon: (
        <svg className="w-[18px] h-[18px] text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Research Studio',
      description: 'Capture links, papers, highlights and raw notes from any source into a single workspace.',
      tag: 'Multi-Source Ingestion',
      icon: (
        <svg className="w-[18px] h-[18px] text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Smart Search',
      description: 'Retrieve ideas by intent and context. No exact phrasing required — meaning drives recall.',
      tag: 'Neural Retrieval',
      icon: (
        <svg className="w-[18px] h-[18px] text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: 'Private by Design',
      description: 'Local-first storage with JWT-secured access. Your knowledge stays yours — always.',
      tag: 'End-to-End Secured',
      icon: (
        <svg className="w-[18px] h-[18px] text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && cardsRef.current) {
            gsap.from(Array.from(cardsRef.current.children), {
              opacity: 0,
              y: 20,
              duration: 0.55,
              stagger: 0.07,
              ease: 'power2.out',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-16 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400 mb-4">
          CORE CAPABILITIES
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-white leading-tight mb-3">
          Designed for high-velocity thinkers.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
          Second Brain AI bridges raw human intuition with structured, machine-readable knowledge — so nothing slips through the cracks.
        </p>
      </div>

      {/* 3×2 Feature Cards Grid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {features.map((item, idx) => (
          <article
            key={idx}
            className={`
              group flex flex-col
              rounded-xl border border-white/[0.07] bg-zinc-900/50
              p-5 cursor-default
              transition-all duration-250 ease-out
              hover:-translate-y-[3px]
              hover:border-indigo-500/25
              hover:bg-zinc-900/80
              hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)]
            `}
          >
            {/* Icon */}
            <div
              className={`
                mb-3.5 w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0
                bg-zinc-800/70 border border-white/[0.07]
                group-hover:bg-indigo-950/60 group-hover:border-indigo-500/25
                transition-all duration-250
              `}
            >
              <div className="transition-transform duration-250 group-hover:scale-110">
                {item.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="font-display text-[15px] font-semibold text-zinc-100 group-hover:text-white transition-colors duration-200 mb-1.5 leading-snug">
              {item.title}
            </h3>

            {/* Description — clamped to 2 lines, flex-1 pushes footer down */}
            <p className="text-[13px] text-zinc-400 leading-[1.6] font-normal flex-1 mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.description}
            </p>

            {/* Footer */}
            <div className="mt-3.5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-zinc-500 group-hover:text-indigo-400 transition-colors duration-200 tracking-wide">
                {item.tag}
              </span>
              <svg
                className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-[3px] transition-all duration-200"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
