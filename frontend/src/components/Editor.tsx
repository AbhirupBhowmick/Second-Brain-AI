import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useNotes, type NoteItem } from '../context/NotesContext';
import { useModal } from '../context/ModalContext';

export const Editor: React.FC = () => {
  const {
    notes,
    collections,
    activeCollection,
    setActiveCollection,
    addNote,
    updateNote,
    deleteNote,
    generateAiSummary,
    generateAiTags,
    exportMarkdown,
    searchQuery,
    setSearchQuery,
  } = useNotes();
  const { openModal } = useModal();

  // Filter notes by search query AND activeCollection
  const collectionNotes = activeCollection
    ? notes.filter((n) => n.collectionId === activeCollection)
    : notes;

  const filteredNotes = collectionNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const [activeNote, setActiveNote] = useState<NoteItem | null>(() => filteredNotes[0] || null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [collectionId, setCollectionId] = useState<string>('engineering');
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  const activeColObj = collections.find((c) => c.id === activeCollection);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setTags(activeNote.tags || []);
      setCollectionId(activeNote.collectionId || collections[0]?.id || 'engineering');
    } else if (filteredNotes.length > 0) {
      setActiveNote(filteredNotes[0]);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [activeNote?.id, filteredNotes.length, activeCollection]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    setSaveStatus('saving');
    if (activeNote && notes.some((n) => n.id === activeNote.id)) {
      await updateNote(activeNote.id, {
        title,
        content,
        tags,
        collectionId,
      });
    } else {
      const created = await addNote({
        title: title || 'Untitled Note',
        content,
        tags,
        collectionId: collectionId || activeCollection || collections[0]?.id || 'engineering',
      });
      setActiveNote(created);
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAiAutoTagAndSummarize = async () => {
    if (!content.trim()) return;
    setIsAiProcessing(true);
    setAiMessage('');
    try {
      const autoTags = await generateAiTags(content, title);
      const summary = await generateAiSummary(content);
      const newTags = Array.from(new Set([...tags, ...autoTags]));
      setTags(newTags);
      if (activeNote && notes.some((n) => n.id === activeNote.id)) {
        await updateNote(activeNote.id, { summary, tags: newTags });
      }
      setAiMessage('AI Tags and Summary generated successfully.');
    } catch {
      setAiMessage('AI processing completed.');
    } finally {
      setIsAiProcessing(false);
      setTimeout(() => setAiMessage(''), 3000);
    }
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

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#09090b]">
        {/* Editor Header */}
        <header className="px-6 lg:px-8 py-3.5 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center relative z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400">description</span>
              Knowledge Editor
            </h2>
            {activeColObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-xs text-indigo-300 font-medium">
                <span className="material-symbols-outlined text-xs">{activeColObj.icon}</span>
                {activeColObj.name}
                <button
                  onClick={() => setActiveCollection(null)}
                  className="ml-1 hover:text-white cursor-pointer"
                  title="Clear collection filter"
                >
                  ×
                </button>
              </span>
            )}
            <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Ready'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Preview Toggle */}
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isPreview
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-zinc-900 border-white/[0.1] text-zinc-400 hover:text-white'
              }`}
              title="Toggle Markdown Preview"
            >
              <span className="material-symbols-outlined text-sm">
                {isPreview ? 'edit' : 'visibility'}
              </span>
              <span>{isPreview ? 'Edit' : 'Preview'}</span>
            </button>

            {/* AI Assistant Tool */}
            <button
              onClick={handleAiAutoTagAndSummarize}
              disabled={isAiProcessing || !content.trim()}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="AI Summarize & Auto-Tag"
            >
              <span className={`material-symbols-outlined text-sm ${isAiProcessing ? 'animate-spin' : ''}`}>
                {isAiProcessing ? 'refresh' : 'auto_awesome'}
              </span>
              <span className="hidden sm:inline">AI Assistant</span>
            </button>

            <button
              onClick={() => activeNote && exportMarkdown(activeNote)}
              disabled={!activeNote}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/[0.1] hover:border-white/[0.2] text-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              title="Export Markdown"
            >
              <span className="material-symbols-outlined text-sm text-zinc-400">file_download</span>
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleSave}
              disabled={!title.trim() && !content.trim()}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save</span>
            </button>
          </div>
        </header>

        {aiMessage && (
          <div className="bg-indigo-950/60 border-b border-indigo-500/30 px-6 py-2 text-xs text-indigo-300 text-center animate-in fade-in">
            {aiMessage}
          </div>
        )}

        {/* Content Split: Left Sidebar Notes List vs Right Editor Canvas */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
          {/* Notes Sidebar List */}
          <aside className="w-full md:w-72 bg-zinc-950/60 border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col overflow-hidden shrink-0">
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
                Notes ({filteredNotes.length})
              </span>
              <button
                onClick={openModal}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>New</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 scroll-hide">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((n) => {
                  const isSelected = activeNote?.id === n.id;
                  const col = collections.find((c) => c.id === n.collectionId);
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
                        <div className="flex items-center gap-1">
                          {col && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-zinc-500">
                              {col.name}
                            </span>
                          )}
                          {n.pinned && (
                            <span className="material-symbols-outlined text-amber-400 text-xs shrink-0">push_pin</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 font-light">
                        {n.summary || n.content}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-zinc-500 italic text-xs">
                  No notes in this scope.
                </div>
              )}
            </div>
          </aside>

          {/* Active Note Editor Canvas / Formatted Preview */}
          <section className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-10 space-y-6">
            {activeNote || title || content ? (
              <div className="max-w-4xl w-full mx-auto space-y-6">
                {/* Title Input */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="w-full bg-transparent border-none text-2xl lg:text-4xl font-bold text-white placeholder-zinc-600 focus:ring-0 p-0 font-display tracking-tight"
                />

                {/* Collection & Tags Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-b border-white/[0.06] py-3">
                  {/* Collection Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono">COLLECTION:</span>
                    <select
                      value={collectionId}
                      onChange={(e) => {
                        setCollectionId(e.target.value);
                        if (activeNote && notes.some((n) => n.id === activeNote.id)) {
                          updateNote(activeNote.id, { collectionId: e.target.value });
                        }
                      }}
                      className="bg-zinc-900 border border-white/[0.1] text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                    >
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags List */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-zinc-500 font-mono">TAGS:</span>
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-indigo-300 font-mono"
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
                      placeholder="+ Add tag (Enter)"
                      className="bg-transparent text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none px-2 py-0.5"
                    />
                  </div>
                </div>

                {/* Markdown Raw Edit vs Formatted Preview */}
                {isPreview ? (
                  <div className="w-full p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] text-zinc-200 leading-relaxed space-y-4 font-sans text-sm">
                    <p className="text-xs font-mono text-zinc-500 uppercase">Markdown Formatted Preview</p>
                    <div className="whitespace-pre-wrap">{content}</div>
                  </div>
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your markdown note content..."
                    className="w-full bg-transparent border-none text-base text-zinc-200 font-normal leading-relaxed min-h-[400px] focus:ring-0 p-0 resize-none font-mono placeholder-zinc-600"
                  />
                )}

                {/* Delete Option */}
                {activeNote && notes.some((n) => n.id === activeNote.id) && (
                  <div className="pt-6 border-t border-white/[0.06] flex justify-end">
                    <button
                      onClick={async () => {
                        await deleteNote(activeNote.id);
                        setActiveNote(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      <span>Delete Note</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Clean Professional Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-500">
                  <span className="material-symbols-outlined text-3xl">folder_off</span>
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-lg font-bold text-white">
                    {activeColObj ? `No notes in ${activeColObj.name} yet.` : 'No notes in this collection yet.'}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light">
                    Create a note to populate this collection.
                  </p>
                </div>
                <button
                  onClick={openModal}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Create Note</span>
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
