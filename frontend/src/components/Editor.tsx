import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';

export const Editor = () => {
  const [title, setTitle] = useState('New Thought Node');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    if (!content.trim() || !title.trim()) {
      alert("Neural integrity check failed: Please provide both a title and content before committing.");
      return;
    }
    console.log("Committing to Neural Substrate:", { title, content });
    setSaveStatus('saving');
    console.log("Saving Note Content:", content);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, {
        title,
        content,
        createdAt: new Date().toISOString()
      });
      setSaveStatus('saved');
      setShowToast(true);
      setContent('');
      setTitle('New Thought Node');
      setTimeout(() => {
        setSaveStatus('idle');
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus('error');
    }
  };

  return (
    <Layout>
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[100] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="font-bold tracking-wide">Saved!</span>
        </div>
      )}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Editor Header */}
        <header className="px-6 lg:px-10 py-6 border-b border-white/[0.05] bg-[#05080f]/50 backdrop-blur-xl flex justify-between items-center relative z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              Neural Editor
            </h2>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium tracking-widest uppercase">
              <span className={`material-symbols-outlined text-sm ${saveStatus === 'saved' ? 'text-emerald-400' : 'text-slate-600'}`}>
                {saveStatus === 'saved' ? 'cloud_done' : 'cloud_upload'}
              </span>
              {saveStatus === 'saving' ? 'Synching...' : saveStatus === 'saved' ? 'Synched' : 'Awaiting Synthesis'}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={handleSave}
               disabled={saveStatus === 'saving'}
               className="px-4 lg:px-6 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold transition-all border border-primary/20 shadow-lg shadow-primary/10 flex items-center gap-2 active:scale-95"
             >
                {saveStatus === 'saving' && <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>}
                <span className="hidden sm:inline">{saveStatus === 'saving' ? 'Executing...' : 'Commit to Brain'}</span>
                <span className="sm:hidden">{saveStatus === 'saving' ? '...' : 'Commit'}</span>
             </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative z-10">
          <section className="flex-1 overflow-y-auto px-6 py-8 lg:px-20 scroll-hide">
             <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-wrap gap-2 lg:gap-3 mb-4">
                   <span className="px-3 lg:px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest">#new-node</span>
                   <span className="px-3 lg:px-4 py-1.5 rounded-full bg-white/5 text-slate-400 border border-white/5 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest">#draft</span>
                </div>
                
                <input 
                  className="w-full bg-transparent border-none text-3xl lg:text-5xl font-bold text-white placeholder-white/10 focus:ring-0 p-0 font-headline tracking-tight" 
                  placeholder="Ethereal Title..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
                <div className="h-px w-full bg-gradient-to-r from-white/[0.05] to-transparent"></div>
 
                <textarea 
                  className="w-full bg-transparent border-none text-base lg:text-lg text-slate-300 font-light leading-relaxed min-h-[300px] lg:min-h-[500px] focus:ring-0 p-0 resize-none" 
                  placeholder="Begin the synthesis of thought..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
             </div>
          </section>
 
          {/* Context Sidebar - Hidden on mobile for better focus */}
          <aside className="hidden lg:flex w-80 bg-[#05080f]/30 backdrop-blur-2xl border-l border-white/[0.05] p-8 flex-col gap-8">
             <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-6">Neural Context</h4>
                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                   <span className="material-symbols-outlined text-primary text-3xl mb-4">psychology</span>
                   <h5 className="text-sm font-bold text-white mb-2 tracking-tight">Active Node Synthesis</h5>
                   <p className="text-[11px] text-slate-400 leading-relaxed">
                      As you write, the AI co-processor maps your concepts to the global knowledge substrate.
                   </p>
                </div>
             </section>
 
             <section className="mt-auto">
                <div className="p-6 rounded-[2rem] bg-[#0a0f1a] border border-white/5 text-center">
                   <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest">Current Metadata</p>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono">
                         <span className="text-slate-600">WORDS:</span>
                         <span className="text-primary">{content.split(/\s+/).filter(Boolean).length}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                         <span className="text-slate-600">SYMBOLS:</span>
                         <span className="text-primary">{content.length}</span>
                      </div>
                   </div>
                </div>
             </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
};

export default Editor;
