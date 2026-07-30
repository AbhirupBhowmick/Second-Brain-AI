import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import { useNotes } from '../context/NotesContext';
import axios from 'axios';
import { getApiUrl } from '../config/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const Chat: React.FC = () => {
  const { notes } = useNotes();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMessage: Message = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideInput) setInput('');
    setLoading(true);

    const contextText = notes
      .slice(0, 10)
      .map((n) => `Title: ${n.title}\nContent: ${n.content}`)
      .join('\n\n');

    try {
      const response = await axios.post(getApiUrl('/api/chat'), {
        prompt: textToSend,
      });

      if (response.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg_' + (Date.now() + 1),
            role: 'assistant',
            content: response.data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setError('Invalid AI response received from server.');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const serverMsg = err.response?.data?.message || 
        (err.response?.status === 401 ? 'Authentication failure (401): Invalid or missing AI API key. Please verify your environment configuration.' : null) ||
        err.response?.data?.reply || 
        err.message || 
        'AI Service unavailable. Verify API configuration or try again.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#09090b]">
        {/* Header */}
        <header className="px-6 lg:px-8 py-3.5 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center relative z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400">smart_toy</span>
              AI Co-Processor
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              AI Assistant Engine
            </span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Clear Chat
            </button>
          )}
        </header>

        {/* Chat Messages List / Empty State */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 lg:px-20 space-y-6 scroll-hide relative z-10 pb-36">
          {messages.length === 0 ? (
            /* Clean Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <span className="material-symbols-outlined text-3xl">smart_toy</span>
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white">No conversations found</h3>
                <p className="text-xs text-zinc-400 font-light">
                  Ask a question or brainstorm with your AI assistant using your notes as context.
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 max-w-md w-full">
                {[
                  'Summarize my active notes',
                  'What topics are documented?',
                  'Help me structure a new project',
                  'Find architecture notes',
                ].map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => handleSend(promptText)}
                    className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs text-zinc-300 text-left transition-all cursor-pointer"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                <div className={`flex items-start gap-3 max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      msg.role === 'user'
                        ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300'
                        : 'bg-zinc-900 border-white/[0.1] text-zinc-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {msg.role === 'user' ? 'person' : 'smart_toy'}
                    </span>
                  </div>

                  <div className={`space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-md ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-zinc-900/90 text-zinc-200 border border-white/[0.08] rounded-tl-none font-light'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 px-1">{msg.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08]">
                <div className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                <span className="text-xs text-zinc-400 font-mono">Processing AI request...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 animate-in fade-in">
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Floating Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:px-20 z-20 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-zinc-900/90 border border-white/[0.1] focus-within:border-indigo-500/50 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Ask AI about your notes (Press Enter)..."
                rows={1}
                className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 px-3 py-2 text-sm resize-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Chat;
