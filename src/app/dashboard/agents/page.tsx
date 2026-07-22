"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Settings2, Sliders, Palette, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { useAgent } from "@/components/AgentContext";
import { toast } from "sonner";

export default function ChatPlayground() {
  const { activeAgent, setActiveAgent } = useAgent();
  const [messages, setMessages] = useState<{ role: "user" | "bot" | "error"; content: string }[]>([
    { role: "bot", content: `Hi! I'm ${activeAgent.name}. Ask me anything based on the knowledge base you've ingested.` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [agentName, setAgentName] = useState(activeAgent.name);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful customer support assistant. Answer queries based only on the provided context.");
  const [theme, setTheme] = useState<"blue" | "purple" | "emerald">(activeAgent.theme);

  useEffect(() => {
    setMessages([{ role: "bot", content: `Hi! I'm ${activeAgent.name}. Ask me anything based on the knowledge base you've ingested.` }]);
    setAgentName(activeAgent.name);
    setTheme(activeAgent.theme);
  }, [activeAgent]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, agentId: activeAgent.id }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setMessages(prev => [...prev, { role: "error", content: data.error || "An error occurred." }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", content: data.answer }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "error", content: "Failed to connect to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    setActiveAgent({ ...activeAgent, name: agentName, theme });
    toast.success("Agent settings saved successfully!");
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      
      {/* Settings Panel */}
      <AnimatePresence initial={false}>
        {isSettingsOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-500" />
                Configuration
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <div>
                 <label className="block text-sm font-semibold mb-2">Agent Name</label>
                 <input 
                   type="text" 
                   value={agentName}
                   onChange={(e) => setAgentName(e.target.value)}
                   className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                 />
               </div>

               <div>
                 <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                   <Sliders className="w-4 h-4 text-slate-400" />
                   System Prompt
                 </label>
                 <textarea 
                   rows={4}
                   value={systemPrompt}
                   onChange={(e) => setSystemPrompt(e.target.value)}
                   className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                 />
                 <p className="text-xs text-slate-500 mt-2">Defines how the agent behaves and responds.</p>
               </div>

               <div>
                 <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                   <Palette className="w-4 h-4 text-slate-400" />
                   Widget Theme
                 </label>
                 <div className="flex gap-3">
                   <button 
                     onClick={() => setTheme('blue')}
                     className={`w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center transition-transform ${theme === 'blue' ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-500 scale-110' : 'hover:scale-105'}`}
                   ></button>
                   <button 
                     onClick={() => setTheme('purple')}
                     className={`w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center transition-transform ${theme === 'purple' ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-purple-500 scale-110' : 'hover:scale-105'}`}
                   ></button>
                   <button 
                     onClick={() => setTheme('emerald')}
                     className={`w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center transition-transform ${theme === 'emerald' ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-emerald-500 scale-110' : 'hover:scale-105'}`}
                   ></button>
                 </div>
               </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <button 
                onClick={handleSaveSettings}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <div className="flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-xl flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${theme === 'purple' ? 'bg-purple-500' : theme === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'} flex items-center justify-center shadow-lg`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">{agentName || 'Agent Playground'}</h2>
              <div className="flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                 <span className="text-xs text-slate-500">Ready to test</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-lg transition-colors ${isSettingsOpen ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm ${
                  msg.role === "user" ? "bg-slate-200 dark:bg-slate-800" : 
                  msg.role === "error" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : 
                  `${theme === 'purple' ? 'bg-purple-500' : theme === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'} text-white`
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-slate-500" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm text-sm ${
                  msg.role === "user" 
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-tr-sm" 
                    : msg.role === "error"
                    ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-tl-sm"
                    : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none"
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${theme === 'purple' ? 'bg-purple-500' : theme === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'} text-white shadow-sm`}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1 items-center h-[52px]">
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 relative z-10">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${agentName || 'the agent'} a question...`}
              disabled={isLoading}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-2 p-2.5 rounded-xl transition-all ${
                input.trim() && !isLoading 
                  ? `${theme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : theme === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-md` 
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400"
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3 flex justify-center items-center gap-1.5 text-xs text-slate-400 font-medium">
             <Sparkles className="w-3 h-3 text-amber-500" />
             AI can make mistakes. Verify important information.
          </div>
        </div>
      </div>
    </div>
  );
}
