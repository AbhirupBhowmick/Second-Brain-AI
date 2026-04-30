import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { openModal } = useModal();
  const [showHelp, setShowHelp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Neural Dashboard', icon: 'grid_view', path: '/' },
    { name: 'Knowledge Map', icon: 'hub', path: '/map' },
    { name: 'Cerebral Notes', icon: 'psychology', path: '/notes' },
    { name: 'AI Assistant', icon: 'smart_toy', path: '/chat' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#05080f]/80 backdrop-blur-xl border-b border-white/[0.05] z-[60] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-sm">hub</span>
          </div>
          <h1 className="text-sm font-bold text-white tracking-tight">Second Brain AI</h1>
        </div>
        {!isMobileMenuOpen && (
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav className={`bg-[#05080f]/80 backdrop-blur-3xl font-body text-sm font-medium w-72 border-r border-white/[0.05] shadow-2xl flex flex-col h-full fixed left-0 top-0 z-[70] transition-transform duration-500 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className="p-6 lg:p-8 flex items-center justify-between lg:block mb-6">
        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.15)] relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <span className="material-symbols-outlined text-primary text-xl lg:text-2xl relative z-10">hub</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm lg:text-lg font-bold text-white tracking-tight leading-none whitespace-nowrap">
              Second Brain <span className="text-primary font-light">AI</span>
            </h1>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 shrink-0 ml-2"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="px-4 mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold px-4 mb-4">Neural Systems</p>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {location.pathname === item.path && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full"></div>
                )}
                <span className={`material-symbols-outlined text-[22px] transition-all duration-500 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-6 space-y-6">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>
          <p className="text-xs text-slate-400 mb-3 relative z-10">Neural Capacity</p>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden mb-2 relative z-10">
            <div className="h-full bg-primary w-[65%] shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
          </div>
          <p className="text-[10px] text-slate-500 relative z-10">652 / 1000 Synapses used</p>
        </div>

        <button 
          onClick={openModal}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-2xl transition-all font-bold text-sm shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Project
        </button>

        <div className="flex items-center justify-between px-2 pt-2 border-t border-white/[0.05]">
          <Link to="/settings" className={`p-2 transition-colors ${location.pathname === '/settings' ? 'text-primary bg-primary/10 rounded-xl' : 'text-slate-500 hover:text-white'}`}>
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </Link>
          <button 
            onClick={() => setShowHelp(true)}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {showHelp && <HelpTour onClose={() => setShowHelp(false)} />}
      </div>
    </nav>
    </>
  );
};

const HelpTour = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const tourSteps = [
    {
      title: "Neural Dashboard",
      icon: "grid_view",
      content: "View your high-level cognitive stats. Monitor synaptic density and active projects at a glance."
    },
    {
      title: "Knowledge Map",
      icon: "hub",
      content: "Visualize your second brain. Interactive nodes show how your thoughts connect across different domains."
    },
    {
      title: "Cerebral Notes",
      icon: "psychology",
      content: "The intake manifold. Commit raw thoughts to your neural substrate. AI automatically tags and relates them."
    },
    {
      title: "AI Co-Processor",
      icon: "smart_toy",
      content: "Query your internal knowledge. The AI assistant uses your stored notes to provide context-aware answers."
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
      <div className="bg-[#0a0f1a] border border-white/10 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <header className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">{tourSteps[step].icon}</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{tourSteps[step].title}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Neural System Guide</p>
          </div>
        </header>

        <p className="text-slate-300 leading-relaxed mb-10 min-h-[80px]">
          {tourSteps[step].content}
        </p>

        <footer className="flex items-center justify-between">
          <div className="flex gap-2">
            {tourSteps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`}></div>
            ))}
          </div>
          <div className="flex gap-4">
            {step < tourSteps.length - 1 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl font-bold text-xs hover:bg-primary/30 transition-all"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Get Started
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Sidebar;
