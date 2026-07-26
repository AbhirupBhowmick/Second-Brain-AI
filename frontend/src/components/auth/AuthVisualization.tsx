import React, { useEffect, useRef } from 'react';

const AuthVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Concept nodes for left panel visualization
    const concepts = [
      'Semantic Memory',
      'Neo4j Graph',
      'Vector Space',
      'Cognitive Mesh',
      'Deep Synthesis',
      'Neural Links',
      'Context Stream',
      'Smart Notes',
    ];

    const nodes = concepts.map((label, idx) => {
      const angle = (idx / concepts.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.28;
      const baseX = width / 2 + Math.cos(angle) * radius;
      const baseY = height / 2 + Math.sin(angle) * radius;
      return {
        id: idx,
        label,
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        offset: idx * 0.8,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Subtle particle drift
      nodes.forEach((node) => {
        node.x = node.baseX + Math.sin(time + node.offset) * 14;
        node.y = node.baseY + Math.cos(time * 0.8 + node.offset) * 14;
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 260) {
            const alpha = (1 - dist / 260) * 0.2;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Energy pulse
            const pulsePos = (time * 0.4 + i * 0.3) % 1;
            const px = n1.x + dx * pulsePos;
            const py = n1.y + dy * pulsePos;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(129, 140, 248, ${alpha * 2.5})`;
            ctx.fill();
          }
        }
      }

      // Draw Nodes
      nodes.forEach((node) => {
        // Node outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.fill();

        // Label text
        ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillStyle = 'rgba(228, 228, 231, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 20);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] relative flex-col justify-between p-12 lg:p-16 border-r border-white/[0.08] bg-[#09090b] overflow-hidden">
      {/* Background subtle grid and ambient lighting */}
      <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3a9 9 0 0 0-9 9" />
              <path d="M21 12a9 9 0 0 0-9-9" />
              <path d="M12 21a9 9 0 0 0 9-9" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Second Brain <span className="text-indigo-400 font-medium">AI</span>
          </span>
        </div>
      </div>

      {/* Interactive Living Graph Canvas */}
      <div className="relative z-10 w-full h-[400px] my-auto flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Bottom Content & Quote */}
      <div className="relative z-10 space-y-4 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-mono text-indigo-400">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Intelligent Cognitive Network</span>
        </div>
        <h2 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight">
          Your thoughts, connected in permanent memory.
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed font-normal">
          Second Brain AI bridges semantic memory vectors with graph structures to give you instant contextual synthesis.
        </p>

        <div className="pt-4 flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-white/[0.08]">
          <span>NEO4J + VECTOR STORAGE</span>
          <span>LOCAL-FIRST ENCRYPTION</span>
        </div>
      </div>
    </div>
  );
};

export default AuthVisualization;
