import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useNotes } from '../context/NotesContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, logout } = useAuth();
  const { openModal } = useModal();
  const {
    collections,
    activeCollection,
    setActiveCollection,
    setIsCommandPaletteOpen,
    notes
  } = useNotes();
  const [showHelp, setShowHelp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
    { name: 'Knowledge Graph', icon: 'hub', path: '/map' },
    { name: 'AI Chat', icon: 'smart_toy', path: '/chat' },
    { name: 'Notes', icon: 'description', path: '/notes', count: notes.length },
    { name: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.08] z-[60] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <span className="material-symbols-outlined text-indigo-400 text-sm">hub</span>
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
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[55] animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav className={`bg-[#09090b] font-body text-sm font-medium w-64 border-r border-white/[0.08] shadow-2xl flex flex-col h-full fixed left-0 top-0 z-[70] transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      {/* Workspace Brand */}
      <div className="p-5 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-md relative overflow-hidden group shrink-0">
            <span className="material-symbols-outlined text-indigo-400 text-xl">hub</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight truncate">
              Second Brain <span className="text-indigo-400 font-medium">AI</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono truncate">Knowledge Substrate</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10 shrink-0 ml-2"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      {/* Command Palette Trigger */}
      <div className="p-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] hover:border-indigo-500/40 text-zinc-400 hover:text-white transition-all text-xs group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-zinc-500 group-hover:text-indigo-400 transition-colors">search</span>
            <span>Search & Commands...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white/5 border border-white/10 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-3 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-3 py-1">Navigation</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-lg ${location.pathname === item.path ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                    {item.icon}
                  </span>
                  <span className="text-xs tracking-wide">{item.name}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Collections Section */}
      <div className="px-3 mt-5 space-y-1">
        <div className="flex items-center justify-between px-3 py-1">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Collections</p>
          {activeCollection && (
            <button
              onClick={() => setActiveCollection(null)}
              className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
        <ul className="space-y-0.5">
          {collections.map((col) => {
            const isSelected = activeCollection === col.id;
            return (
              <li key={col.id}>
                <button
                  onClick={() => {
                    setActiveCollection(isSelected ? null : col.id);
                    if (location.pathname !== '/notes') navigate('/notes');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.08] text-white font-medium border border-white/10'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-sm ${col.color}`}>{col.icon}</span>
                    <span className="truncate">{col.name}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer / User Session */}
      <div className="mt-auto p-4 space-y-3 border-t border-white/[0.06]">
        <button 
          onClick={openModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-semibold text-xs shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Note
        </button>

        {/* User profile section */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
            {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'GU')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Guest User'}</p>
            </div>
            <p className="text-[10px] text-zinc-500 truncate">{user?.email || 'guest@secondbrain.ai'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-base">logout</span>
          </button>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Sidebar;
