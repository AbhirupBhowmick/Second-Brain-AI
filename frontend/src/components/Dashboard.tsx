import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import axios from 'axios';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useModal();
  const {
    notes,
    collections,
    activities,
    searchQuery,
    setSearchQuery,
    togglePinNote,
    deleteNote,
    importMarkdown,
    exportMarkdown,
    getDailySummary,
    getStorageUsedFormatted,
    setIsCommandPaletteOpen,
    isLoading,
  } = useNotes();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const recentNotes = filteredNotes.slice(0, 6);

  // AI Workspace query via Gemini API
  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    setAiResponse('');
    setAiError('');

    const contextText = notes
      .slice(0, 10)
      .map((n) => `Note Title: ${n.title}\nContent: ${n.content}`)
      .join('\n\n');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      if (baseUrl) {
        const res = await axios.post(`${baseUrl}/api/chat`, {
          prompt: `Stored Knowledge Context:\n${contextText}\n\nUser Question: ${aiPrompt}`,
        });
        if (res.data?.reply) {
          setAiResponse(res.data.reply);
        } else {
          setAiError('Unable to generate AI response. Please try again.');
        }
      } else {
        const matches = notes.filter(
          (n) =>
            n.content.toLowerCase().includes(aiPrompt.toLowerCase()) ||
            n.title.toLowerCase().includes(aiPrompt.toLowerCase())
        );
        if (matches.length > 0) {
          setAiResponse(
            `Relevant Note Context Found:\n\n• **${matches[0].title}**: "${matches[0].content.slice(0, 180)}..."`
          );
        } else if (notes.length > 0) {
          setAiResponse(
            `Found ${notes.length} notes in your workspace. Topic summary: ${notes.slice(0, 3).map((n) => `"${n.title}"`).join(', ')}.`
          );
        } else {
          setAiResponse('No notes found in your knowledge base. Create notes to query AI with context.');
        }
      }
    } catch (err: any) {
      setAiError('AI service request failed. Check server connectivity or API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        if (text) {
          await importMarkdown(text, file.name);
          navigate('/notes');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Layout>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".md,.txt"
        className="hidden"
      />

      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 relative">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-20 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold tracking-tight text-white">
              Dashboard
            </h2>
            <p className="text-zinc-400 text-sm font-normal mt-0.5">
              Welcome back, <span className="text-indigo-400 font-medium">{user?.name || 'User'}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] hover:border-indigo-500/40 text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-indigo-400">search</span>
              <span>Command Palette (⌘K)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] hover:border-white/[0.2] text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-zinc-400">file_upload</span>
              <span>Import .md</span>
            </button>

            <button
              onClick={openModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>New Note</span>
            </button>
          </div>
        </header>

        {/* Real Product Metrics Row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono font-semibold">Total Notes</p>
              <h3 className="text-2xl font-bold text-white mt-1">{notes.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono font-semibold">Collections</p>
              <h3 className="text-2xl font-bold text-white mt-1">{collections.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <span className="material-symbols-outlined text-xl">folder</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono font-semibold">Storage Used</p>
              <h3 className="text-2xl font-bold text-white mt-1">{getStorageUsedFormatted()}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-xl">hard_drive</span>
            </div>
          </div>
        </section>

        {/* AI Daily Briefing / Summary */}
        <section className="bg-zinc-900/70 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-indigo-300">
                  AI Daily Summary
                </h3>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                {getDailySummary()}
              </p>
            </div>
          </div>
        </section>

        {/* AI Assistant Workspace Box */}
        <section className="bg-zinc-900/70 border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400 text-lg">psychology</span>
              <h3 className="text-sm font-semibold text-white tracking-tight">AI Assistant Query</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Gemini Powered</span>
          </div>

          <form onSubmit={handleAiAsk} className="flex items-center gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI anything about your stored notes..."
              className="flex-1 px-4 py-3 bg-zinc-950 border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition-all cursor-pointer shrink-0 flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Asking...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
          </form>

          {aiResponse && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-sm text-zinc-200 leading-relaxed font-light animate-in fade-in duration-300">
              <p className="whitespace-pre-line">{aiResponse}</p>
            </div>
          )}

          {aiError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 animate-in fade-in duration-300">
              {aiError}
            </div>
          )}
        </section>

        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">push_pin</span>
              <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-white">
                Pinned Notes ({pinnedNotes.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4
                      onClick={() => navigate('/notes')}
                      className="text-sm font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePinNote(note.id)}
                        className="p-1 text-amber-400 hover:text-zinc-400 transition-colors cursor-pointer"
                        title="Unpin Note"
                      >
                        <span className="material-symbols-outlined text-sm">push_pin</span>
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Delete Note"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-light">
                    {note.summary || note.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Split Grid: Recent Notes vs Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Notes (2 Columns) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-lg">description</span>
                Recent Notes ({recentNotes.length})
              </h3>
              <Link
                to="/notes"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View All Notes →
              </Link>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-zinc-500 rounded-2xl bg-zinc-900/40 border border-white/[0.06]">
                <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-mono">Loading notes...</p>
              </div>
            ) : recentNotes.length > 0 ? (
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] hover:border-indigo-500/30 hover:bg-zinc-900/90 transition-all space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4
                        onClick={() => navigate('/notes')}
                        className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePinNote(note.id)}
                          className={`p-1 transition-colors cursor-pointer ${
                            note.pinned ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'
                          }`}
                          title={note.pinned ? 'Unpin' : 'Pin'}
                        >
                          <span className="material-symbols-outlined text-sm">push_pin</span>
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Delete Note"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light">
                      {note.summary || note.content}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Clean Empty State */
              <div className="p-12 text-center text-zinc-500 rounded-2xl bg-zinc-900/40 border border-white/[0.06] space-y-3">
                <span className="material-symbols-outlined text-4xl opacity-30">note_add</span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">No notes yet</p>
                  <p className="text-xs text-zinc-400 font-light">
                    Create your first note to start building your knowledge base.
                  </p>
                </div>
                <button
                  onClick={openModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Create First Note</span>
                </button>
              </div>
            )}
          </section>

          {/* Activity Timeline Column */}
          <section className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-base">history</span>
              Recent Activity
            </h3>

            {activities.length > 0 ? (
              <div className="space-y-3 border-l border-white/[0.08] ml-2 pl-4">
                {activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="relative text-xs space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-indigo-500"></div>
                    <p className="text-zinc-200 font-medium">{act.action}</p>
                    <p className="text-[11px] text-zinc-400 truncate">"{act.targetTitle}"</p>
                    <p className="text-[9px] font-mono text-zinc-500">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-500">
                <span className="material-symbols-outlined text-2xl mb-1 opacity-30">history_toggle_off</span>
                <p className="text-xs">No recent activity.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
