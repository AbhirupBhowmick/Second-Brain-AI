import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes, type NoteItem } from '../context/NotesContext';
import { useModal } from '../context/ModalContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    notes,
    setSearchQuery,
    exportMarkdown,
    importMarkdown
  } = useNotes();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: 'action-new',
      title: 'Create New Note',
      category: 'Actions',
      icon: 'edit_note',
      shortcut: 'N',
      handler: () => {
        openModal();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-graph',
      title: 'Explore Knowledge Graph',
      category: 'Navigation',
      icon: 'hub',
      shortcut: 'G',
      handler: () => {
        navigate('/map');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-chat',
      title: 'Ask AI Co-Processor',
      category: 'Navigation',
      icon: 'smart_toy',
      shortcut: 'C',
      handler: () => {
        navigate('/chat');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-import',
      title: 'Import Markdown (.md)',
      category: 'Actions',
      icon: 'file_upload',
      shortcut: 'I',
      handler: () => {
        fileInputRef.current?.click();
      },
    },
    {
      id: 'action-export',
      title: 'Export Notes as Markdown',
      category: 'Actions',
      icon: 'file_download',
      shortcut: 'E',
      handler: () => {
        exportMarkdown();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-settings',
      title: 'Open Settings',
      category: 'Navigation',
      icon: 'settings',
      shortcut: 'S',
      handler: () => {
        navigate('/settings');
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  const filteredNotes = query.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.content.toLowerCase().includes(query.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : notes.slice(0, 5);

  const filteredActions = query.trim()
    ? actions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : actions;

  const totalItems = [...filteredActions, ...filteredNotes];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems.length) % Math.max(1, totalItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (totalItems.length > 0) {
        const item = totalItems[selectedIndex];
        if (item) {
          if ('handler' in item) {
            (item as any).handler();
          } else {
            // Note item selected
            setSearchQuery((item as NoteItem).title);
            navigate('/notes');
            setIsCommandPaletteOpen(false);
          }
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          importMarkdown(text, file.name);
          navigate('/notes');
          setIsCommandPaletteOpen(false);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".md,.txt"
        className="hidden"
      />

      <div
        className="bg-[#0c101c] border border-white/[0.1] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="material-symbols-outlined text-indigo-400 mr-3 text-xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search notes..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4 scroll-hide">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Actions & Commands
              </p>
              <div className="space-y-1">
                {filteredActions.map((action, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={action.id}
                      onClick={() => action.handler()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                          {action.icon}
                        </span>
                        <span className="text-sm font-medium">{action.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {action.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Knowledge Notes ({filteredNotes.length})
              </p>
              <div className="space-y-1">
                {filteredNotes.map((note, idx) => {
                  const globalIdx = filteredActions.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSearchQuery(note.title);
                        navigate('/notes');
                        setIsCommandPaletteOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                          description
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{note.title}</p>
                          <p className="text-[11px] text-slate-400 truncate font-light">{note.summary || note.content.slice(0, 60)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-3">
                        {note.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalItems.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-3xl mb-2 opacity-30">find_in_page</span>
              <p className="text-sm font-medium">No commands or notes found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↵</kbd> Select</span>
          </div>
          <span>Second Brain Command Engine</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
