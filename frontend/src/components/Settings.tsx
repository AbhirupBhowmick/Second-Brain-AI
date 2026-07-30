import React, { useState } from 'react';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'display' | 'theme' | 'workspace' | 'preferences' | 'danger'>('profile');
  const [displayName, setDisplayName] = useState(user?.name || 'Knowledge Architect');
  const [email] = useState(user?.email || 'architect@secondbrain.ai');
  const [themeMode, setThemeMode] = useState<'dark' | 'midnight' | 'oled'>('dark');
  const [displayDensity, setDisplayDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [autoSaveNotes, setAutoSaveNotes] = useState(true);
  const [aiDetailLevel, setAiDetailLevel] = useState<'concise' | 'detailed'>('concise');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearSubstrate = () => {
    try {
      localStorage.removeItem('sb_notes_v2');
      localStorage.removeItem('sb_activities');
      localStorage.removeItem('sb_collections_v1');
      localStorage.removeItem('sb_active_collection');
      setShowClearConfirm(false);
      alert('Local workspace state reset successfully.');
      window.location.reload();
    } catch {
      // fallback
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'display', label: 'Display', icon: 'desktop_windows' },
    { id: 'theme', label: 'Theme', icon: 'palette' },
    { id: 'workspace', label: 'Workspace', icon: 'folder' },
    { id: 'preferences', label: 'Preferences', icon: 'tune' },
    { id: 'danger', label: 'Danger Zone', icon: 'warning' },
  ] as const;

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full overflow-y-auto px-6 py-8 lg:px-16 bg-[#09090b]">
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-16">
          {/* Header */}
          <header className="border-b border-white/[0.06] pb-4">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight">
              Settings
            </h2>
            <p className="text-xs text-zinc-400 font-normal mt-0.5">
              Customize your profile, workspace presentation, and personal preferences.
            </p>
          </header>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-white/[0.06] pb-2 overflow-x-auto hide-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-6 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-semibold text-white">Profile Information</h3>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-base text-indigo-300">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-zinc-400">{email}</p>
                </div>
              </div>

              <div className="space-y-4 max-w-md pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-white/[0.08] rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2 bg-zinc-950/50 border border-white/[0.04] rounded-lg text-xs text-zinc-500 cursor-not-allowed"
                  />
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </section>
          )}

          {/* Tab 2: Display */}
          {activeTab === 'display' && (
            <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-6 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-semibold text-white">Display & Density</h3>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-300 font-medium">Layout Density</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDisplayDensity('comfortable')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        displayDensity === 'comfortable'
                          ? 'border-indigo-500/40 bg-indigo-600/10 text-white'
                          : 'border-white/[0.06] bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="font-medium text-white mb-1">Comfortable</div>
                      <div className="text-[11px] text-zinc-400">Spacious padding and card layout</div>
                    </button>

                    <button
                      onClick={() => setDisplayDensity('compact')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        displayDensity === 'compact'
                          ? 'border-indigo-500/40 bg-indigo-600/10 text-white'
                          : 'border-white/[0.06] bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="font-medium text-white mb-1">Compact</div>
                      <div className="text-[11px] text-zinc-400">Higher information density</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
                >
                  Save Display Preferences
                </button>
              </div>
            </section>
          )}

          {/* Tab 3: Theme */}
          {activeTab === 'theme' && (
            <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-6 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-semibold text-white">Appearance Theme</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    themeMode === 'dark'
                      ? 'border-indigo-500/40 bg-zinc-900 text-white'
                      : 'border-white/[0.06] bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-full h-12 rounded-lg bg-[#09090b] border border-white/10 mb-3" />
                  <p className="text-xs font-medium text-white">Dark Default</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Sleek graphite dark mode</p>
                </button>

                <button
                  onClick={() => setThemeMode('midnight')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    themeMode === 'midnight'
                      ? 'border-indigo-500/40 bg-zinc-900 text-white'
                      : 'border-white/[0.06] bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-full h-12 rounded-lg bg-[#0a0c16] border border-indigo-500/20 mb-3" />
                  <p className="text-xs font-medium text-white">Midnight</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Deep indigo tint</p>
                </button>

                <button
                  onClick={() => setThemeMode('oled')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    themeMode === 'oled'
                      ? 'border-indigo-500/40 bg-zinc-900 text-white'
                      : 'border-white/[0.06] bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-full h-12 rounded-lg bg-black border border-white/10 mb-3" />
                  <p className="text-xs font-medium text-white">OLED Pure Black</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">True black contrast</p>
                </button>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                Apply Theme
              </button>
            </section>
          )}

          {/* Tab 4: Workspace */}
          {activeTab === 'workspace' && (
            <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-6 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-semibold text-white">Workspace Settings</h3>

              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <div>
                    <p className="text-xs font-medium text-white">Auto-save Notes</p>
                    <p className="text-[11px] text-zinc-400">Save edits continuously while typing</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSaveNotes}
                    onChange={(e) => setAutoSaveNotes(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-950 border-white/10 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
                >
                  Save Workspace Settings
                </button>
              </div>
            </section>
          )}

          {/* Tab 5: Preferences */}
          {activeTab === 'preferences' && (
            <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-6 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-semibold text-white">AI & Reasoning Preferences</h3>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-300 font-medium">AI Response Synthesis Detail</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAiDetailLevel('concise')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        aiDetailLevel === 'concise'
                          ? 'border-indigo-500/40 bg-indigo-600/10 text-white'
                          : 'border-white/[0.06] bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="font-medium text-white mb-1">Concise</div>
                      <div className="text-[11px] text-zinc-400">Direct 1-2 sentence answers</div>
                    </button>

                    <button
                      onClick={() => setAiDetailLevel('detailed')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        aiDetailLevel === 'detailed'
                          ? 'border-indigo-500/40 bg-indigo-600/10 text-white'
                          : 'border-white/[0.06] bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="font-medium text-white mb-1">Detailed</div>
                      <div className="text-[11px] text-zinc-400">Full contextual breakdown</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
                >
                  Save AI Preferences
                </button>
              </div>
            </section>
          )}

          {/* Tab 6: Danger Zone */}
          {activeTab === 'danger' && (
            <section className="p-6 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono">
                Danger Zone
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-0.5">Reset Local Workspace</h4>
                  <p className="text-xs text-zinc-400">
                    Clear local workspace cache and restore default state.
                  </p>
                </div>
                {!showClearConfirm ? (
                  <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0"
                  >
                    Reset Workspace
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={handleClearSubstrate}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-500 transition-all cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                    <button 
                      onClick={() => setShowClearConfirm(false)}
                      className="px-4 py-2 bg-zinc-900 text-zinc-300 border border-white/10 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium animate-in fade-in">
              Preferences updated successfully.
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Settings;
