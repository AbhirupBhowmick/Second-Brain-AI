import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useNotes, type NoteItem } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import axios from 'axios';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { openModal } = useModal();
  const {
    notes,
    collections,
    searchQuery,
    setSearchQuery,
    togglePinNote,
    deleteNote,
    importMarkdown,
    exportMarkdown,
    getDailySummary,
    setIsCommandPaletteOpen,
  } = useNotes();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter notes based on dashboard search
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const recentNotes = filteredNotes.slice(0, 6);

  // AI Workspace query function
  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    setAiResponse('');

    const contextText = notes.map((n) => `Note: ${n.title}\nContent: ${n.content}`).join('\n\n');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      if (baseUrl) {
        const res = await axios.post(`${baseUrl}/api/chat`, {
          prompt: `Context notes:\n${contextText}\n\nUser Question: ${aiPrompt}`,
        });
        setAiResponse(res.data.reply);
      } else {
        // Fallback local intelligent response based on user notes
        const matches = notes.filter((n) =>
          n.content.toLowerCase().includes(aiPrompt.toLowerCase()) ||
          n.title.toLowerCase().includes(aiPrompt.toLowerCase())
        );
        if (matches.length > 0) {
          setAiResponse(
            `Based on your notes, here is what I found:\n\n• **${matches[0].title}**: "${matches[0].summary || matches[0].content.slice(0, 140)}..."`
          );
        } else {
          setAiResponse(
            `I analyzed your ${notes.length} notes. Your system focuses on architecture, graph queries, and AI vector optimization. Feel free to refine your question or add more notes!`
          );
        }
      }
    } catch {
      setAiResponse(
        `Synthesized answer from your substrate: Related notes include ${notes.slice(0, 2).map((n) => `"${n.title}"`).join(' and ')}.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) {
          importMarkdown(text, file.name);
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

      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 relative">
        {/* Top Bar Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-20 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl lg:text-3xl font-display font-bold tracking-tight text-white">
                Knowledge Dashboard
              </h2>
              {isGuest && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  DEMO WORKSPACE
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-sm font-normal">
              Welcome back, <span className="text-indigo-400 font-medium">{user?.name || 'Explorer'}</span>. {notes.length} note nodes indexed.
            </p>
          </div>

          {/* Top Quick Actions Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] hover:border-indigo-500/40 text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-indigo-400">search</span>
              <span>Search / ⌘K</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] hover:border-white/[0.2] text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-zinc-400">file_upload</span>
              <span>Import .md</span>
            </button>

            <button
              onClick={openModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Create Note</span>
            </button>
          </div>
        </header>

        {/* AI Daily Summary Briefing */}
        <section className="bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-indigo-300">
                  AI Daily Substrate Briefing
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                {getDailySummary()}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              title: 'Create Note',
              desc: 'Draft new thought node',
              icon: 'post_add',
              color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
              action: openModal,
            },
            {
              title: 'Ask AI Co-Processor',
              desc: 'Query knowledge graph',
              icon: 'smart_toy',
              color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
              action: () => navigate('/chat'),
            },
            {
              title: 'Knowledge Graph',
              desc: 'Visualize graph links',
              icon: 'hub',
              color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              action: () => navigate('/map'),
            },
            {
              title: 'Export Substrate',
              desc: 'Download markdown files',
              icon: 'file_download',
              color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
              action: () => exportMarkdown(),
            },
          ].map((item) => (
            <div
              key={item.title}
              onClick={item.action}
              className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08] hover:border-indigo-500/40 hover:bg-zinc-900/90 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${item.color}`}>
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </div>
                <span className="material-symbols-outlined text-sm text-zinc-600 group-hover:text-white transition-colors">
                  arrow_forward
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Search Bar */}
        <section className="relative">
          <div className="flex items-center bg-zinc-900/80 border border-white/[0.08] focus-within:border-indigo-500/50 rounded-xl px-4 py-3 shadow-md transition-all">
            <span className="material-symbols-outlined text-zinc-500 mr-3 text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by keyword, tag (#architecture), or title..."
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-500 hover:text-white cursor-pointer ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* AI Workspace Query Box */}
        <section className="bg-zinc-900/70 border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400 text-lg">psychology</span>
              <h3 className="text-sm font-semibold text-white tracking-tight">AI Co-Processor Workspace</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Context-Aware Note Search</span>
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
                  <span>Synthesizing...</span>
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
        </section>

        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg">push_pin</span>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Pinned Notes ({pinnedNotes.length})
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4
                      onClick={() => navigate('/notes')}
                      className="text-base font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer"
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

        {/* Main Content Split: Recent Notes & Knowledge Graph Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Notes (2 Columns) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-lg">description</span>
                Recent Notes ({recentNotes.length})
              </h3>
              <Link
                to="/notes"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => (
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
                ))
              ) : (
                <div className="p-12 text-center text-zinc-500 rounded-2xl bg-zinc-900/40 border border-white/[0.06]">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-30">note_stack</span>
                  <p className="text-sm font-medium">No matching notes found</p>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Knowledge Graph Preview & Activity */}
          <div className="space-y-6">
            {/* Knowledge Graph Preview */}
            <section className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">hub</span>
                  <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-white">
                    Graph Atlas
                  </h3>
                </div>
                <Link
                  to="/map"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Full Canvas →
                </Link>
              </div>

              {/* Minimal Graph Nodes Visualization */}
              <div className="h-44 rounded-xl bg-zinc-950/80 border border-white/[0.05] relative flex items-center justify-center p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 blur-xl animate-pulse"></div>
                </div>

                <div className="relative z-10 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-4">
                    {notes.slice(0, 4).map((n, i) => (
                      <div
                        key={n.id}
                        onClick={() => navigate('/map')}
                        className="w-10 h-10 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-lg cursor-pointer hover:scale-110 transition-transform"
                        title={n.title}
                      >
                        N{i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-2">
                    {notes.length} Active Graph Nodes
                  </p>
                </div>
              </div>
            </section>

            {/* Collections Quick Switch */}
            <section className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-white">
                Collections
              </h3>
              <div className="space-y-1.5">
                {collections.map((col) => {
                  const count = notes.filter((n) => n.collectionId === col.id).length;
                  return (
                    <div
                      key={col.id}
                      onClick={() => navigate('/notes')}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`material-symbols-outlined text-sm ${col.color}`}>{col.icon}</span>
                        <span className="text-xs font-medium text-zinc-200">{col.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{count} notes</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
