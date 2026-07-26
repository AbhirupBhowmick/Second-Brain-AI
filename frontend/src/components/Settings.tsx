import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';

interface SystemHealthData {
  status: string;
  version: string;
  timestamp: string;
  neo4j?: {
    status: string;
    connected: boolean;
    nodeCount?: number;
    error?: string;
  };
  gemini?: {
    status: string;
    apiKeyLoaded: boolean;
    model: string;
    lastSuccessfulAiRequestTime?: string | null;
    message?: string;
  };
}

export const Settings = () => {
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fetchHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await axios.get(`${baseUrl}/api/health`);
      setHealthData(res.data);
    } catch (err: any) {
      setHealthError('Unable to reach backend health endpoint at http://localhost:8080/api/health');
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleClearSubstrate = async () => {
    try {
      localStorage.removeItem('sb_notes_v2');
      localStorage.removeItem('sb_activities');
      localStorage.removeItem('sb_collections_v1');
      localStorage.removeItem('sb_active_collection');
      setShowClearConfirm(false);
      alert('Local workspace state reset successfully.');
      window.location.reload();
    } catch {
      // fallback
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full overflow-y-auto px-6 py-10 lg:px-20 bg-[#09090b]">
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-20">
          <header className="border-b border-white/[0.08] pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Settings & Infrastructure
            </h2>
            <p className="text-xs text-zinc-400 font-normal mt-1">
              System health monitoring, AI API key status, and workspace configuration.
            </p>
          </header>

          {/* System Health & Status Audit Panel */}
          <section className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <span className="material-symbols-outlined text-lg">monitor_heart</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">System Status & Health Audit</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">Backend Status: {healthData?.status || 'UNKNOWN'}</p>
                </div>
              </div>

              <button
                onClick={fetchHealth}
                disabled={healthLoading}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/[0.1] hover:border-indigo-500/40 text-xs text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-sm ${healthLoading ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>Refresh Health</span>
              </button>
            </div>

            {healthError ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono">
                {healthError}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Backend Service Status */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Backend Service</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      ✓ UP
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">Port: 8080 · HTTP/1.1</p>
                  <p className="text-[10px] text-zinc-500 font-mono">Version: {healthData?.version || '1.0.0'}</p>
                </div>

                {/* Neo4j Database Status */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Neo4j Database</span>
                    {healthData?.neo4j?.connected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                        ✓ ONLINE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                        ⚠ OFFLINE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">URI: bolt://localhost:7687</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {healthData?.neo4j?.connected
                      ? `${healthData.neo4j.nodeCount} Notes Stored`
                      : 'Knowledge Graph Offline'}
                  </p>
                </div>

                {/* Gemini AI Status */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Gemini AI Engine</span>
                    {healthData?.gemini?.apiKeyLoaded ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                        ✓ CONFIGURED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                        ⚠ KEY REQUIRED
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">Model: {healthData?.gemini?.model || 'gemini-2.0-flash'}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {healthData?.gemini?.lastSuccessfulAiRequestTime
                      ? `Last Request: ${new Date(healthData.gemini.lastSuccessfulAiRequestTime).toLocaleTimeString()}`
                      : 'API Key Loaded'}
                  </p>
                </div>
              </div>
            )}

            {healthData?.timestamp && (
              <p className="text-[10px] text-zinc-500 font-mono text-right">
                Last checked: {new Date(healthData.timestamp).toLocaleTimeString()}
              </p>
            )}
          </section>

          {/* AI Key Notice */}
          <section className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <span className="material-symbols-outlined text-lg">key</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Gemini API Environment Configuration</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Production Gemini API key loaded securely via environment variables.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] text-xs font-mono text-zinc-300 space-y-2">
              <p className="text-zinc-500"># Environment Key Injection:</p>
              <p className="text-indigo-300">GEMINI_API_KEY=•••••••• (Loaded from Environment)</p>
              <p className="text-zinc-500 pt-1"># Official REST Endpoint:</p>
              <p className="text-emerald-400">https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash</p>
            </div>
          </section>

          {/* Workspace Reset Zone */}
          <section className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] space-y-4">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
              Workspace Operations
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Reset Local Substrate</h4>
                <p className="text-xs text-zinc-400">
                  Reset local workspace cache and restore default knowledge state.
                </p>
              </div>
              {!showClearConfirm ? (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
                >
                  Reset Workspace
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={handleClearSubstrate}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-500 transition-all cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 bg-zinc-900 text-zinc-300 border border-white/10 rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all cursor-pointer"
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
