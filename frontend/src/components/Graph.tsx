import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';

interface Node {
  id: string | number;
  name?: string;
  content?: string;
  x?: number;
  y?: number;
  val?: number;
}

interface Link {
  source: string | number;
  target: string | number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export const Graph = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const fetchGraphData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/graph`);
      setGraphData(response.data);
    } catch (error) {
      console.error("Graph Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  return (
    <Layout>
      <main className="flex-1 relative w-full h-full overflow-hidden flex flex-col lg:flex-row">
        {/* Graph Simulation Area */}
        <div className="flex-1 relative overflow-hidden bg-[#05080f] min-h-[400px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center opacity-40">
                <p className="text-xs uppercase tracking-[1em] text-primary font-bold animate-pulse">Loading Data...</p>
              </div>
            </div>
          ) : (
            <ForceGraph2D
              graphData={graphData}
              nodeColor={() => "#10b981"}
              nodeLabel={(node: any) => `
                <div class="glass-panel p-4 border border-white/10 bg-[#0a0f1a]/95 rounded-2xl shadow-2xl min-w-[200px] max-w-[300px]">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="material-symbols-outlined text-primary text-sm">psychology</span>
                    <p class="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Cerebral Content</p>
                  </div>
                  <p class="text-sm font-bold text-white mb-2">${node.name || 'Neural Node'}</p>
                  <div class="h-px w-full bg-gradient-to-r from-primary/50 to-transparent mb-3"></div>
                  <p class="text-xs text-slate-300 font-light leading-relaxed italic">"${(node.content || '').substring(0, 100)}${(node.content || '').length > 100 ? '...' : ''}"</p>
                </div>
              `}
              linkColor={() => "rgba(16, 185, 129, 0.15)"}
              linkWidth={1}
              linkDirectionalParticles={3}
              linkDirectionalParticleSpeed={0.002}
              linkDirectionalParticleWidth={1.5}
              backgroundColor="#05080f"
              onNodeClick={(node: any) => setSelectedNode(node)}
              nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const label = node.name || 'Node';
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Inter`;
                
                // Outer Glow
                ctx.beginPath();
                ctx.arc(node.x || 0, node.y || 0, 6, 0, 2 * Math.PI, false);
                ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
                ctx.fill();

                // Core Glow
                ctx.beginPath();
                ctx.arc(node.x || 0, node.y || 0, 4, 0, 2 * Math.PI, false);
                ctx.fillStyle = "#10b981";
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#10b981";
                ctx.fill();
                
                // Center Core
                ctx.beginPath();
                ctx.arc(node.x || 0, node.y || 0, 2.5, 0, 2 * Math.PI, false);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.shadowBlur = 0;
              }}
            />
          )}
        </div>

        {/* Right Info Panel */}
        <aside className="w-full lg:w-96 bg-[#05080f]/50 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/[0.05] p-6 lg:p-8 flex flex-col gap-8 relative z-20 overflow-y-auto max-h-[50%] lg:max-h-full">
          <header className="mb-2 lg:mb-4">
             <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Intelligence Map
             </h2>
             <p className="text-[10px] text-slate-500 mt-2 tracking-wide uppercase font-bold">Visualizing Knowledge Substrates</p>
          </header>

          <section className="space-y-6">
             <div className="glass-panel-elevated p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] group">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">tune</span>
                      Map Controls
                   </h3>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300 font-medium">Cluster Density</span>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">0.85</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%] shadow-[0_0_10px_rgba(56,189,248,0.4)]"></div>
                   </div>
                   
                   <div className="flex items-center justify-between pt-2">
                      <div>
                         <span className="text-sm text-slate-300 font-medium">Show Communities</span>
                         <p className="text-[10px] text-slate-500">Group related concepts</p>
                      </div>
                      <div className="w-10 h-5 bg-primary/20 rounded-full relative p-1 cursor-pointer">
                         <div className="w-3 h-3 bg-primary rounded-full absolute right-1"></div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="glass-panel-elevated p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col h-72">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-3">Selected Node</h3>
                {selectedNode ? (
                  <>
                    <div className="flex items-start gap-4 mb-6 animate-in fade-in slide-in-from-right-4">
                       <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                          <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                       </div>
                       <div>
                          <h4 className="text-lg font-bold text-white leading-tight">{selectedNode.name}</h4>
                          <span className="inline-block mt-1 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase tracking-widest font-bold">Node ID: {selectedNode.id}</span>
                       </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-light mb-auto">
                       This thought node is integrated into your neural substrate. Connect it with other nodes to expand your cognitive atlas.
                    </p>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 gap-4">
                    <span className="material-symbols-outlined text-4xl">ads_click</span>
                    <p className="text-[10px] uppercase tracking-widest font-bold">Inspect a neural node</p>
                  </div>
                )}
             </div>
          </section>

          <button 
            onClick={fetchGraphData}
            className="w-full mt-auto py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
             <span className="material-symbols-outlined text-lg">auto_mode</span>
             Recalculate Atlas
          </button>
        </aside>
      </main>
    </Layout>
  );
};

export default Graph;
