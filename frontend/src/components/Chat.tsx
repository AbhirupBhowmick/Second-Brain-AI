import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import { useNotes } from '../context/NotesContext';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const Chat: React.FC = () => {
  const { notes } = useNotes();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `AI Co-Processor ready. I have indexed ${notes.length} note nodes from your knowledge substrate. Ask me questions about your architecture, research, or notes!`,
      time: 'System Ready',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    const contextText = notes.map((n) => `Note: ${n.title}\nContent: ${n.content}`).join('\n\n');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      if (baseUrl) {
        const response = await axios.post(`${baseUrl}/api/chat`, {
          prompt: `Knowledge Base Context:\n${contextText}\n\nUser Question: ${currentInput}`,
        });
        const text = response.data.reply;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Fallback intelligent query matching user's active notes
        setTimeout(() => {
          const matches = notes.filter(
            (n) =>
              n.content.toLowerCase().includes(currentInput.toLowerCase()) ||
              n.title.toLowerCase().includes(currentInput.toLowerCase()) ||
              n.tags.some((t) => currentInput.toLowerCase().includes(t.toLowerCase()))
          );

          let replyText = '';
          if (matches.length > 0) {
            replyText = `Based on your note **${matches[0].title}**:\n\n${matches[0].summary || matches[0].content}\n\n*Related tags: ${matches[0].tags.map((t) => '#' + t).join(' ')}*`;
          } else {
            replyText = `I searched across your ${notes.length} knowledge nodes. Key subjects in your substrate include ${notes.slice(0, 3).map((n) => `"${n.title}"`).join(', ')}. How would you like to build on these?`;
          }

          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: replyText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setLoading(false);
        }, 500);
        return;
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Analyzed notes: ${notes.slice(0, 2).map((n) => `"${n.title}"`).join(' and ')}. Feel free to add more notes or refine your question.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#09090b]">
        {/* Header */}
        <header className="px-6 lg:px-8 py-4 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center relative z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400">smart_toy</span>
              AI Co-Processor
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {notes.length} Notes Loaded
            </span>
          </div>
        </header>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 lg:px-20 space-y-6 scroll-hide relative z-10 pb-36">
          {messages.map((msg, i) => (
            <div
              key={i}
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
          ))}

          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08]">
                <div className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
                <span className="text-xs text-zinc-400 font-mono">Analyzing notes...</span>
              </div>
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
                placeholder="Ask AI about your notes (Press Enter to send)..."
                rows={1}
                className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 px-3 py-2 text-sm resize-none"
              />
              <button
                onClick={handleSend}
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
