import React, { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { useModal } from '../context/ModalContext';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const particleCount = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.3})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 250) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 250) * 0.1})`;
            ctx.lineWidth = (1 - dist / 250) * 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#05080f]"></div>
      {/* Neural Aura - Slow moving gradients with increased visibility */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] animate-neural-drift opacity-80"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-500/15 rounded-full blur-[180px] animate-neural-drift-slow opacity-60"></div>
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-neural-drift opacity-40"></div>
      
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />
      
      {/* Global Grain/Noise Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

import axios from 'axios';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isModalOpen, closeModal } = useModal();
  const [projectName, setProjectName] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    setIsCreating(true);
    try {
      await axios.post('http://localhost:8080/api/projects', { name: projectName });
      setProjectName('');
      closeModal();
    } catch (error) {
      console.error("Error creating project", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#05080f] text-white selection:bg-primary/30 selection:text-white relative">
      <NeuralBackground />
      <Sidebar />
      <div className="flex-1 lg:ml-72 relative z-10 flex flex-col pt-16 lg:pt-0 overflow-y-auto max-h-screen">
        {children}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0f1a] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Initialize Substrate</h2>
            <p className="text-sm text-slate-400 mb-6">Create a new cognitive node in your neural network.</p>
            <input 
              type="text" 
              placeholder="Project Name..." 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-5 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all text-base shadow-inner mb-4"
            />
            <div className="flex gap-4">
              <button 
                onClick={closeModal}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl transition-all font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateProject}
                disabled={isCreating || !projectName.trim()}
                className={`flex-1 py-4 rounded-2xl transition-all font-bold ${
                  isCreating || !projectName.trim() 
                    ? 'bg-primary/10 text-primary/50 cursor-not-allowed' 
                    : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20'
                }`}
              >
                {isCreating ? 'Initializing...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
