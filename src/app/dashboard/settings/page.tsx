"use client";
import React, { useState } from "react";
import { Settings, CreditCard, Key, User, Copy, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "api" | "billing">("profile");
  
  // API Key state
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiKey = "emb_live_9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-500" />
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account, billing, and API keys.</p>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-xl shadow-blue-500/5 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
          
          {/* Sidebar */}
          <div className="border-r border-slate-200/50 dark:border-white/10 p-4 bg-slate-50/50 dark:bg-black/10">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === "profile" 
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <User className="w-4 h-4" /> Account Profile
              </button>
              <button 
                onClick={() => setActiveTab("api")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === "api" 
                    ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Key className="w-4 h-4" /> API Keys
              </button>
              <button 
                onClick={() => setActiveTab("billing")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === "billing" 
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <CreditCard className="w-4 h-4" /> Billing & Plan
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="col-span-3 p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-xl">
                  <h2 className="text-xl font-bold border-b border-slate-200/50 dark:border-white/10 pb-4">Account Profile</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 p-[2px]">
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold rounded-xl transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Display Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors opacity-70 cursor-not-allowed"
                        disabled
                      />
                      <p className="text-xs text-slate-500 mt-2">Email address cannot be changed right now.</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200/50 dark:border-white/10 mt-6">
                    <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {/* API KEYS TAB */}
              {activeTab === "api" && (
                <motion.div key="api" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-200/50 dark:border-white/10 pb-4">API Keys</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">These keys will allow you to authenticate API requests.</p>
                  
                  <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="font-semibold mb-1">Production Key</h3>
                    <p className="text-xs text-slate-500 mb-4">Use this key in your production environment. Keep it secret.</p>
                    
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showKey ? "text" : "password"}
                          value={apiKey}
                          readOnly
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono tracking-wider focus:outline-none"
                        />
                        <button 
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button 
                        onClick={handleCopy}
                        className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center min-w-[100px]"
                      >
                        {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button className="text-red-500 hover:text-red-600 font-medium text-sm">
                      Revoke Key
                    </button>
                  </div>
                </motion.div>
              )}

              {/* BILLING TAB */}
              {activeTab === "billing" && (
                <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-200/50 dark:border-white/10 pb-4">Billing & Plan</h2>
                  
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100px] -z-10"></div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                          Current Plan
                        </span>
                        <h3 className="text-2xl font-bold">Pro Plan</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-extrabold">$29</span><span className="text-slate-500">/mo</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Agents</span>
                        <span className="font-bold">2 / 5</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full w-2/5"></div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors text-sm">
                        Upgrade Plan
                      </button>
                      <button className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-semibold py-2 px-6 rounded-xl transition-colors text-sm">
                        Manage Billing
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold mt-10 mb-4">Payment Methods</h3>
                  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-xs shadow-sm">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-sm">Visa ending in 4242</p>
                          <p className="text-xs text-slate-500">Expires 12/24</p>
                        </div>
                     </div>
                     <button className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                       Edit
                     </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
