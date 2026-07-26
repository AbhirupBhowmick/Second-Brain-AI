import React from 'react';

const SocialProofSection: React.FC = () => {
  const techLogos = [
    { name: 'React', label: 'React 19', color: '#61DAFB' },
    { name: 'Spring Boot', label: 'Spring Boot', color: '#6DB33F' },
    { name: 'Neo4j', label: 'Neo4j Graph', color: '#018BFF' },
    { name: 'Tailwind CSS', label: 'Tailwind CSS', color: '#38BDF8' },
    { name: 'GSAP', label: 'GSAP Motion', color: '#88CE02' },
    { name: 'JWT Auth', label: 'JWT Security', color: '#A855F7' },
  ];

  return (
    <section className="py-12 border-y border-white/[0.06] bg-zinc-950/40 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest font-mono text-zinc-500 font-medium mb-8">
          Built using modern engineering
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
          {techLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-zinc-900/40 border border-white/[0.05] hover:border-white/[0.12] hover:bg-zinc-900/80 transition-all duration-300 group cursor-default"
            >
              <div
                className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: logo.color }}
              />
              <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {logo.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
