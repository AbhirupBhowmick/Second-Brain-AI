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
