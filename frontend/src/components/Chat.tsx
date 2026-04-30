import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import { GoogleGenerativeAI } from "@google/generative-ai";

import axios from 'axios';

export const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Neural Nexus initialized. I am your cognitive co-processor. How shall we expand your collective intelligence today?', time: 'System Ready' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, { prompt: currentInput });
      const text = response.data.reply;

      const assistantMessage = { 
        role: 'assistant', 
        content: text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Neural transmission interrupted. Please check your connectivity or API substrate.", 
        time: 'Error' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="px-6 lg:px-10 py-6 border-b border-white/[0.05] bg-[#05080f]/50 backdrop-blur-xl flex justify-between items-center relative z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              AI Co-Processor
            </h2>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium tracking-widest uppercase">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              {loading ? 'Processing Input...' : 'Substrate Ready'}
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 lg:px-20 space-y-10 scroll-hide relative z-10 pb-40">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex items-start gap-4 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' ? 'bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]' : 'bg-[#0a0f1a] border-white/5 shadow-2xl'
                }`}>
                  <span className={`material-symbols-outlined text-[20px] ${msg.role === 'user' ? 'text-primary' : 'text-slate-400'}`}>
                    {msg.role === 'user' ? 'person' : 'smart_toy'}
                  </span>
                </div>
                
                <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                   <div className={`p-6 rounded-[2rem] text-sm leading-relaxed shadow-2xl transition-all ${
                     msg.role === 'user' 
                       ? 'bg-primary/10 text-white border border-primary/20 rounded-tr-sm' 
                       : 'bg-[#0a0f1a]/60 backdrop-blur-2xl text-slate-200 border border-white/5 rounded-tl-sm'
                   }`}>
                     {msg.content}
                   </div>
                   <p className="text-[10px] font-mono text-slate-600 px-2 uppercase tracking-widest">{msg.time}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
               <div className="w-10 h-10 rounded-2xl bg-[#0a0f1a] border border-white/5 flex items-center justify-center mr-4">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 lg:px-20 z-20">
           <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
              
              <div className="glass-panel-elevated rounded-[2.5rem] p-3 flex items-center gap-3 border border-white/5 bg-[#0a0f1a]/80 backdrop-blur-3xl shadow-2xl relative z-10">
                 <button className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-500 transition-all">
                    <span className="material-symbols-outlined">attach_file</span>
                 </button>
                 <textarea 
                   className="flex-1 bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 py-3 text-sm resize-none scroll-hide min-h-[48px] max-h-[120px]" 
                   placeholder="Synthesize a new thought..."
                   rows={1}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                   disabled={loading}
                 />
                 <button 
                   onClick={handleSend}
                   disabled={loading || !input.trim()}
                   className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                     loading || !input.trim() ? 'bg-white/5 text-slate-600 border border-white/5' : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20'
                   }`}
                 >
                    <span className={`material-symbols-outlined font-bold ${loading ? 'animate-spin' : ''}`}>
                      {loading ? 'progress_activity' : 'send'}
                    </span>
                 </button>
              </div>
              <p className="text-center mt-4 text-[10px] text-slate-600 tracking-widest uppercase font-bold opacity-30">Quantum Encryption Layer Active</p>
           </div>
        </div>
      </main>
    </Layout>
  );
};

export default Chat;
