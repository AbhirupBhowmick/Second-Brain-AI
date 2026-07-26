import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  collectionId?: string;
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

interface NotesContextType {
  notes: NoteItem[];
  collections: CollectionItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCollection: string | null;
  setActiveCollection: (id: string | null) => void;
  addNote: (note: Partial<NoteItem>) => NoteItem;
  updateNote: (id: string, note: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  generateAiSummary: (content: string) => string;
  generateAiTags: (content: string, title?: string) => string[];
  importMarkdown: (fileContent: string, fileName: string) => NoteItem;
  exportMarkdown: (note?: NoteItem) => void;
  getDailySummary: () => string;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const DEFAULT_COLLECTIONS: CollectionItem[] = [
  { id: 'engineering', name: 'Engineering', icon: 'terminal', color: 'text-indigo-400' },
  { id: 'ai-research', name: 'AI Research', icon: 'psychology', color: 'text-cyan-400' },
  { id: 'product', name: 'Product Ideas', icon: 'lightbulb', color: 'text-amber-400' },
  { id: 'personal', name: 'Personal', icon: 'person', color: 'text-emerald-400' },
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'System Architecture & Microservices',
    content: `Exploring decoupled graph database querying using Spring Boot and Neo4j. Key requirements include vector embedding generation for semantic search, ultra-fast cache invalidation, and async event streaming via WebSockets.

### High-level Design:
- Frontend: Vite + React 19 + Tailwind CSS
- Backend: Spring Boot API Gateway + Neo4j Graph DB
- Search: Hybrid BM25 & Dense Semantic Vector Indexing`,
    summary: 'Decoupled architecture combining Spring Boot, Neo4j, and dense vector search for high-speed graph queries.',
    tags: ['architecture', 'backend', 'neo4j', 'graph'],
    collectionId: 'engineering',
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'note-2',
    title: 'LLM Context Window Optimization',
    content: `Strategies to compress long-form user knowledge graphs into dense prompt context. Utilizing sub-graph retrieval algorithms and BM25 hybrid ranking to reduce token overhead by 60%.

1. Sub-graph Extraction: Fetch only 2-hop connected nodes.
2. Summarization Layer: Auto-generate concise 2-sentence node synopses.
3. Dynamic Prompt Assembly: Inject active context variables on the fly.`,
    summary: 'Techniques for sub-graph extraction and BM25 hybrid ranking to fit graph context into LLM prompt constraints.',
    tags: ['ai', 'optimization', 'llm', 'context'],
    collectionId: 'ai-research',
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'note-3',
    title: 'React 19 & Command Palette UX',
    content: `Building a Raycast/Linear-inspired command palette (Cmd+K / Ctrl+K) in React. Features instant fuzzy search across notes, tags, and action shortcuts.

Implemented keyboard accessibility with Arrow Up/Down navigation, Enter execution, and Escape closing.`,
    summary: 'Raycast-style command palette implementation with keyboard navigation and instant global fuzzy search.',
    tags: ['frontend', 'react', 'ux', 'raycast'],
    collectionId: 'engineering',
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'note-4',
    title: 'Knowledge Substrate Roadmap',
    content: `Product roadmap for Second Brain AI:
- [x] Command Palette (Cmd+K)
- [x] Markdown Import & Export
- [x] Interactive Knowledge Graph Preview
- [ ] Real-time Collaborative Graph Nodes
- [ ] Local Offline Vector Cache`,
    summary: 'Current feature checklist and future roadmap for Second Brain AI platform.',
    tags: ['roadmap', 'product', 'ideas'],
    collectionId: 'product',
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('sb_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTES;
  });

  const [collections] = useState<CollectionItem[]>(DEFAULT_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sb_notes', JSON.stringify(notes));
  }, [notes]);

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

  const generateAiSummary = (content: string): string => {
    if (!content.trim()) return 'No content provided.';
    const clean = content.replace(/[#*`\-[\]]/g, '').trim();
    const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length <= 2) return clean;
    return sentences.slice(0, 2).join(' ');
  };

  const generateAiTags = (content: string, title: string = ''): string[] => {
    const text = `${title} ${content}`.toLowerCase();
    const candidates = [
      'architecture', 'backend', 'frontend', 'ai', 'graph', 'react',
      'neo4j', 'spring', 'database', 'vector', 'search', 'ux', 'llm',
      'optimization', 'performance', 'markdown', 'security', 'api'
    ];
    const tags = candidates.filter((word) => text.includes(word));
    return tags.length > 0 ? tags.slice(0, 4) : ['general', 'notes'];
  };

  const addNote = (partialNote: Partial<NoteItem>): NoteItem => {
    const newTitle = partialNote.title || 'Untitled Note';
    const newContent = partialNote.content || '';
    const newNote: NoteItem = {
      id: 'note_' + Date.now(),
      title: newTitle,
      content: newContent,
      summary: partialNote.summary || generateAiSummary(newContent),
      tags: partialNote.tags || generateAiTags(newContent, newTitle),
      collectionId: partialNote.collectionId || 'engineering',
      pinned: partialNote.pinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);

    // Try posting to backend if available
    const baseUrl = import.meta.env.VITE_API_URL || '';
    if (baseUrl) {
      axios.post(`${baseUrl}/api/notes`, {
        title: newNote.title,
        content: newNote.content,
        createdAt: newNote.createdAt
      }).catch((err) => console.warn('Backend sync warning:', err));
    }

    return newNote;
  };

  const updateNote = (id: string, partialNote: Partial<NoteItem>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updatedContent = partialNote.content ?? n.content;
          const updatedTitle = partialNote.title ?? n.title;
          return {
            ...n,
            ...partialNote,
            summary: partialNote.summary || generateAiSummary(updatedContent),
            tags: partialNote.tags || generateAiTags(updatedContent, updatedTitle),
            updatedAt: new Date().toISOString(),
          };
        }
        return n;
      })
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const importMarkdown = (fileContent: string, fileName: string): NoteItem => {
    const lines = fileContent.split('\n');
    let title = fileName.replace(/\.md$/i, '');
    let body = fileContent;

    if (lines[0]?.startsWith('# ')) {
      title = lines[0].replace(/^#\s+/, '').trim();
      body = lines.slice(1).join('\n').trim();
    }

    return addNote({
      title,
      content: body,
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
  };

  const getDailySummary = (): string => {
    if (notes.length === 0) return 'No notes recorded today.';
    const recent = notes.slice(0, 3);
    const titles = recent.map((n) => `"${n.title}"`).join(', ');
    return `Your brain currently indexes ${notes.length} note nodes. Top active topics include ${titles}. Primary stack focus is architecture, graph database queries, and AI vector search.`;
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        collections,
        searchQuery,
        setSearchQuery,
        activeCollection,
        setActiveCollection,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        generateAiSummary,
        generateAiTags,
        importMarkdown,
        exportMarkdown,
        getDailySummary,
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
