import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import { useModal } from '../context/ModalContext';
import { useNotes } from '../context/NotesContext';
import { useNavigate } from 'react-router-dom';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const particleCount = 35;

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
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.4 + 0.1,
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
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha * 0.25})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 200) * 0.08})`;
            ctx.lineWidth = (1 - dist / 200) * 0.6;
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
      <div className="absolute inset-0 bg-[#09090b]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[180px] pointer-events-none"></div>
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isModalOpen, closeModal } = useModal();
  const { addNote } = useNotes();
  const navigate = useNavigate();

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async () => {
    if (!noteTitle.trim() && !noteContent.trim()) return;
    setIsCreating(true);
    try {
      await addNote({
        title: noteTitle.trim() || 'Untitled Note',
        content: noteContent.trim(),
      });
      setNoteTitle('');
      setNoteContent('');
      closeModal();
      navigate('/notes');
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 selection:text-indigo-200 relative">
      <NeuralBackground />
      <Sidebar />
      <div className="flex-1 lg:ml-64 relative z-10 flex flex-col pt-16 lg:pt-0 overflow-y-auto max-h-screen">
        {children}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200 p-4">
          <div className="bg-[#0c101c] border border-white/[0.1] p-6 rounded-2xl shadow-2xl max-w-lg w-full relative animate-in zoom-in-95 duration-200 space-y-4">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400">edit_note</span>
                Create New Note
              </h2>
              <p className="text-xs text-zinc-400">Document a new concept into your second brain.</p>
            </div>

            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Note Title..." 
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 text-sm"
              />

              <textarea 
                placeholder="Write your note content..." 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-zinc-950 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={closeModal}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] rounded-xl transition-all font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateNote}
                disabled={isCreating || (!noteTitle.trim() && !noteContent.trim())}
                className="flex-1 py-2.5 rounded-xl transition-all font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                {isCreating ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
