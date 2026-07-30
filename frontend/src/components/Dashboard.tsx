import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useNotes } from '../context/NotesContext';
import { useModal } from '../context/ModalContext';
import axios from 'axios';
import { getApiUrl } from '../config/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const {
    notes,
    collections,
    activities,
    searchQuery,
    setSearchQuery,
    activeCollection,
    addCollection,
    togglePinNote,
    deleteNote,
    importMarkdown,
    exportMarkdown,
    getDailySummary,
    getStorageUsedFormatted,
    setIsCommandPaletteOpen,
    isLoading,
    refetchNotes,
  } = useNotes();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refetchNotes) {
      refetchNotes();
    }
  }, []);

  // Filter notes by search query and active collection
  const collectionNotes = activeCollection
    ? notes.filter((n) => n.collectionId === activeCollection)
    : notes;

  const filteredNotes = collectionNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const recentNotes = filteredNotes.slice(0, 6);

  // AI Workspace query
  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    setAiResponse('');
    setAiError('');

    try {
      const res = await axios.post(getApiUrl('/api/chat'), {
        prompt: aiPrompt,
      });
      if (res.data?.reply) {
        setAiResponse(res.data.reply);
      } else {
        setAiError('Unable to generate AI response. Please try again.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 
        (err.response?.status === 401 ? 'Authentication failure (401): Invalid or missing AI API key. Please verify your environment variables.' : null) ||
        err.response?.data?.reply || 
        err.message || 
        'AI service request failed. Verify backend API connection.';
      setAiError(msg);
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

  const handleCreateCollectionPrompt = () => {
    const name = window.prompt('Enter new collection name:');
    if (name && name.trim()) {
      addCollection(name.trim());
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
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-20 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold tracking-tight text-white">
              Dashboard
            </h2>
            <p className="text-zinc-400 text-sm font-normal mt-0.5">
              Your personal AI knowledge workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/[0.08] hover:border-indigo-500/40 text-zinc-400 hover:text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-zinc-500">search</span>
              <span>Command Palette (⌘K)</span>
            </button>
          </div>
        </header>

        {/* Quick Actions — Primary actions only */}
        <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={openModal}
              className="p-3.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Note</span>
            </button>

            <button
              onClick={() => navigate('/map')}
              className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/[0.06] text-zinc-300 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-indigo-400">hub</span>
              <span>Open Graph</span>
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/[0.06] text-zinc-300 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-indigo-400">smart_toy</span>
              <span>AI Chat</span>
            </button>
          </div>
        </section>

        {/* Stat Cards — Notes, Knowledge Graph, Collections */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium">Notes</p>
              <h3 className="text-2xl font-bold text-white mt-1">{notes.length}</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800/50 border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <span className="material-symbols-outlined text-lg">description</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium">Knowledge Graph</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {notes.filter((n) => n.tags && n.tags.length > 0).length}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800/50 border border-white/[0.06] flex items-center justify-center text-indigo-400">
              <span className="material-symbols-outlined text-lg">hub</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium">Collections</p>
              <h3 className="text-2xl font-bold text-white mt-1">{collections.length}</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800/50 border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <span className="material-symbols-outlined text-lg">folder</span>
            </div>
          </div>
        </section>

        {/* AI Daily Summary — Clean 1-sentence insight card */}
        <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-5">
          <p className="text-sm text-zinc-300 font-normal leading-relaxed">
            {getDailySummary()}
          </p>
        </section>

        {/* AI Assistant Workspace */}
        <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-tight">AI Assistant</h3>
          </div>

          <form onSubmit={handleAiAsk} className="flex items-center gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI about your notes, research, code or ideas..."
              className="flex-1 px-4 py-2.5 bg-zinc-950 border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
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
            <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.06] text-sm text-zinc-200 leading-relaxed font-normal animate-in fade-in duration-300">
              <p className="whitespace-pre-line">{aiResponse}</p>
            </div>
          )}

          {aiError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 animate-in fade-in duration-300">
              {aiError}
            </div>
          )}
        </section>

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-mono font-medium text-zinc-400">
              Pinned Notes ({pinnedNotes.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.06] hover:border-zinc-700 transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4
                      onClick={() => navigate('/notes')}
                      className="text-base font-semibold text-white hover:text-indigo-400 transition-colors cursor-pointer"
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

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-normal">
                    {note.summary || note.content}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400"
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

        {/* Split Grid: Recent Notes vs Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Notes */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-mono font-medium text-zinc-400">
                Recent Notes ({recentNotes.length})
              </h3>
              <button
                onClick={() => navigate('/notes')}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                View All →
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-zinc-500 rounded-xl bg-zinc-900/40 border border-white/[0.06]">
                <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-mono">Loading notes...</p>
              </div>
            ) : recentNotes.length > 0 ? (
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.06] hover:border-zinc-700 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4
                        onClick={() => navigate('/notes')}
                        className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors cursor-pointer"
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

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                      {note.summary || note.content}
                    </p>

                    <div className="flex items-center justify-between pt-2">
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
              <div className="p-12 text-center text-zinc-500 rounded-xl bg-zinc-900/40 border border-white/[0.06] space-y-3">
                <p className="text-sm font-medium text-white">No notes in this scope.</p>
                <button
                  onClick={openModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Create Note</span>
                </button>
              </div>
            )}
          </section>

          {/* Activity Column — Simplified max 5 items without timeline styling */}
          <section className="bg-zinc-900/40 border border-white/[0.06] rounded-xl p-5 space-y-3 h-fit">
            <h3 className="text-xs uppercase tracking-wider font-mono font-medium text-zinc-400">
              Recent Activity
            </h3>

            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04] last:border-0">
                    <div className="min-w-0 pr-2">
                      <span className="text-zinc-200 font-medium">{act.action}</span>
                      <span className="text-zinc-400 font-light truncate ml-1.5">"{act.targetTitle}"</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No recent activity.</p>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
