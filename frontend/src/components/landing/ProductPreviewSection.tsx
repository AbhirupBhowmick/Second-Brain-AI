import React, { useState, useEffect } from 'react';

const ProductPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'graph', label: 'Knowledge Graph' },
    { id: 'chat', label: 'AI Chat' },
    { id: 'editor', label: 'Editor' },
    { id: 'timeline', label: 'Timeline' },
  ];

  // Auto cycle tabs every 4 seconds unless manually clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tabs.length]);

  return (
    <section id="live-demo" className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400">
          LIVE PRODUCT PREVIEW
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Experience Second Brain AI in action.
        </h2>
        <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          Switch views below to inspect how every note, graph node, and chat prompt stays in sync.
        </p>
      </div>

      {/* Animated Browser Window Frame */}
      <div className="w-full rounded-2xl border border-white/[0.1] bg-[#0c0c0e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Browser Header Bar */}
        <div className="bg-zinc-950 border-b border-white/[0.08] px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* URL bar */}
          <div className="px-4 py-1 rounded-md bg-zinc-900 border border-white/[0.06] text-xs font-mono text-zinc-400 flex items-center gap-2 min-w-[240px] justify-center">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>app.secondbrain.ai/{tabs[activeTab].id}</span>
          </div>

          {/* Tabs Nav inside browser */}
          <div className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded-lg border border-white/[0.06] overflow-x-auto hide-scrollbar">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === idx
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Content Simulation Frame */}
        <div className="min-h-[420px] lg:min-h-[480px] p-6 lg:p-8 relative flex items-center justify-center bg-[#09090b]">
          {/* 1. Dashboard View */}
          {activeTab === 0 && (
            <div className="w-full space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
                  <div className="text-xs text-zinc-500 font-mono mb-1">TOTAL NODES</div>
                  <div className="text-2xl font-bold text-white font-display">1,482</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <span>↑ 12% from last week</span>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
                  <div className="text-xs text-zinc-500 font-mono mb-1">GRAPH EDGES</div>
                  <div className="text-2xl font-bold text-indigo-400 font-display">4,290</div>
                  <div className="text-xs text-indigo-400 mt-2">Active Neo4j Relationships</div>
                </div>
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
                  <div className="text-xs text-zinc-500 font-mono mb-1">SEMANTIC SEARCHES</div>
                  <div className="text-2xl font-bold text-white font-display">349</div>
                  <div className="text-xs text-zinc-400 mt-2">100% Vector Precision</div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <h4 className="text-sm font-semibold text-white">Recent Cognitive Activity</h4>
                <div className="space-y-2 text-xs font-mono text-zinc-400">
                  <div className="p-2.5 rounded bg-zinc-950/80 border border-white/[0.04] flex items-center justify-between">
                    <span>Note: "Transformers & Sparse Attention" linked to "Neo4j Index"</span>
                    <span className="text-zinc-500">2 mins ago</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950/80 border border-white/[0.04] flex items-center justify-between">
                    <span>AI Assistant synthesized 4 references on "Distributed Consensus"</span>
                    <span className="text-zinc-500">14 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Knowledge Graph View */}
          {activeTab === 1 && (
            <div className="w-full h-full min-h-[360px] rounded-xl bg-zinc-950/90 border border-white/[0.08] relative overflow-hidden flex items-center justify-center animate-in fade-in duration-300">
              <div className="absolute inset-0 subtle-grid-bg opacity-30" />
              <div className="relative z-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="6" cy="6" r="3" strokeWidth="1.5" />
                    <circle cx="18" cy="6" r="3" strokeWidth="1.5" />
                    <circle cx="12" cy="18" r="3" strokeWidth="1.5" />
                    <path d="M8.5 7.5L15.5 7.5M7.5 8.5L10.5 15.5M16.5 8.5L13.5 15.5" strokeWidth="1.5" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white">Interactive Knowledge Map</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Zoom, drag, and inspect clusters of connected thoughts rendered in real-time via force-directed physics.
                </p>
              </div>
            </div>
          )}

          {/* 3. AI Chat View */}
          {activeTab === 2 && (
            <div className="w-full space-y-4 max-w-2xl mx-auto animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-zinc-300 self-end ml-auto max-w-md">
                "What were my conclusions regarding backend scalability in Spring Boot?"
              </div>
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-zinc-200 max-w-md space-y-2">
                <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                  SECOND BRAIN AI • SYNTHESIS
                </div>
                <p>
                  Based on your notes from July 18th: You concluded that using reactive Spring WebFlux alongside Neo4j reactive driver yielded 40% lower memory consumption under concurrent query spikes.
                </p>
              </div>
            </div>
          )}

          {/* 4. Editor View */}
          {activeTab === 3 && (
            <div className="w-full space-y-4 text-left max-w-2xl mx-auto animate-in fade-in duration-300">
              <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
                <h4 className="text-lg font-bold text-white">[[Distributed Knowledge Architecture]]</h4>
                <span className="text-xs font-mono text-indigo-400">AUTO-SAVED</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                Modern cognitive apps require a dual-store approach. Vector indexes provide fuzzy semantic lookups, while [[Neo4j Graph Database]] provides explicit topological relationships...
              </p>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06] text-xs text-zinc-400 font-mono">
                Backlinks (2): [[Vector Memory]], [[Semantic Search]]
              </div>
            </div>
          )}

          {/* 5. Timeline View */}
          {activeTab === 4 && (
            <div className="w-full space-y-4 max-w-xl mx-auto animate-in fade-in duration-300 text-left">
              <h4 className="text-sm font-semibold text-white mb-4">Evolution of your thoughts</h4>
              <div className="border-l-2 border-indigo-500/40 pl-4 space-y-4 text-xs font-mono">
                <div>
                  <div className="text-indigo-400 font-bold">TODAY</div>
                  <div className="text-zinc-300">Connected 3 notes on LLM Context Windows</div>
                </div>
                <div>
                  <div className="text-zinc-500 font-bold">YESTERDAY</div>
                  <div className="text-zinc-400">Imported 12 research links from Chrome extension</div>
                </div>
                <div>
                  <div className="text-zinc-500 font-bold">LAST WEEK</div>
                  <div className="text-zinc-400">Created initial seed graph for Second Brain AI</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductPreviewSection;
