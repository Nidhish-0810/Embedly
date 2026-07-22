"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Bot, Code, Database, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="flex-1 w-full bg-[#030712] text-white selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
             <Bot className="w-5 h-5 text-white" />
           </div>
           <span className="font-bold text-xl tracking-tight">Embedly</span>
         </div>
         <div className="flex items-center gap-6">
           <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
             <a href="#features" className="hover:text-white transition-colors">Features</a>
             <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
             <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
           </div>
           <Link href="/dashboard" className="px-5 py-2.5 rounded-full bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition-colors">
             Dashboard
           </Link>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[150px] -z-10"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] -z-10"></div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Embedly Version 2.0 is now live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 max-w-5xl mx-auto leading-[1.1]"
          >
            Custom AI Agents <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Deployed in Seconds.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium"
          >
            Upload your PDFs, Notion docs, and websites. Train a powerful Llama-3 model for free, and embed a smart chat widget directly on your site.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard" className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2 text-lg">
              Start Building Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard/agents" className="px-8 py-4 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-lg backdrop-blur-sm">
              View Demo Playground
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div 
          style={{ y, opacity }}
          className="mt-24 relative w-full max-w-6xl mx-auto px-4 z-10"
        >
           <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden">
             <div className="flex items-center px-4 py-3 border-b border-white/10 bg-black/40 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-slate-500 font-mono">dashboard / agents / default</div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
                {/* Code Panel */}
                <div className="border-r border-white/10 p-6 font-mono text-sm overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
                   <p className="text-slate-500 mb-4">// 1. Embed the script</p>
                   <p className="text-blue-400">{'<script'}</p>
                   <p className="pl-4 text-purple-300">src=<span className="text-emerald-300">"https://embedly.ai/widget.js"</span></p>
                   <p className="pl-4 text-purple-300">data-agent=<span className="text-emerald-300">"default"</span></p>
                   <p className="text-blue-400">{'>'}</p>
                   <p className="text-blue-400">{'</script>'}</p>
                   
                   <p className="text-slate-500 mt-8 mb-4">// 2. Start chatting</p>
                   <div className="flex items-center gap-2 text-slate-300 bg-white/5 p-2 rounded">
                     <span className="text-green-400">●</span> System Online
                   </div>
                </div>
                
                {/* Chat Panel */}
                <div className="col-span-2 bg-[#0a0a0a] p-6 md:p-10 relative">
                   <div className="flex flex-col gap-6 max-w-md mx-auto">
                     <div className="self-end bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-lg text-sm w-4/5">
                        How do I integrate this into my Next.js app?
                     </div>
                     <div className="self-start flex gap-3 w-[90%]">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                           <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-800 border border-white/10 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-sm shadow-lg">
                           <p className="mb-2">It's simple! Just add the script tag to your <code className="text-purple-300 bg-black/50 px-1 py-0.5 rounded">app/layout.tsx</code> file before the closing body tag.</p>
                           <p>Our agent will automatically index your site if you provide the URL in the dashboard.</p>
                        </div>
                     </div>
                   </div>
                </div>
             </div>
           </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-slate-950 relative z-20 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">for free</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">We leverage generous free tiers from Supabase and Groq so you can run your AI agent without a credit card.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Supabase Vector</h3>
              <p className="text-slate-400 leading-relaxed">Store thousands of document embeddings using pgvector on Supabase's free tier database.</p>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-colors group">
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Groq LPU Speed</h3>
              <p className="text-slate-400 leading-relaxed">Experience lightning-fast generation with Llama-3 running on Groq's free API tier.</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-colors group">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Drop-in Widget</h3>
              <p className="text-slate-400 leading-relaxed">Embed a smart chat interface on your site with a single line of JavaScript code.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10 text-center relative z-20">
        <div className="flex items-center justify-center gap-2 mb-6">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
             <Bot className="w-5 h-5 text-white" />
           </div>
           <span className="font-bold text-xl tracking-tight">Embedly</span>
        </div>
        <p className="text-slate-500 mb-6 font-medium">Built as a demonstration of modern RAG platforms.</p>
        <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Terms</a>
           <a href="#" className="hover:text-white transition-colors">Twitter</a>
           <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>
    </main>
  );
}
