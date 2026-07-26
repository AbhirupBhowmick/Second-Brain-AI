import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  category: 'core' | 'memory' | 'ai' | 'graph';
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  pulseOffset: number;
}

interface Connection {
  source: number;
  target: number;
  strength: number;
}

const LivingKnowledgeGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial node topology - structured yet organic network layout
    const nodeDefinitions = [
      { id: '1', label: 'Semantic Memory', category: 'core', xRatio: 0.5, yRatio: 0.45, radius: 7 },
      { id: '2', label: 'Neo4j Graph', category: 'graph', xRatio: 0.28, yRatio: 0.3, radius: 5.5 },
      { id: '3', label: 'Vector Index', category: 'memory', xRatio: 0.72, yRatio: 0.32, radius: 5.5 },
      { id: '4', label: 'LLM Reasoning', category: 'ai', xRatio: 0.35, yRatio: 0.68, radius: 6 },
      { id: '5', label: 'Smart Notes', category: 'memory', xRatio: 0.65, yRatio: 0.65, radius: 5.5 },
      { id: '6', label: 'Research Vault', category: 'memory', xRatio: 0.18, yRatio: 0.52, radius: 4.5 },
      { id: '7', label: 'Connected Insight', category: 'core', xRatio: 0.82, yRatio: 0.5, radius: 5 },
      { id: '8', label: 'Concept Cluster', category: 'graph', xRatio: 0.45, yRatio: 0.22, radius: 4.5 },
      { id: '9', label: 'Cognitive Mesh', category: 'ai', xRatio: 0.55, yRatio: 0.78, radius: 5 },
      { id: '10', label: 'Auto Linker', category: 'graph', xRatio: 0.25, yRatio: 0.8, radius: 4 },
      { id: '11', label: 'Context Engine', category: 'core', xRatio: 0.75, yRatio: 0.82, radius: 4.5 },
    ];

    const nodes: Node[] = nodeDefinitions.map((nd, idx) => ({
      id: nd.id,
      label: nd.label,
      category: nd.category as any,
      x: nd.xRatio * width,
      y: nd.yRatio * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseX: nd.xRatio * width,
      baseY: nd.yRatio * height,
      radius: nd.radius,
      pulseOffset: idx * 0.7,
    }));

    // Defined semantic links between nodes
    const connections: Connection[] = [
      { source: 0, target: 1, strength: 0.8 },
      { source: 0, target: 2, strength: 0.8 },
      { source: 0, target: 3, strength: 0.9 },
      { source: 0, target: 4, strength: 0.9 },
      { source: 1, target: 5, strength: 0.6 },
      { source: 1, target: 7, strength: 0.7 },
      { source: 2, target: 6, strength: 0.7 },
      { source: 2, target: 4, strength: 0.5 },
      { source: 3, target: 8, strength: 0.8 },
      { source: 4, target: 8, strength: 0.7 },
      { source: 3, target: 10, strength: 0.6 },
      { source: 5, target: 9, strength: 0.5 },
      { source: 7, target: 0, strength: 0.5 },
      { source: 6, target: 1, strength: 0.4 },
    ];

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Mouse interactive physics & organic floating breathing
      nodes.forEach((node) => {
        const breathX = Math.sin(time + node.pulseOffset) * 12;
        const breathY = Math.cos(time * 0.8 + node.pulseOffset) * 12;
        const targetX = node.baseX + breathX;
        const targetY = node.baseY + breathY;

        // Soft attraction to mouse if close
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            node.vx += (dx / dist) * force * 0.2;
            node.vy += (dy / dist) * force * 0.2;
          }
        }

        // Spring back to target
        node.vx += (targetX - node.x) * 0.02;
        node.vy += (targetY - node.y) * 0.02;

        // Damping
        node.vx *= 0.9;
        node.vy *= 0.9;

        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw Connection lines with subtle glowing energy pulses
      connections.forEach((conn) => {
        const source = nodes[conn.source];
        const target = nodes[conn.target];
        if (!source || !target) return;

        const isHighlighted = hoveredNode === source.id || hoveredNode === target.id;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isHighlighted) {
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.7)';
          ctx.lineWidth = 1.8;
        } else {
          const alpha = Math.max(0.05, (1 - dist / 350) * 0.25 * conn.strength);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Living energy pulse along connection lines
        const pulsePos = (time * 0.3 + conn.source * 0.2) % 1;
        const px = source.x + dx * pulsePos;
        const py = source.y + dy * pulsePos;

        ctx.beginPath();
        ctx.arc(px, py, isHighlighted ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? 'rgba(99, 102, 241, 0.9)' : 'rgba(99, 102, 241, 0.4)';
        ctx.fill();
      });

      // Draw Nodes
      let currentHovered: string | null = null;

      nodes.forEach((node) => {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < node.radius + 15;

        if (isHovered) {
          currentHovered = node.id;
        }

        const activeRadius = isHovered ? node.radius * 1.5 : node.radius;

        // Subtle outer aura
        ctx.beginPath();
        ctx.arc(node.x, node.y, activeRadius + 6, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? 'rgba(99, 102, 241, 0.15)'
          : node.category === 'core'
          ? 'rgba(99, 102, 241, 0.08)'
          : 'rgba(255, 255, 255, 0.03)';
        ctx.fill();

        // Node core circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, activeRadius, 0, Math.PI * 2);

        if (isHovered) {
          ctx.fillStyle = '#6366F1';
          ctx.shadowColor = '#6366F1';
          ctx.shadowBlur = 12;
        } else if (node.category === 'core') {
          ctx.fillStyle = '#818CF8';
          ctx.shadowBlur = 0;
        } else if (node.category === 'ai') {
          ctx.fillStyle = '#60A5FA';
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#A1A1AA';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow blur

        // Node label
        ctx.font = `${isHovered ? '600 12px' : '500 11px'} -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
        ctx.fillStyle = isHovered ? '#FFFFFF' : 'rgba(244, 244, 245, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + activeRadius + 16);
      });

      if (currentHovered !== hoveredNode) {
        setHoveredNode(currentHovered);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredNode]);

  return (
    <div ref={containerRef} className="relative w-full h-[460px] lg:h-[540px] rounded-2xl border border-white/[0.08] bg-[#121215]/60 overflow-hidden backdrop-blur-md shadow-2xl group">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 subtle-grid-bg opacity-40 pointer-events-none" />

      {/* Top subtle status indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/[0.08] backdrop-blur-md text-xs font-medium text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span className="tracking-wide">Living Knowledge Graph</span>
      </div>

      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair relative z-0" />

      {/* Subtle bottom info note */}
      <div className="absolute bottom-4 right-4 z-10 text-[11px] text-zinc-500 font-mono tracking-wider opacity-60">
        11 NODES • 14 SEMANTIC LINKS
      </div>
    </div>
  );
};

export default LivingKnowledgeGraph;
