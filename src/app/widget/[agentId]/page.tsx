"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function WidgetPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  
  const [messages, setMessages] = useState<{ role: "user" | "bot" | "error"; content: string }[]>([
    { role: "bot", content: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ message: userMessage, agentId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: "bot", content: data.answer || data.response || "I received your message." }]);
      } else {
        setMessages(prev => [...prev, { role: "error", content: data.error || "An error occurred." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "error", content: "Failed to connect." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans m-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between shadow-md relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Bot className="w-6 h-6" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">AI Assistant</h3>
            <p className="text-[11px] text-blue-100 font-medium opacity-90">Usually replies instantly</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[length:100px_100px] bg-blend-overlay bg-slate-50 dark:bg-slate-900 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] sm:text-sm shadow-sm ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-sm" 
                : msg.role === "error"
                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-tl-sm text-red-600 dark:text-red-400"
                : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm text-slate-700 dark:text-slate-300"
            }`}>
              {msg.role === "user" || msg.role === "error" ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-snug prose-pre:my-2 prose-pre:p-2 prose-pre:bg-slate-100 dark:prose-pre:bg-slate-900 prose-pre:rounded-lg">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-4 shadow-sm flex items-center gap-2">
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full pl-4 pr-12 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white flex items-center justify-center transition-transform active:scale-95 disabled:active:scale-100 shadow-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </form>
        <div className="text-center mt-2 text-[10px] text-slate-400 font-medium">
          Powered by <span className="text-blue-500 font-bold">Embedly</span>
        </div>
      </div>
    </div>
  );
}
