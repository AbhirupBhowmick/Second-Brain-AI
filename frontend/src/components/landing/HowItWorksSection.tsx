import React, { useState } from 'react';

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'capture',
      title: 'Capture',
      subtitle: 'Stream thoughts, links, and documents naturally.',
      description:
        'Dump unstructured notes, research papers, book highlights, or web clips. Second Brain AI automatically parses markdown, tags context, and extracts key entities.',
      visual: (
        <div className="w-full h-full p-6 flex flex-col justify-center space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-400">[Note]</span>
            <span className="truncate">"Vector embeddings allow non-linear concept retrieval..."</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 flex items-center gap-3 ml-4">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-zinc-400">[Web]</span>
            <span className="truncate">"Neo4j graph schemas for high-speed bi-directional queries"</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-zinc-400">[Paper]</span>
            <span className="truncate">"Attention Is All You Need — Synthesis & Notes"</span>
          </div>
        </div>
      ),
    },
    {
      id: 'connect',
      title: 'Connect',
      subtitle: 'Automated semantic vector indexing & Neo4j graph nodes.',
      description:
        'Instead of rigid folders, ideas form living synaptic links. The engine analyzes context across your entire library to draw unexpected connections.',
      visual: (
        <div className="w-full h-full p-6 flex items-center justify-center relative">
          {/* SVG Diagram showing central node linking outer nodes */}
          <svg className="w-full h-full max-h-[220px]" viewBox="0 0 300 180" fill="none">
            <line x1="150" y1="90" x2="60" y2="40" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="150" y1="90" x2="240" y2="40" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="150" y1="90" x2="80" y2="140" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="150" y1="90" x2="220" y2="140" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 4" />

            <circle cx="150" cy="90" r="18" fill="#6366F1" fillOpacity="0.2" stroke="#6366F1" strokeWidth="2" />
            <circle cx="150" cy="90" r="6" fill="#818CF8" />

            <circle cx="60" cy="40" r="10" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.5" />
            <circle cx="240" cy="40" r="10" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.5" />
            <circle cx="80" cy="140" r="10" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.5" />
            <circle cx="220" cy="140" r="10" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.5" />
          </svg>
        </div>
      ),
    },
    {
      id: 'discover',
      title: 'Discover',
      subtitle: 'Uncover non-obvious insights with conversational AI synthesis.',
      description:
        'Ask questions to your knowledge base. Second Brain AI synthesizes answers derived strictly from your authenticated, linked thoughts.',
      visual: (
        <div className="w-full h-full p-6 flex flex-col justify-center space-y-4">
          <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Prompt Query</span>
            </div>
            <p className="text-sm text-zinc-200 font-medium">
              "How does my research on Neo4j connect with vector embeddings?"
            </p>
          </div>
          <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span>Synthesised Answer</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              "Both store structural knowledge: Neo4j holds explicit entity edges, while vector embeddings index latent semantic similarity."
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="architecture" className="py-20 lg:py-28 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono font-medium text-indigo-400">
          HOW IT WORKS
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Three steps to cognitive extension.
        </h2>
        <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          From raw friction-free capture to deep synthesis without lost context.
        </p>
      </div>

      {/* 3 Steps Navigation & Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Steps Switcher */}
        <div className="lg:col-span-6 space-y-4">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900/90 border-indigo-500/40 shadow-xl shadow-indigo-950/20'
                    : 'bg-zinc-950/30 border-white/[0.05] hover:border-white/10 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h3
                      className={`font-display text-xl font-semibold ${
                        isActive ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  {isActive && (
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                      Active Step
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-zinc-300 mb-1.5 pl-10">
                  {step.subtitle}
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed pl-10">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Interactive Visual Showcase */}
        <div className="lg:col-span-6">
          <div className="w-full h-[360px] rounded-2xl border border-white/[0.08] bg-zinc-900/80 backdrop-blur-md overflow-hidden relative shadow-2xl flex items-center justify-center">
            {/* Top Bar inside visual window */}
            <div className="absolute top-0 left-0 right-0 h-9 bg-zinc-950/80 border-b border-white/[0.06] px-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <span>PIPELINE // STEP 0{activeStep + 1}</span>
            </div>

            <div className="w-full h-full pt-9">
              {steps[activeStep].visual}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
