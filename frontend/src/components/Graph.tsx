import React, { useState, useMemo } from 'react';
import Layout from './Layout';
import ForceGraph2D from 'react-force-graph-2d';
import { useNotes, type NoteItem } from '../context/NotesContext';
import { useNavigate } from 'react-router-dom';

interface GraphNode {
  id: string;
  name: string;
  content: string;
  tags: string[];
  summary?: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

export const Graph: React.FC = () => {
  const { notes, setSearchQuery } = useNotes();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Transform real user notes into graph nodes and create links based on shared tags
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = notes.map((n) => ({
      id: n.id,
      name: n.title,
      content: n.content,
      tags: n.tags || [],
      summary: n.summary,
    }));

    const links: GraphLink[] = [];
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const n1 = notes[i];
        const n2 = notes[j];
        const sharedTags = (n1.tags || []).filter((t) => (n2.tags || []).includes(t));
        if (sharedTags.length > 0) {
          links.push({
            source: n1.id,
            target: n2.id,
          });
        }
      }
    }

    return { nodes, links };
  }, [notes]);

  return (
    <Layout>
      <main className="flex-1 relative w-full h-full overflow-hidden flex flex-col lg:flex-row bg-[#05080f]">
        {/* Force Graph Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-[#05080f] min-h-[450px]">
          {graphData.nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              <p className="text-sm font-medium">No notes available to construct knowledge graph.</p>
            </div>
          ) : (
            <ForceGraph2D
              graphData={graphData}
              nodeColor={() => '#6366f1'}
              nodeLabel={(node: any) => `
                <div class="p-3 border border-white/10 bg-[#09090b]/95 rounded-xl shadow-2xl min-w-[180px] max-w-[260px]">
                  <p class="text-xs font-bold text-indigo-400 mb-1">${node.name || 'Note Node'}</p>
                  <p class="text-[11px] text-slate-300 font-light leading-relaxed">${(node.summary || node.content || '').substring(0, 90)}...</p>
                </div>
              `}
              linkColor={() => 'rgba(99, 102, 241, 0.25)'}
              linkWidth={1.5}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.003}
              linkDirectionalParticleWidth={2}
              backgroundColor="#05080f"
              onNodeClick={(node: any) => setSelectedNode(node)}
              nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const label = node.name || 'Node';
                const fontSize = 11 / globalScale;
                ctx.font = `${fontSize}px Inter, sans-serif`;

                // Outer Glow
                ctx.beginPath();
                ctx.arc(node.x || 0, node.y || 0, 7, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
                ctx.fill();

                // Core Dot
                ctx.beginPath();
                ctx.arc(node.x || 0, node.y || 0, 4.5, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#6366f1';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#6366f1';
                ctx.fill();

                // Center White Core
                ctx.beginPath();
                ctx.arc(node.x || 0, node.y || 0, 2, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.shadowBlur = 0;

                // Node Title Label
                ctx.fillStyle = '#e2e8f0';
                ctx.fillText(label, (node.x || 0) + 10, (node.y || 0) + 3);
              }}
            />
          )}
        </div>

        {/* Right Info Panel */}
        <aside className="w-full lg:w-96 bg-[#09090b]/80 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-white/[0.08] p-6 flex flex-col gap-6 relative z-20 overflow-y-auto max-h-[50%] lg:max-h-full">
          <header className="border-b border-white/[0.06] pb-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400">hub</span>
              Knowledge Graph
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-normal">
              {graphData.nodes.length} Nodes · {graphData.links.length} Active Connections
            </p>
          </header>

          <section className="space-y-4 flex-1">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08]">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Graph Inspection
              </h3>
              {selectedNode ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300">{selectedNode.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedNode.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {selectedNode.summary || selectedNode.content}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery(selectedNode.name);
                      navigate('/notes');
                    }}
                    className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>Open in Editor</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">
                  Click any node on the canvas to inspect its details and connections.
                </p>
              )}
            </div>
          </section>

          <button
            onClick={() => setSelectedNode(null)}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/[0.1] text-zinc-300 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_center_focus</span>
            <span>Reset View</span>
          </button>
        </aside>
      </main>
    </Layout>
  );
};

export default Graph;
