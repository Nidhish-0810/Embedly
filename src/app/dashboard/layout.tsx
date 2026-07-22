"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, FileText, Settings, LayoutDashboard, Menu, X, Bell, Code, Plug, ChevronDown, Check, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentProvider, useAgent, Agent } from "@/components/AgentContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  const { agents, activeAgent, setActiveAgent, addAgent } = useAgent();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Knowledge Base", href: "/dashboard/knowledge", icon: FileText },
    { name: "Chat Playground", href: "/dashboard/agents", icon: Bot },
    { name: "Embed & Share", href: "/dashboard/embed", icon: Code },
    { name: "Integrations", href: "/dashboard/integrations", icon: Plug },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="w-72 border-r border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-xl flex-col relative z-20 hidden md:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none" />
        
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8 relative z-10 group w-max">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Embedly</span>
          </Link>

          {/* Agent Switcher */}
          <div className="relative z-20 mb-6">
            <button 
              onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white ${
                  activeAgent.theme === 'purple' ? 'bg-purple-500' : 
                  activeAgent.theme === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Agent</p>
                  <p className="font-medium text-sm truncate">{activeAgent.name}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </button>

            <AnimatePresence>
              {isAgentDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30"
                >
                  {agents.map(agent => (
                    <button 
                      key={agent.id}
                      onClick={() => { setActiveAgent(agent); setIsAgentDropdownOpen(false); }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${
                          agent.theme === 'purple' ? 'bg-purple-500' : 
                          agent.theme === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}>
                          <Bot className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium">{agent.name}</span>
                      </div>
                      {activeAgent.id === agent.id && <Check className="w-4 h-4 text-blue-500" />}
                    </button>
                  ))}
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                  <button 
                    onClick={() => {
                      const name = prompt("Enter new agent name:");
                      if (name && name.trim()) {
                        const themes: Agent['theme'][] = ['blue', 'purple', 'emerald'];
                        addAgent({ 
                          id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), 
                          name: name.trim(), 
                          theme: themes[agents.length % themes.length] 
                        });
                        setIsAgentDropdownOpen(false);
                      }
                    }}
                    className="w-full p-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-left flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create New Agent
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <nav className="space-y-1 relative z-10 flex-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
                  isActive 
                    ? "text-blue-600 dark:text-blue-400 font-semibold" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "group-hover:text-slate-900 dark:group-hover:text-slate-200"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto relative z-10 p-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-white/5 dark:to-white/5 border border-blue-100 dark:border-white/10">
             <p className="text-sm font-medium mb-1">Pro Plan</p>
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">2/5 Agents Active</p>
             <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full w-2/5"></div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Mobile Header */}
        <header className={`md:hidden h-16 px-4 flex items-center justify-between z-30 transition-all ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10' : 'bg-transparent'}`}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Embedly</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Desktop Topbar */}
        <header className="hidden md:flex h-20 px-10 items-center justify-between border-b border-transparent">
          {/* Breadcrumb could go here */}
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-transparent overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 top-16 bg-white dark:bg-[#0a0a0a] z-20 md:hidden flex flex-col p-6 border-b border-slate-200 dark:border-white/10"
            >
              <nav className="space-y-2 flex-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                        isActive 
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" 
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-4 md:px-10 md:py-6 relative">
           {/* Subtle background glow for main content area */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
           {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      <DashboardContent>{children}</DashboardContent>
    </AgentProvider>
  );
}
