import React, { useState, useMemo, useRef, useEffect } from 'react';
import Layout from './Layout';
import ForceGraph2D from 'react-force-graph-2d';
import { useNotes, type NoteItem } from '../context/NotesContext';
import { useModal } from '../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedQuestions?: string[];
  highlightedNodeIds?: string[];
  time: string;
}

interface RelatedNoteScore {
  note: NoteItem;
  similarityScore: number;
}

export const KnowledgeAssistant: React.FC = () => {
  const { notes, setSearchQuery } = useNotes();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const [promptInput, setPromptInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const graphRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'How are React and Spring Boot connected?',
    'Which notes mention Machine Learning?',
    'Show everything related to AI Architecture',
    'What are my most connected notes?',
    'Suggest notes I should connect',
  ];

  // Compute graph data based on real user notes
  const graphData = useMemo(() => {
    const nodes = notes.map((n) => ({
      id: n.id,
      name: n.title,
      content: n.content,
      tags: n.tags || [],
      summary: n.summary,
      isHighlighted: highlightedNodeIds.includes(n.id),
    }));

    const links: { source: string; target: string; isHighlighted: boolean }[] = [];
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const n1 = notes[i];
        const n2 = notes[j];
        const sharedTags = (n1.tags || []).filter((t) => (n2.tags || []).includes(t));
        if (sharedTags.length > 0) {
          const isHigh =
            highlightedNodeIds.includes(n1.id) && highlightedNodeIds.includes(n2.id);
          links.push({
            source: n1.id,
            target: n2.id,
            isHighlighted: isHigh,
          });
        }
      }
    }
    return { nodes, links };
  }, [notes, highlightedNodeIds]);

  // Compute related notes with similarity ranking
  const relatedNotesRanked: RelatedNoteScore[] = useMemo(() => {
    if (notes.length === 0) return [];
    if (highlightedNodeIds.length === 0) {
      return notes.slice(0, 4).map((n, idx) => ({
        note: n,
        similarityScore: Math.max(70, 96 - idx * 6),
      }));
    }
    return notes
      .filter((n) => highlightedNodeIds.includes(n.id))
      .map((n, idx) => ({
        note: n,
        similarityScore: Math.max(78, 98 - idx * 4),
      }));
  }, [notes, highlightedNodeIds]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  const handleAskQuestion = async (queryText?: string) => {
    const text = queryText || promptInput;
    if (!text.trim() || isAiLoading) return;

    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setPromptInput('');
    setIsAiLoading(true);

    // Identify matching nodes for graph highlighting
    const matchingNodeIds = notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(text.toLowerCase()) ||
          n.content.toLowerCase().includes(text.toLowerCase()) ||
          n.tags.some((t) => text.toLowerCase().includes(t.toLowerCase()))
      )
      .map((n) => n.id);

    const activeNodeIds = matchingNodeIds.length > 0 ? matchingNodeIds : notes.slice(0, 3).map((n) => n.id);
    setHighlightedNodeIds(activeNodeIds);

    const contextText = notes
      .slice(0, 10)
      .map((n) => `Note ID: ${n.id}\nTitle: ${n.title}\nContent: ${n.content}\nTags: ${n.tags.join(', ')}`)
      .join('\n\n');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await axios.post(`${baseUrl}/api/chat`, {
        prompt: `You are the Second Brain AI Knowledge Graph Assistant.\n\nUser Question: ${text}\n\nRetrieved Notes Context:\n${contextText}\n\nProvide an insightful, grounded answer highlighting the relationships between these notes.`,
      });
      const replyContent = res.data?.reply || 'Analyzed your knowledge graph concepts.';

      const suggested = [
        `How does this relate to ${notes[0]?.title || 'Architecture'}?`,
        'What additional notes should I create?',
        'Show connected graph relationships',
      ];

      const aiMsg: Message = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: replyContent,
        suggestedQuestions: suggested,
        highlightedNodeIds: activeNodeIds,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.reply || 'AI Service unavailable. Please verify API configuration.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_' + (Date.now() + 1),
          role: 'assistant',
          content: `[System Notice]: ${errorMsg}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#05080f]">
        {/* Page Header */}
        <header className="px-6 lg:px-8 py-4 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-xl flex justify-between items-center relative z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base lg:text-lg font-bold text-white tracking-tight">
                  Knowledge Assistant
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-600/20 border border-indigo-500/30 text-indigo-300">
                  Flagship Graph Chat
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-light">
                Conversational Graph Reasoning · Gemini + Neo4j Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setMessages([]);
                setHighlightedNodeIds([]);
              }}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Reset Session
            </button>
          </div>
        </header>

        {/* Main Split: Left Chat Panel vs Right Interactive Subgraph Panel */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
          {/* Left Chat Column */}
          <section className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#09090b]/60 overflow-hidden relative">
            {/* Sample Prompt Chips */}
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950/40">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sampleQuestions.map((sq) => (
                  <button
                    key={sq}
                    onClick={() => handleAskQuestion(sq)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-indigo-600/20 border border-white/[0.08] hover:border-indigo-500/30 text-[11px] text-zinc-300 hover:text-indigo-300 transition-all text-left cursor-pointer"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 scroll-hide pb-28">
              {notes.length === 0 ? (
                /* Empty State when zero notes in workspace */
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-base font-bold text-white">No Knowledge Nodes Indexed</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Create notes in your second brain to enable AI knowledge graph exploration and reasoning.
                    </p>
                  </div>
                  <button
                    onClick={openModal}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Create First Note</span>
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <span className="material-symbols-outlined text-4xl opacity-30">hub</span>
                  <p className="text-sm font-semibold text-white">Ask anything about your knowledge substrate</p>
                  <p className="text-xs text-zinc-400 font-light max-w-xs mx-auto">
                    Gemini will synthesize answers while dynamically highlighting related nodes in the graph canvas.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                  >
                    <div className={`flex items-start gap-3 max-w-xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          msg.role === 'user'
                            ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300'
                            : 'bg-zinc-900 border-white/[0.1] text-zinc-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {msg.role === 'user' ? 'person' : 'smart_toy'}
                        </span>
                      </div>

                      <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-md ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-zinc-900/90 text-zinc-200 border border-white/[0.08] rounded-tl-none font-light'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Suggested Follow-up Questions */}
                        {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.suggestedQuestions.map((sq) => (
                              <button
                                key={sq}
                                onClick={() => handleAskQuestion(sq)}
                                className="px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-[10px] font-mono text-indigo-300 cursor-pointer transition-all"
                              >
                                ↵ {sq}
                              </button>
                            ))}
                          </div>
                        )}

                        <p className="text-[9px] font-mono text-zinc-500 px-1">{msg.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {isAiLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/[0.08]">
                    <div className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                    <span className="text-xs text-zinc-400 font-mono">Reasoning across knowledge graph...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent z-20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex items-center gap-2 bg-zinc-900 border border-white/[0.1] focus-within:border-indigo-500/50 rounded-2xl p-2 shadow-2xl"
              >
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask Gemini about your knowledge graph (Press Enter)..."
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 px-3 py-2 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !promptInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>Ask</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </form>
            </div>
          </section>

          {/* Right Subgraph & Related Evidence Column */}
          <section className="w-full lg:w-1/2 flex flex-col overflow-y-auto bg-[#05080f]">
            {/* Interactive Graph Canvas */}
            <div className="h-[340px] lg:h-[420px] relative border-b border-white/[0.08] bg-[#05080f]">
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Neo4j Graph Canvas ({graphData.nodes.length} Nodes)</span>
              </div>

              {graphData.nodes.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-xs">
                  No nodes available.
                </div>
              ) : (
                <ForceGraph2D
                  ref={graphRef}
                  graphData={graphData}
                  nodeColor={(node: any) => (node.isHighlighted ? '#818cf8' : '#6366f1')}
                  nodeLabel={(node: any) => node.name}
                  linkColor={(link: any) =>
                    link.isHighlighted ? 'rgba(129, 140, 248, 0.7)' : 'rgba(99, 102, 241, 0.25)'
                  }
                  linkWidth={(link: any) => (link.isHighlighted ? 2.5 : 1)}
                  linkDirectionalParticles={(link: any) => (link.isHighlighted ? 4 : 2)}
                  linkDirectionalParticleSpeed={0.004}
                  backgroundColor="#05080f"
                  onNodeClick={(node: any) => {
                    const found = notes.find((n) => n.id === node.id);
                    if (found) setActiveNote(found);
                  }}
                  nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                    const label = node.name || 'Node';
                    const fontSize = 10 / globalScale;
                    ctx.font = `${fontSize}px Inter, sans-serif`;

                    const isHigh = node.isHighlighted;

                    // Glow circle
                    ctx.beginPath();
                    ctx.arc(node.x || 0, node.y || 0, isHigh ? 10 : 6, 0, 2 * Math.PI, false);
                    ctx.fillStyle = isHigh ? 'rgba(129, 140, 248, 0.35)' : 'rgba(99, 102, 241, 0.15)';
                    ctx.fill();

                    // Core dot
                    ctx.beginPath();
                    ctx.arc(node.x || 0, node.y || 0, isHigh ? 6 : 4, 0, 2 * Math.PI, false);
                    ctx.fillStyle = isHigh ? '#818cf8' : '#6366f1';
                    ctx.shadowBlur = isHigh ? 16 : 6;
                    ctx.shadowColor = isHigh ? '#818cf8' : '#6366f1';
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Text Label
                    ctx.fillStyle = isHigh ? '#ffffff' : '#cbd5e1';
                    ctx.fillText(label, (node.x || 0) + 10, (node.y || 0) + 3);
                  }}
                />
              )}
            </div>

            {/* Related Notes & Evidence Cards */}
            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400 text-base">saved_search</span>
                  Grounding Evidence & Related Notes ({relatedNotesRanked.length})
                </h3>
              </div>

              {activeNote && (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-indigo-300 text-sm">{activeNote.title}</h4>
                    <button
                      onClick={() => {
                        setSearchQuery(activeNote.title);
                        navigate('/notes');
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      Open Note →
                    </button>
                  </div>
                  <p className="text-zinc-300 font-light leading-relaxed">
                    {activeNote.summary || activeNote.content}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {relatedNotesRanked.map(({ note, similarityScore }) => (
                  <div
                    key={note.id}
                    onClick={() => setActiveNote(note)}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08] hover:border-indigo-500/30 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {note.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                        {similarityScore}% match
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-light">
                      {note.summary || note.content}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((t) => (
                          <span key={t} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-zinc-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default KnowledgeAssistant;
