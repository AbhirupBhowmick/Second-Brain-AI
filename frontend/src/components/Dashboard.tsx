import { Link } from 'react-router-dom';
import Layout from './Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalNotes: '...',
    totalConnections: '...',
    storageUsed: '...'
  });
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, notesRes, projectsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/notes`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/projects`)
        ]);
        setStats({
          totalNotes: statsRes.data.totalNotes.toString(),
          totalConnections: statsRes.data.totalConnections.toString(),
          storageUsed: statsRes.data.storageUsed
        });
        setRecentNotes(notesRes.data.slice(-3).reverse());
        setActiveProjects(projectsRes.data.slice(-3).reverse());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-12 relative">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-20">
          <div>
            <h2 className="text-2xl lg:text-4xl font-headline font-bold tracking-tight text-white mb-2">
              Welcome to the <span className="text-primary">Nexus</span>
            </h2>
            <p className="text-slate-400 text-base lg:text-lg font-light">Your cognitive engine is operating at peak performance.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/5 bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">Core Online</span>
             </div>
             <button className="bg-primary/20 hover:bg-primary/30 text-primary p-3 rounded-2xl border border-primary/30 transition-all shadow-lg active:scale-95">
                <span className="material-symbols-outlined">refresh</span>
             </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
           {[
             { label: 'Neural Nodes', value: stats.totalNotes, icon: 'hub', color: 'text-primary', bg: 'bg-primary/10' },
             { label: 'Active Synapses', value: stats.totalConnections, icon: 'bolt', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
             { label: 'Knowledge Base', value: stats.storageUsed, icon: 'database', color: 'text-purple-400', bg: 'bg-purple-500/10' }
           ].map((stat) => (
             <div key={stat.label} className="glass-panel-elevated p-8 rounded-[2.5rem] border border-white/5 bg-[#0a0f1a]/40 group hover:border-primary/20 transition-all duration-500">
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                   <span className={`material-symbols-outlined ${stat.color} text-3xl`}>{stat.icon}</span>
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
             </div>
           ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
          <section className="glass-panel-elevated rounded-[3rem] p-6 lg:p-10 border border-white/5 bg-[#0a0f1a]/30 min-h-[400px] lg:h-[480px] flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <header className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-4 tracking-tight">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary">description</span>
                </div>
                Recent Thoughts
              </h3>
              <Link to="/notes" className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors font-bold">View Archive</Link>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative z-10 scroll-hide">
              {recentNotes.length > 0 ? recentNotes.map((note) => (
                <div key={note.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.03] hover:border-primary/30 hover:bg-white/[0.04] transition-all cursor-pointer group/item">
                   <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-white group-hover/item:text-primary transition-colors">{note.title || 'Thought Node'}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                   <p className="text-sm text-slate-400 line-clamp-2 mb-4 font-light leading-relaxed">{note.content}</p>
                   <div className="flex gap-2">
                      {(note.tags || []).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/5">#{tag}</span>
                      ))}
                   </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                  <p className="text-xs uppercase tracking-widest">No Recent Thoughts</p>
                </div>
              )}
            </div>
          </section>

          <section className="glass-panel-elevated rounded-[3rem] p-6 lg:p-10 border border-white/5 bg-[#0a0f1a]/30 min-h-[400px] lg:h-[480px] flex flex-col relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            <header className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-4 tracking-tight">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="material-symbols-outlined text-emerald-400">task_alt</span>
                </div>
                Active Synapses
              </h3>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 relative z-10 scroll-hide">
               {activeProjects.length > 0 ? activeProjects.map((project) => (
                 <div key={project.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.03] hover:border-emerald-500/20 transition-all group/task">
                    <div className="flex justify-between items-center mb-4">
                       <p className="text-sm font-medium text-white group-hover/task:text-emerald-400 transition-colors">{project.name}</p>
                       <span className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-slate-500 font-mono tracking-tighter">Active</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="h-1.5 flex-1 bg-white/[0.05] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: '65%' }}></div>
                       </div>
                       <span className="text-[10px] text-emerald-400 font-bold font-mono">65%</span>
                    </div>
                 </div>
               )) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-20">hub</span>
                    <p className="text-xs uppercase tracking-widest">No Active Synapses</p>
                 </div>
               )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
