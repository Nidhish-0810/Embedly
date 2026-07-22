"use client";
import React, { useState } from "react";
import { Copy, CheckCircle2, Code2, Globe, Bot } from "lucide-react";
import { useAgent } from "@/components/AgentContext";
import { motion } from "framer-motion";

export default function EmbedGenerator() {
  const { activeAgent } = useAgent();
  const [copied, setCopied] = useState(false);

  const embedCode = `<script 
  src="https://your-domain.com/widget.js" 
  data-agent-id="${activeAgent.id}"
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Code2 className="w-8 h-8 text-blue-500" />
          Embed & Share
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Deploy {activeAgent.name} to any website in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Generator Area */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/5 p-8 shadow-xl shadow-blue-500/5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Installation Code
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Paste this snippet right before the closing <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-300">&lt;/body&gt;</code> tag of your website.
            </p>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-lg transition-all group-hover:blur-xl"></div>
              <div className="relative bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">HTML</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-blue-300">
                    <code>{embedCode}</code>
                  </pre>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCopy}
              className={`w-full mt-6 py-4 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                copied 
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:scale-[1.02]"
              }`}
            >
              {copied ? (
                <><CheckCircle2 className="w-5 h-5" /> Copied to Clipboard!</>
              ) : (
                <><Copy className="w-5 h-5" /> Copy Code Snippet</>
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-800/20 rounded-3xl p-8 border border-blue-100 dark:border-white/5">
             <h3 className="font-bold text-lg mb-2">Need help?</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Read our documentation to learn how to integrate with WordPress, Webflow, Shopify, and more.</p>
             <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
               Read Integration Guide &rarr;
             </button>
          </div>
        </motion.div>

        {/* Live Preview Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[600px] bg-slate-200 dark:bg-black/40 rounded-3xl border border-slate-300 dark:border-white/10 overflow-hidden shadow-inner flex flex-col"
        >
          {/* Browser Mockup */}
          <div className="h-12 bg-slate-300 dark:bg-slate-900 border-b border-slate-400/50 dark:border-white/10 flex items-center px-4 gap-4">
             <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-400/50 dark:bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-400/50 dark:bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-400/50 dark:bg-slate-700"></div>
             </div>
             <div className="flex-1 max-w-sm mx-auto bg-white/50 dark:bg-slate-800 rounded-md h-6 flex items-center justify-center text-xs text-slate-500 font-medium">
               your-website.com
             </div>
          </div>
          <div className="flex-1 relative bg-white dark:bg-slate-950 p-8">
             <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6"></div>
             <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-900 rounded-lg mb-3"></div>
             <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-900 rounded-lg mb-3"></div>
             <div className="h-4 w-4/5 bg-slate-100 dark:bg-slate-900 rounded-lg mb-10"></div>
             
             <div className="grid grid-cols-2 gap-4">
               <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"></div>
               <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"></div>
             </div>
             
             {/* The Widget Preview */}
             <div className="absolute bottom-6 right-6 flex flex-col items-end">
               <div className="w-64 h-80 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl mb-4 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                  <div className={`h-14 ${
                    activeAgent?.theme === 'purple' ? 'bg-purple-600' : 
                    activeAgent?.theme === 'emerald' ? 'bg-emerald-600' : 
                    'bg-blue-600'
                  } flex items-center px-4 gap-3 text-white font-semibold text-sm`}>
                    <Bot className="w-5 h-5" />
                    {activeAgent.name}
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
                     <div className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-sm text-xs border border-slate-100 dark:border-slate-700 w-4/5 shadow-sm">
                       Hi there! 👋 How can I help you?
                     </div>
                  </div>
                  <div className="h-12 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"></div>
               </div>
               
              <div className={`w-14 h-14 rounded-full ${
                activeAgent?.theme === 'purple' ? 'bg-purple-600 shadow-purple-500/40' : 
                activeAgent?.theme === 'emerald' ? 'bg-emerald-600 shadow-emerald-500/40' : 
                'bg-blue-600 shadow-blue-500/40'
              } text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform`}>
                <Bot className="w-6 h-6" />
              </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
