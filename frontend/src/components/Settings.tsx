import React, { useState } from 'react';
import Layout from './Layout';
import axios from 'axios';

export const Settings = () => {
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••••');
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [neuralEfficiency, setNeuralEfficiency] = useState(85);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearBrain = async () => {
     // This would call a backend endpoint to delete all nodes
     console.log("Clearing all neural nodes...");
     setShowClearConfirm(false);
     alert("Neural Substrate Purged.");
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full overflow-y-auto px-6 py-10 lg:px-20 bg-[#05080f]">
        <div className="max-w-4xl mx-auto w-full space-y-12 pb-20">
          <header>
            <h2 className="text-2xl lg:text-4xl font-bold text-white tracking-tight mb-2">Neural Configuration</h2>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">Calibrating your second brain substrates</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* API Integration */}
            <section className="glass-panel-elevated p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">key</span>
                </div>
                <h3 className="text-lg font-bold text-white">AI Substrate</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Configure your Gemini API connection to power the AI Co-Processor.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type={isEditingKey ? "text" : "password"}
                    className="w-full bg-[#0a0f1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    readOnly={!isEditingKey}
                  />
                  <button 
                    onClick={() => setIsEditingKey(!isEditingKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {isEditingKey ? 'save' : 'edit'}
                    </span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 font-mono italic">Primary model: gemini-flash-latest</p>
              </div>
            </section>

            {/* Performance */}
            <section className="glass-panel-elevated p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-500">bolt</span>
                </div>
                <h3 className="text-lg font-bold text-white">Neural Efficiency</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Response Latency</span>
                  <span className="text-amber-500 font-mono">Optimized</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[85%] shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic text-center">
                  Memory allocation is dynamically scaled based on synapse density.
                </p>
              </div>
            </section>
          </div>

          {/* Dangerous Zone */}
          <section className="p-8 rounded-[2.5rem] border border-red-500/10 bg-red-500/[0.02] space-y-6">
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-[0.2em]">Destructive Operations</h3>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Purge Neural Substrate</h4>
                <p className="text-sm text-slate-400">Permanently delete all notes, projects, and neural connections. This cannot be undone.</p>
              </div>
              {!showClearConfirm ? (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl font-bold transition-all whitespace-nowrap active:scale-95"
                >
                  Initiate Purge
                </button>
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={handleClearBrain}
                    className="px-8 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  >
                    Confirm Delete
                  </button>
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    className="px-8 py-3 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default Settings;
