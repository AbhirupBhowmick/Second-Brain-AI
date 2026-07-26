import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const RoadmapSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const columns = [
    {
      phase: 'Current',
      badge: 'Live',
      badgeDot: 'bg-emerald-400',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/30 bg-emerald-500/10',
      lineColor: 'bg-emerald-500/40',
      title: 'Foundation',
      subtitle: 'Core infrastructure shipped and running in production.',
      items: [
        'Neo4j Knowledge Graph',
        'Semantic Vector Search',
        'Spring Boot Backend',
        'AI Chat Workspace',
        'Markdown Editor',
      ],
      iconPath: 'M5 13l4 4L19 7',
      iconColor: 'text-emerald-400',
    },
    {
      phase: 'In Development',
      badge: 'Building',
      badgeDot: 'bg-indigo-400',
      badgeText: 'text-indigo-400',
      badgeBorder: 'border-indigo-500/30 bg-indigo-500/10',
      lineColor: 'bg-indigo-500/40',
      title: 'Multimodal Capture',
      subtitle: 'Expanding inputs and collaboration across every surface.',
      items: [
        'Chrome Extension',
        'PDF & Image OCR',
        'Collaborative Canvas',
        'Mobile & Desktop Apps',
        'Daily Knowledge Digest',
      ],
      iconPath: 'M12 4v16m8-8H4',
      iconColor: 'text-indigo-400',
    },
    {
      phase: 'Future',
      badge: 'Planned',
      badgeDot: 'bg-purple-400',
      badgeText: 'text-purple-400',
      badgeBorder: 'border-purple-500/30 bg-purple-500/10',
      lineColor: 'bg-purple-500/30',
      title: 'Autonomous Agents',
      subtitle: 'Self-directing cognitive layer that researches on your behalf.',
      items: [
        'Background Research Agents',
        'Encrypted Enterprise Vaults',
        'Local Fine-Tuned Models',
        'Public Graph Publishing',
        'Obsidian & Notion Sync',
      ],
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      iconColor: 'text-purple-400',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && timelineRef.current) {
            gsap.from(timelineRef.current.children, {
              opacity: 0,
              y: 32,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power3.out',
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
    <section
      id="roadmap"
      ref={sectionRef}
      className="py-20 lg:py-28 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400 mb-4">
          PRODUCT ROADMAP
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-white mb-3">
          The future of personal intelligence.
        </h2>
        <p className="text-base text-zinc-400 font-normal leading-relaxed">
          Our engineering timeline for expanding Second Brain AI into a fully autonomous cognitive layer.
        </p>
      </div>

      {/* Timeline connector line — desktop only */}
      <div className="hidden lg:flex items-center justify-center mb-8 px-8 relative">
        <div className="absolute left-[calc(16.67%+1.25rem)] right-[calc(16.67%+1.25rem)] h-px">
          {/* Animated dashed connector */}
          <div className="w-full h-px border-t border-dashed border-white/[0.12]" />
          {/* Left dot */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500/60 ring-4 ring-emerald-500/15" />
          {/* Mid dot */}
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-500/60 ring-4 ring-indigo-500/15" />
          {/* Right dot */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-500/60 ring-4 ring-purple-500/15" />
        </div>
      </div>

      {/* Cards Grid — equal height via gridAutoRows */}
      <div
        ref={timelineRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        style={{ gridAutoRows: '1fr' }}
      >
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-xl border border-white/[0.07] bg-zinc-900/50 p-6
              hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]
              transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  {col.phase}
                </p>
                <h3 className="font-display text-lg font-bold text-white leading-tight">
                  {col.title}
                </h3>
              </div>
              {/* Coloured status badge */}
              <span
                className={`shrink-0 flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${col.badgeBorder} ${col.badgeText}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${col.badgeDot}`} />
                {col.badge}
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {col.subtitle}
            </p>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-4" />

            {/* Checklist — flex-1 to equalise heights */}
            <ul className="space-y-2.5 flex-1">
              {col.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <svg
                    className={`w-3.5 h-3.5 shrink-0 ${col.iconColor}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={col.iconPath}
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
