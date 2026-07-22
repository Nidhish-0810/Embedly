"use client";
import React from "react";
import { MessageSquare, Users, BookOpen, TrendingUp, Zap, Clock, ExternalLink } from "lucide-react";
import { useAgent } from "@/components/AgentContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const data = [
  { name: 'Mon', conversations: 40, resolution: 24 },
  { name: 'Tue', conversations: 30, resolution: 13 },
  { name: 'Wed', conversations: 20, resolution: 98 },
  { name: 'Thu', conversations: 27, resolution: 39 },
  { name: 'Fri', conversations: 18, resolution: 48 },
  { name: 'Sat', conversations: 23, resolution: 38 },
  { name: 'Sun', conversations: 34, resolution: 43 },
];

export default function DashboardOverview() {
  const { activeAgent } = useAgent();

  const stats = [
    { label: "Total Conversations", value: "1,248", change: "+12%", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Knowledge Base Docs", value: "45", change: "+3", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Avg Resolution Time", value: "1.2s", change: "-15%", icon: Zap, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "Active Users Today", value: "342", change: "+5%", icon: Users, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with <strong className="text-slate-900 dark:text-slate-100">{activeAgent?.name}</strong> today.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-between hover:border-blue-500/50 transition-colors shadow-sm cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="lg:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-sm"
         >
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-lg font-bold">Conversations Volume</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Total queries processed over the last 7 days.</p>
             </div>
             <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium px-4 py-2 outline-none">
               <option>Last 7 days</option>
               <option>Last 30 days</option>
             </select>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeAgent?.theme === 'purple' ? '#a855f7' : '#3b82f6'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={activeAgent?.theme === 'purple' ? '#a855f7' : '#3b82f6'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }}
                    itemStyle={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="conversations" stroke={activeAgent?.theme === 'purple' ? '#a855f7' : '#3b82f6'} strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
         </motion.div>
         
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-sm flex flex-col"
         >
           <h3 className="text-lg font-bold mb-1">Recent Activity</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Latest interactions with your agent.</p>
           
           <div className="flex-1 space-y-4">
             {[
               { query: "How to reset password?", time: "2 min ago", status: "Resolved" },
               { query: "Pricing plans info", time: "15 min ago", status: "Resolved" },
               { query: "Talk to human", time: "1 hour ago", status: "Escalated" },
               { query: "Is this open source?", time: "3 hours ago", status: "Resolved" },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'Resolved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{item.query}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
               </div>
             ))}
           </div>
           
           <button className="w-full mt-4 py-3 bg-slate-100 dark:bg-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
             View All Logs
           </button>
         </motion.div>
      </div>
    </div>
  );
}
