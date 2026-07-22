"use client";
import React from "react";
import { Plug, Database, MessageSquare, Zap, Search, LayoutTemplate, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function IntegrationsPage() {
  const integrations = [
    { name: "Notion", description: "Sync pages and databases automatically.", icon: LayoutTemplate, color: "text-slate-800 dark:text-slate-200", bg: "bg-slate-100 dark:bg-slate-800", status: "Coming Soon" },
    { name: "Google Drive", description: "Ingest Docs, Sheets, and PDFs from folders.", icon: Database, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", status: "Coming Soon" },
    { name: "Zendesk", description: "Train on your historical support tickets.", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", status: "Coming Soon" },
    { name: "Slack", description: "Deploy your agent into Slack channels.", icon: Layers, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", status: "Coming Soon" },
    { name: "Zapier", description: "Connect to 5,000+ apps via webhooks.", icon: Zap, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", status: "Coming Soon" },
    { name: "Algolia", description: "Sync vector search with Algolia indices.", icon: Search, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30", status: "Coming Soon" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Plug className="w-8 h-8 text-blue-500" />
          Integrations
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Connect your AI agents to the tools you already use.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((app, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col hover:border-blue-500/50 transition-colors shadow-sm cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent -z-10 group-hover:scale-150 transition-transform"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${app.bg} flex items-center justify-center shadow-inner`}>
                <app.icon className={`w-6 h-6 ${app.color}`} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                {app.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{app.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{app.description}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
              <button disabled className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-sm font-medium">
                Connect
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
