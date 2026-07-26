import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes, type NoteItem, type CollectionItem } from '../context/NotesContext';
import { useModal } from '../context/ModalContext';

interface CommandAction {
  id: string;
  title: string;
  category: string;
  icon: string;
  shortcut?: string;
  handler: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    notes,
    collections,
    setActiveCollection,
    setSearchQuery,
    exportMarkdown,
    importMarkdown,
    addCollection,
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

  const actions: CommandAction[] = [
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
      id: 'action-assistant',
      title: 'AI Knowledge Assistant (Flagship)',
      category: 'AI Feature',
      icon: 'psychology',
      shortcut: 'A',
      handler: () => {
        navigate('/assistant');
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
      id: 'action-new-col',
      title: 'Create New Collection',
      category: 'Actions',
      icon: 'create_new_folder',
      shortcut: 'C',
      handler: () => {
        const name = window.prompt('Enter new collection name:');
        if (name && name.trim()) {
          const col = addCollection(name.trim());
          setActiveCollection(col.id);
          navigate('/notes');
        }
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
      title: 'Open AI Chat',
      category: 'Navigation',
      icon: 'smart_toy',
      shortcut: 'T',
      handler: () => {
        navigate('/chat');
        setIsCommandPaletteOpen(false);
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

  // Fuzzy filter actions
  const filteredActions = query.trim()
    ? actions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : actions;

  // Fuzzy filter collections
  const filteredCollections = query.trim()
    ? collections.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : collections;

  // Fuzzy filter notes
  const filteredNotes = query.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.content.toLowerCase().includes(query.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : notes.slice(0, 5);

  const totalItems: (CommandAction | CollectionItem | NoteItem)[] = [
    ...filteredActions,
    ...filteredCollections,
    ...filteredNotes,
  ];

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
            (item as CommandAction).handler();
          } else if ('color' in item) {
            // CollectionItem
            setActiveCollection((item as CollectionItem).id);
            navigate('/notes');
            setIsCommandPaletteOpen(false);
          } else {
            // NoteItem
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
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
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
        className="bg-[#0c101c] border border-white/[0.1] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 space-y-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-zinc-950/80">
          <span className="material-symbols-outlined text-indigo-400 mr-3 text-xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, note, or collection..."
            className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container Grouped by Category */}
        <div className="max-h-[420px] overflow-y-auto p-2 space-y-3 scroll-hide">
          {/* Actions & Commands */}
          {filteredActions.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-500 font-bold font-mono">
                Commands & Actions
              </p>
              <div className="space-y-0.5">
                {filteredActions.map((action, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={action.id}
                      onClick={() => action.handler()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-base ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`}>
                          {action.icon}
                        </span>
                        <span className="text-xs font-semibold">{action.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {action.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Collections */}
          {filteredCollections.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-500 font-bold font-mono">
                Collections
              </p>
              <div className="space-y-0.5">
                {filteredCollections.map((col, idx) => {
                  const globalIdx = filteredActions.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const count = notes.filter((n) => n.collectionId === col.id).length;
                  return (
                    <div
                      key={col.id}
                      onClick={() => {
                        setActiveCollection(col.id);
                        navigate('/notes');
                        setIsCommandPaletteOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-base ${col.color}`}>{col.icon}</span>
                        <span className="text-xs font-semibold">{col.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {count} notes
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Knowledge Notes */}
          {filteredNotes.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-500 font-bold font-mono">
                Knowledge Notes ({filteredNotes.length})
              </p>
              <div className="space-y-0.5">
                {filteredNotes.map((note, idx) => {
                  const globalIdx = filteredActions.length + filteredCollections.length + idx;
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
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`material-symbols-outlined text-base ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`}>
                          description
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{note.title}</p>
                          <p className="text-[10px] text-zinc-400 truncate font-light">{note.summary || note.content.slice(0, 50)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-3">
                        {note.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
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
            <div className="py-12 text-center text-zinc-500">
              <span className="material-symbols-outlined text-3xl mb-2 opacity-30">find_in_page</span>
              <p className="text-xs font-medium">No results found for "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-zinc-950/80 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↵</kbd> Select</span>
          </div>
          <span>Command Palette Engine</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
