import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  collectionId: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  targetTitle: string;
  timestamp: string;
}

interface NotesContextType {
  notes: NoteItem[];
  collections: CollectionItem[];
  activities: ActivityItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCollection: string | null;
  setActiveCollection: (id: string | null) => void;
  addCollection: (name: string, icon?: string, color?: string) => CollectionItem;
  updateCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refetchNotes: () => Promise<void>;
  addNote: (note: Partial<NoteItem>) => Promise<NoteItem>;
  updateNote: (id: string, note: Partial<NoteItem>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => void;
  generateAiSummary: (content: string) => Promise<string>;
  generateAiTags: (content: string, title?: string) => Promise<string[]>;
  importMarkdown: (fileContent: string, fileName: string) => Promise<NoteItem>;
  exportMarkdown: (note?: NoteItem) => void;
  getDailySummary: () => string;
  getStorageUsedFormatted: () => string;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const DEFAULT_COLLECTIONS: CollectionItem[] = [
  { id: 'engineering', name: 'Engineering', icon: 'terminal', color: 'text-indigo-400' },
  { id: 'ai-research', name: 'AI Research', icon: 'psychology', color: 'text-cyan-400' },
  { id: 'product', name: 'Product', icon: 'lightbulb', color: 'text-amber-400' },
  { id: 'personal', name: 'Personal', icon: 'person', color: 'text-emerald-400' },
];

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    const saved = localStorage.getItem('sb_collections_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_COLLECTIONS;
  });

  const [activeCollection, setActiveCollectionState] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const colParam = params.get('collection');
    if (colParam) return colParam;
    return localStorage.getItem('sb_active_collection');
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('sb_notes_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('sb_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync active collection to local storage and URL
  const setActiveCollection = (colId: string | null) => {
    setActiveCollectionState(colId);
    if (colId) {
      localStorage.setItem('sb_active_collection', colId);
      const url = new URL(window.location.href);
      url.searchParams.set('collection', colId);
      window.history.replaceState({}, '', url.toString());
    } else {
      localStorage.removeItem('sb_active_collection');
      const url = new URL(window.location.href);
      url.searchParams.delete('collection');
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    localStorage.setItem('sb_collections_v1', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('sb_notes_v2', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('sb_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (action: string, targetTitle: string) => {
    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      action,
      targetTitle,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  const addCollection = (name: string, icon = 'folder', color = 'text-indigo-400'): CollectionItem => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || 'col-' + Date.now();
    const newCol: CollectionItem = {
      id,
      name,
      icon,
      color,
    };
    setCollections((prev) => [...prev, newCol]);
    addActivity('Created collection', name);
    return newCol;
  };

  const updateCollection = (id: string, name: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
    addActivity('Updated collection', name);
  };

  const deleteCollection = (id: string) => {
    const target = collections.find((c) => c.id === id);
    if (target) {
      addActivity('Deleted collection', target.name);
    }
    const remaining = collections.filter((c) => c.id !== id);
    setCollections(remaining);
    const fallbackColId = remaining[0]?.id || 'engineering';
    // Reassign notes belonging to deleted collection
    setNotes((prev) =>
      prev.map((n) => (n.collectionId === id ? { ...n, collectionId: fallbackColId } : n))
    );
    if (activeCollection === id) {
      setActiveCollection(null);
    }
  };

  const refetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    const baseUrl = import.meta.env.VITE_API_URL || '';
    if (!baseUrl) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${baseUrl}/api/notes`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const mapped: NoteItem[] = res.data.map((item: any) => ({
          id: String(item.id),
          title: item.title || 'Untitled Note',
          content: item.content || '',
          summary: item.summary || '',
          tags: Array.isArray(item.tags) ? item.tags : ['general'],
          collectionId: item.collectionId || 'engineering',
          pinned: false,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        }));
        setNotes(mapped);
      }
    } catch (err: any) {
      console.warn('Backend fetch notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchNotes();
  }, []);

  // Global hotkey Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const generateAiSummary = async (content: string): Promise<string> => {
    if (!content.trim()) return 'No content to summarize.';
    const baseUrl = import.meta.env.VITE_API_URL || '';
    if (baseUrl) {
      try {
        const res = await axios.post(`${baseUrl}/api/chat`, {
          prompt: `Summarize the following note concisely in 2 sentences:\n\n${content}`,
        });
        if (res.data?.reply) return res.data.reply;
      } catch {
        // fallback to extractive summary
      }
    }
    const clean = content.replace(/[#*`\-[\]]/g, '').trim();
    const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
    return sentences.slice(0, 2).join(' ') || clean.slice(0, 140);
  };

  const generateAiTags = async (content: string, title: string = ''): Promise<string[]> => {
    const text = `${title} ${content}`.toLowerCase();
    const candidates = [
      'architecture', 'backend', 'frontend', 'ai', 'graph', 'react',
      'neo4j', 'spring', 'database', 'vector', 'search', 'ux', 'llm',
      'optimization', 'performance', 'markdown', 'security', 'api'
    ];
    const tags = candidates.filter((word) => text.includes(word));
    return tags.length > 0 ? tags.slice(0, 4) : ['general'];
  };

  const addNote = async (partialNote: Partial<NoteItem>): Promise<NoteItem> => {
    const newTitle = partialNote.title || 'Untitled Note';
    const newContent = partialNote.content || '';
    const newNote: NoteItem = {
      id: 'note_' + Date.now(),
      title: newTitle,
      content: newContent,
      summary: partialNote.summary || (newContent ? newContent.slice(0, 140) : 'No content.'),
      tags: partialNote.tags || ['note'],
      collectionId: partialNote.collectionId || activeCollection || collections[0]?.id || 'engineering',
      pinned: partialNote.pinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    addActivity('Created note', newTitle);

    const baseUrl = import.meta.env.VITE_API_URL || '';
    if (baseUrl) {
      try {
        const res = await axios.post(`${baseUrl}/api/notes`, {
          title: newNote.title,
          content: newNote.content,
          collectionId: newNote.collectionId,
        });
        if (res.data?.id) {
          setNotes((prev) =>
            prev.map((n) => (n.id === newNote.id ? { ...n, id: String(res.data.id) } : n))
          );
        }
      } catch (err) {
        console.warn('Backend sync note creation notice:', err);
      }
    }

    return newNote;
  };

  const updateNote = async (id: string, partialNote: Partial<NoteItem>) => {
    let updatedTitle = '';
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          updatedTitle = partialNote.title ?? n.title;
          return {
            ...n,
            ...partialNote,
            updatedAt: new Date().toISOString(),
          };
        }
        return n;
      })
    );

    if (updatedTitle) {
      addActivity('Updated note', updatedTitle);
    }

    const baseUrl = import.meta.env.VITE_API_URL || '';
    if (baseUrl && !id.startsWith('note_')) {
      try {
        await axios.put(`${baseUrl}/api/notes/${id}`, {
          title: partialNote.title,
          content: partialNote.content,
          collectionId: partialNote.collectionId,
        });
      } catch (err) {
        console.warn('Backend sync note update notice:', err);
      }
    }
  };

  const deleteNote = async (id: string) => {
    const target = notes.find((n) => n.id === id);
    if (target) {
      addActivity('Deleted note', target.title);
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);

    const baseUrl = import.meta.env.VITE_API_URL || '';
    if (baseUrl && !id.startsWith('note_')) {
      try {
        await axios.delete(`${baseUrl}/api/notes/${id}`);
      } catch (err) {
        console.warn('Backend sync note deletion notice:', err);
      }
    }
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newPinned = !n.pinned;
          addActivity(newPinned ? 'Pinned note' : 'Unpinned note', n.title);
          return { ...n, pinned: newPinned };
        }
        return n;
      })
    );
  };

  const importMarkdown = async (fileContent: string, fileName: string): Promise<NoteItem> => {
    const lines = fileContent.split('\n');
    let title = fileName.replace(/\.md$/i, '');
    let body = fileContent;

    if (lines[0]?.startsWith('# ')) {
      title = lines[0].replace(/^#\s+/, '').trim();
      body = lines.slice(1).join('\n').trim();
    }

    return await addNote({
      title,
      content: body,
      collectionId: activeCollection || 'engineering',
    });
  };

  const exportMarkdown = (note?: NoteItem) => {
    const noteToExport = note || notes.find((n) => n.id === selectedNoteId) || notes[0];
    if (!noteToExport) return;

    const markdownText = `# ${noteToExport.title}\n\nTags: ${noteToExport.tags.map((t) => '#' + t).join(' ')}\n\n${noteToExport.content}`;
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${noteToExport.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addActivity('Exported markdown', noteToExport.title);
  };

  const getDailySummary = (): string => {
    if (notes.length === 0) return 'No notes recorded in your knowledge substrate yet.';
    const filtered = activeCollection ? notes.filter((n) => n.collectionId === activeCollection) : notes;
    if (filtered.length === 0) return `No notes found in the active collection.`;
    const titles = filtered.slice(0, 3).map((n) => `"${n.title}"`).join(', ');
    return `Your brain currently indexes ${filtered.length} notes in this scope. Active topics: ${titles}.`;
  };

  const getStorageUsedFormatted = (): string => {
    let bytes = 0;
    for (const n of notes) {
      bytes += new Blob([n.title + n.content]).size;
    }
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        collections,
        activities,
        searchQuery,
        setSearchQuery,
        activeCollection,
        setActiveCollection,
        addCollection,
        updateCollection,
        deleteCollection,
        isLoading,
        error,
        refetchNotes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        generateAiSummary,
        generateAiTags,
        importMarkdown,
        exportMarkdown,
        getDailySummary,
        getStorageUsedFormatted,
        selectedNoteId,
        setSelectedNoteId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
