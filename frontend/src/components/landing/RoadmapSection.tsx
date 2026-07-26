import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const RoadmapSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const roadmapItems = [
    {
      phase: 'Current',
      badge: 'V1.0 LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      title: 'Foundation & Core Engine',
      items: [
        'Neo4j Knowledge Graph Visualizer',
        'Spring Boot Micro-service Backend',
        'Semantic Vector Indexing & Search',
        'Contextual AI Chat Workspace',
        'Local Markdown Editor with Backlinks',
      ],
    },
    {
      phase: 'Coming Soon',
      badge: 'V1.5 IN DEV',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      title: 'Multimodal & Deep Capture',
      items: [
        'Chrome Browser Extension for 1-Click Clipping',
        'PDF & Image OCR Entity Auto-Tagging',
        'Real-time Collaborative Graph Canvas',
        'Native Mobile & Desktop Applications',
        'Automated Daily Knowledge Digests',
      ],
    },
    {
      phase: 'Future',
      badge: 'V2.0 VISION',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      title: 'Autonomous Cognitive Agents',
      items: [
        'Autonomous Background Research Agents',
        'Zero-Knowledge Encrypted Enterprise Vaults',
        'Custom Cognitive Fine-Tuning on Local Datasets',
        'Public Knowledge Graph Publishing & APIs',
        'Bi-Directional Sync with Obsidian & Notion',
      ],
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && timelineRef.current) {
            gsap.from(timelineRef.current.children, {
              opacity: 0,
              y: 40,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power3.out',
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
    <section id="roadmap" ref={sectionRef} className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400">
          PRODUCT ROADMAP
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          The future of personal intelligence.
        </h2>
        <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          Our continuous engineering timeline as we expand Second Brain AI into an autonomous cognitive layer.
        </p>
      </div>

      {/* Timeline Grid */}
      <div ref={timelineRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {roadmapItems.map((column, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl bg-zinc-900/60 border border-white/[0.08] relative space-y-6 hover:border-white/[0.15] transition-all duration-300 shadow-xl"
          >
            {/* Column Header */}
            <div className="space-y-3 pb-6 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">
                  {column.phase}
                </span>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${column.badgeColor}`}
                >
                  {column.badge}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {column.title}
              </h3>
            </div>

            {/* Checklist Items */}
            <ul className="space-y-3">
              {column.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 font-normal">
                  <svg
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      idx === 0 ? 'text-emerald-400' : idx === 1 ? 'text-indigo-400' : 'text-zinc-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        idx === 0
                          ? 'M5 13l4 4L19 7'
                          : idx === 1
                          ? 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                          : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      }
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoadmapSection;
