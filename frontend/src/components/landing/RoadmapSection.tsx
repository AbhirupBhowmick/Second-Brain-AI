import React from 'react';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
  </svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const columns = [
  {
    phase: 'Now',
    badgeLabel: 'LIVE',
    badgeDot: 'bg-emerald-400 animate-pulse',
    badgeStyle: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    dotRing: 'bg-emerald-500 ring-emerald-500/20',
    cardBorder: 'border-emerald-500/15',
    title: 'Foundation',
    subtitle: 'Core infrastructure shipped and running in production.',
    items: [
      'Neo4j Knowledge Graph',
      'Semantic Vector Search',
      'Spring Boot API',
      'AI Chat Workspace',
      'Markdown Editor',
    ],
    Icon: CheckIcon,
    iconCls: 'text-emerald-400',
  },
  {
    phase: 'Q3 2026',
    badgeLabel: 'IN DEVELOPMENT',
    badgeDot: 'bg-indigo-400',
    badgeStyle: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
    dotRing: 'bg-indigo-500 ring-indigo-500/20',
    cardBorder: 'border-indigo-500/15',
    title: 'Multimodal Capture',
    subtitle: 'Expanding inputs and collaboration across every surface.',
    items: [
      'Chrome Clip Extension',
      'PDF & Image OCR',
      'Collaborative Canvas',
      'Mobile & Desktop Apps',
      'Daily Knowledge Digest',
    ],
    Icon: PlusIcon,
    iconCls: 'text-indigo-400',
  },
  {
    phase: '2027',
    badgeLabel: 'PLANNED',
    badgeDot: 'bg-purple-400',
    badgeStyle: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    dotRing: 'bg-purple-500 ring-purple-500/20',
    cardBorder: 'border-purple-500/15',
    title: 'Autonomous Agents',
    subtitle: 'A self-directing cognitive layer that researches on your behalf.',
    items: [
      'Background Research Agents',
      'Encrypted Enterprise Vaults',
      'Local Fine-Tuned Models',
      'Public Graph APIs',
      'Obsidian & Notion Sync',
    ],
    Icon: ClockIcon,
    iconCls: 'text-purple-400',
  },
];

const RoadmapSection: React.FC = () => {




  return (
    <section
      id="roadmap"
      className="py-16 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]"
    >
      {/* ── Header ── */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400 mb-4">
          PRODUCT ROADMAP
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-white leading-tight mb-3">
          The future of personal intelligence.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
          Our engineering timeline for expanding Second Brain AI into a fully autonomous cognitive layer.
        </p>
      </div>

      {/* ── Timeline connector (desktop only) ── */}
      <div className="hidden lg:block relative mb-6 mx-auto" style={{ maxWidth: 'calc(100% - 4rem)' }}>
        {/* Track */}
        <div className="h-px w-full bg-white/[0.07]" />

        {/* Static fill line */}
        <div className="absolute inset-y-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/50 via-indigo-500/50 to-purple-500/50" />

        {/* Three positioned dots — aligned to card centres (0%, 50%, 100%) */}
        {[
          { left: '16.67%', ring: 'ring-emerald-500/20', dot: 'bg-emerald-500' },
          { left: '50%',    ring: 'ring-indigo-500/20',  dot: 'bg-indigo-500' },
          { left: '83.33%', ring: 'ring-purple-500/20',  dot: 'bg-purple-500' },
        ].map(({ left, ring, dot }, i) => (
          <div
            key={i}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ring-4 ${dot} ${ring}`}
            style={{ left }}
          />
        ))}
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col, idx) => {
          const { Icon } = col;
          return (
            <div
              key={idx}
              className={`
                flex flex-col rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5
                hover:border-white/[0.13] hover:-translate-y-[3px]
                hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)]
                transition-all duration-250
              `}
            >
              {/* Card header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">
                    {col.phase}
                  </p>
                  <h3 className="font-display text-[15px] font-bold text-white leading-snug">
                    {col.title}
                  </h3>
                </div>
                {/* Status badge */}
                <span
                  className={`shrink-0 flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${col.badgeStyle}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.badgeDot}`} />
                  {col.badgeLabel}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-[12.5px] text-zinc-400 leading-relaxed mb-3">
                {col.subtitle}
              </p>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-3" />

              {/* Checklist — flex-1 so all cards stretch equally */}
              <ul className="space-y-2 flex-1">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-zinc-300">
                    <Icon className={`w-3 h-3 shrink-0 ${col.iconCls}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RoadmapSection;
