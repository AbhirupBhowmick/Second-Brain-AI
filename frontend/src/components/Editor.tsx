import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useNotes, type NoteItem } from '../context/NotesContext';

export const Editor: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    generateAiSummary,
    generateAiTags,
    exportMarkdown,
    searchQuery,
    setSearchQuery,
  } = useNotes();

  const [activeNote, setActiveNote] = useState<NoteItem>(() => notes[0] || {
    id: 'new',
    title: 'New Thought Node',
    content: '',
    tags: ['draft'],
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [title, setTitle] = useState(activeNote.title);
  const [content, setContent] = useState(activeNote.content);
  const [tags, setTags] = useState<string[]>(activeNote.tags);
  const [tagInput, setTagInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setTags(activeNote.tags || []);
    }
  }, [activeNote.id]);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    setSaveStatus('saving');
    if (notes.some((n) => n.id === activeNote.id)) {
      updateNote(activeNote.id, {
        title,
        content,
        tags,
      });
    } else {
      const created = addNote({
        title,
        content,
        tags,
      });
      setActiveNote(created);
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAiAutoTagAndSummarize = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      const autoTags = generateAiTags(content, title);
      const summary = generateAiSummary(content);
      setTags(Array.from(new Set([...tags, ...autoTags])));
      if (notes.some((n) => n.id === activeNote.id)) {
        updateNote(activeNote.id, { summary, tags: Array.from(new Set([...tags, ...autoTags])) });
      }
      setIsAiProcessing(false);
    }, 400);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreateNew = () => {
    const fresh: NoteItem = {
      id: 'note_' + Date.now(),
      title: 'Untitled Thought',
      content: '',
      tags: ['new'],
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveNote(fresh);
    setTitle(fresh.title);
    setContent(fresh.content);
    setTags(fresh.tags);
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#09090b]">
        {/* Editor Header */}
        <header className="px-6 lg:px-8 py-4 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center relative z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400">description</span>
              Knowledge Editor
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Ready'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAiAutoTagAndSummarize}
              disabled={isAiProcessing || !content.trim()}
              className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title="AI Auto-generate Tags & Summary"
            >
              <span className={`material-symbols-outlined text-sm ${isAiProcessing ? 'animate-spin' : ''}`}>
                {isAiProcessing ? 'refresh' : 'auto_awesome'}
              </span>
              <span className="hidden sm:inline">AI Auto-Tag</span>
            </button>

            <button
              onClick={() => exportMarkdown(activeNote)}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] hover:border-white/[0.2] text-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export Markdown"
            >
              <span className="material-symbols-outlined text-sm text-zinc-400">file_download</span>
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save</span>
            </button>
          </div>
        </header>

        {/* Main Content Split: Notes Sidebar List + Active Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
          {/* Notes Sidebar List */}
          <aside className="w-full md:w-80 bg-zinc-950/60 border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col overflow-hidden shrink-0">
            {/* Search Input */}
            <div className="p-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 bg-zinc-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs">
                <span className="material-symbols-outlined text-zinc-500 text-base">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter notes..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-2 flex items-center justify-between border-b border-white/[0.04] text-xs px-4">
              <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold">
                All Notes ({filteredNotes.length})
              </span>
              <button
                onClick={handleCreateNew}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>New</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 scroll-hide">
              {filteredNotes.map((n) => {
                const isSelected = activeNote.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => setActiveNote(n)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                        : 'hover:bg-white/[0.03] text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-white truncate">{n.title || 'Untitled'}</p>
                      {n.pinned && (
                        <span className="material-symbols-outlined text-amber-400 text-xs shrink-0">push_pin</span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 font-light">
                      {n.summary || n.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Active Note Editor Canvas */}
          <section className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-10 space-y-6">
            <div className="max-w-4xl w-full mx-auto space-y-6">
              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title..."
                className="w-full bg-transparent border-none text-2xl lg:text-4xl font-bold text-white placeholder-zinc-600 focus:ring-0 p-0 font-display tracking-tight"
              />

              {/* Tags Input Section */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-b border-white/[0.06] py-3">
                <span className="text-xs text-zinc-500 font-mono">TAGS:</span>
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-indigo-300 font-mono"
                  >
                    #{t}
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="text-zinc-500 hover:text-rose-400 text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="+ Add tag (Press Enter)"
                  className="bg-transparent text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none px-2 py-1"
                />
              </div>

              {/* Markdown Content Area */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your markdown knowledge node content here..."
                className="w-full bg-transparent border-none text-base text-zinc-200 font-normal leading-relaxed min-h-[400px] focus:ring-0 p-0 resize-none font-mono placeholder-zinc-600"
              />
            </div>

            {/* Note Delete Option */}
            {notes.some((n) => n.id === activeNote.id) && (
              <div className="max-w-4xl w-full mx-auto pt-6 border-t border-white/[0.06] flex justify-end">
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Delete Note</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default Editor;
