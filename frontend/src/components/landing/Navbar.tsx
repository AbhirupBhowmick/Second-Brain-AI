import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3.5 border-b border-white/[0.08] shadow-2xl'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-indigo-500/50 group-hover:bg-indigo-950/20">
            <svg
              className="w-5 h-5 text-indigo-400 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3a9 9 0 0 0-9 9" />
              <path d="M21 12a9 9 0 0 0-9-9" />
              <path d="M12 21a9 9 0 0 0 9-9" />
              <path d="M3 12a9 9 0 0 0 9 9" />
              <line x1="12" y1="3" x2="12" y2="9" />
              <line x1="12" y1="15" x2="12" y2="21" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold text-zinc-100 tracking-tight transition-colors group-hover:text-white">
            Second Brain <span className="text-indigo-400 font-medium">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('architecture')}
            className="hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
          >
            Architecture
          </button>
          <button
            onClick={() => handleNavClick('roadmap')}
            className="hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
          >
            Roadmap
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-100 transition-colors cursor-pointer"
          >
            Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Github
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 cursor-pointer"
            >
              Go to Workspace
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-white/[0.08] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNavClick('features')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white text-base font-medium"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('architecture')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white text-base font-medium"
          >
            Architecture
          </button>
          <button
            onClick={() => handleNavClick('roadmap')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white text-base font-medium"
          >
            Roadmap
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-zinc-300 hover:text-white text-base font-medium"
          >
            Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-zinc-300 hover:text-white text-base font-medium"
          >
            Github
          </a>
          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-center"
              >
                Go to Workspace
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-200 font-medium text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-center"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
