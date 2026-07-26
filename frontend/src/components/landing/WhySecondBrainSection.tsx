import React from 'react';

const WhySecondBrainSection: React.FC = () => {
  const comparisons = [
    {
      traditionalTitle: 'Disconnected Notes',
      traditionalDesc: 'Static text files isolated in disparate apps and forgotten over time.',
      secondBrainTitle: 'Connected Knowledge',
      secondBrainDesc: 'Every idea dynamically links to relevant context across your entire workspace.',
    },
    {
      traditionalTitle: 'Keyword Search',
      traditionalDesc: 'Requires remembering exact word spellings or filenames to retrieve information.',
      secondBrainTitle: 'Semantic Search',
      secondBrainDesc: 'Search by natural concepts, meanings, and intent — even without exact keywords.',
    },
    {
      traditionalTitle: 'Rigid Folders',
      traditionalDesc: 'Hierarchical file structures that force single-location categorization.',
      secondBrainTitle: 'Knowledge Graph',
      secondBrainDesc: 'Multi-dimensional graph networks where one note belongs to infinite contextual clusters.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400">
          WHY SECOND BRAIN AI
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          A fundamental paradigm shift.
        </h2>
        <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          See how Second Brain AI redefines personal knowledge management from traditional storage to active intelligence.
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {comparisons.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-6 flex flex-col justify-between space-y-6 hover:border-white/[0.15] transition-all duration-300 shadow-xl"
          >
            {/* Traditional Notes (Before) */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-red-500/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span>Traditional Notes</span>
              </div>
              <h4 className="text-base font-semibold text-zinc-400 line-through decoration-zinc-600">
                {item.traditionalTitle}
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                {item.traditionalDesc}
              </p>
            </div>

            {/* Transformation Vector Arrow */}
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                ↓
              </div>
            </div>

            {/* Second Brain AI (After) */}
            <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>Second Brain AI</span>
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                {item.secondBrainTitle}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                {item.secondBrainDesc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhySecondBrainSection;
