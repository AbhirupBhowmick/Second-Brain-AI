import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950/80 pt-16 pb-12 px-6 lg:px-8 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3a9 9 0 0 0-9 9" />
                <path d="M21 12a9 9 0 0 0-9-9" />
                <path d="M12 21a9 9 0 0 0 9-9" />
              </svg>
            </div>
            <span className="font-display text-base font-bold text-white tracking-tight">
              Second Brain <span className="text-indigo-400 font-medium">AI</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-normal">
            The intelligent cognitive workspace that combines knowledge graphs, semantic memory, and conversational AI into a permanent extension of your mind.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
            Product
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">
                Features
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('architecture')} className="hover:text-white transition-colors cursor-pointer">
                Architecture
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('live-demo')} className="hover:text-white transition-colors cursor-pointer">
                Live Preview
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('roadmap')} className="hover:text-white transition-colors cursor-pointer">
                Roadmap
              </button>
            </li>
          </ul>
        </div>

        {/* Engineering & Resources */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
            Resources
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Github Repository
              </a>
            </li>
            <li>
              <a href="https://neo4j.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Neo4j Integration
              </a>
            </li>
            <li>
              <a href="https://spring.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Spring Boot API
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
            Legal & Social
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="mailto:support@secondbrain.ai" className="hover:text-white transition-colors">Contact Support</a>
            </li>
            <li className="pt-2 flex items-center gap-3">
              {/* Twitter / X */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Github */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
        <div>© {new Date().getFullYear()} Second Brain AI Inc. All rights reserved.</div>
        <div>Engineered with precision for human minds.</div>
      </div>
    </footer>
  );
};

export default Footer;
