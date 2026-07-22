"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Link as LinkIcon, FileText, Trash2, CheckCircle2, Loader2, Database, LayoutList, Search, File as FileIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAgent } from "@/components/AgentContext";

// Note: We use FileIcon alias to avoid conflict with the browser's built-in File type
interface DocRecord {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  status: "Indexed" | "Indexing...";
}

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<"upload" | "website" | "manage">("manage");
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileArray, setFileArray] = useState<File[]>([]);
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { activeAgent } = useAgent();

  // Mock Data for "Manage Documents"
  const [documents, setDocuments] = useState<DocRecord[]>([
    { id: 1, name: "support_handbook.pdf", type: "PDF", size: "2.4 MB", date: "Oct 24, 2023", status: "Indexed" },
    { id: 2, name: "https://example.com/pricing", type: "URL", size: "-", date: "Oct 25, 2023", status: "Indexed" },
    { id: 3, name: "company_policies.docx", type: "DOCX", size: "1.1 MB", date: "Oct 25, 2023", status: "Indexing..." },
  ]);

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setFileArray(Array.from(e.target.files));
      toast.success(`${e.target.files.length} file(s) selected for ${activeAgent?.name}.`);
    }
  };

  const handleUpload = () => {
    if (!fileArray.length) return;
    setIsProcessing(true);
    toast.promise(
      new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      {
        loading: `Generating embeddings for ${activeAgent?.name}...`,
        success: () => {
          setIsProcessing(false);
          const newDocs: DocRecord[] = fileArray.map((f, i) => ({
            id: Date.now() + i,
            name: f.name,
            type: f.name.split(".").pop()?.toUpperCase() || "FILE",
            size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
            date: "Just now",
            status: "Indexed",
          }));
          setDocuments(prev => [...newDocs, ...prev]);
          setFiles(null);
          setFileArray([]);
          setActiveTab("manage");
          return "Document(s) successfully added to Knowledge Base!";
        },
        error: "Failed to process document.",
      }
    );
  };

  const handleScrape = async () => {
    if (!url) return;
    setIsProcessing(true);

    toast.promise(
      fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, agentId: activeAgent?.id || "default" }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      }),
      {
        loading: `Scraping and training ${activeAgent?.name}...`,
        success: (data: { chunks: number }) => {
          setIsProcessing(false);
          const newDoc: DocRecord = { id: Date.now(), name: url, type: "URL", size: "-", date: "Just now", status: "Indexed" };
          setDocuments(prev => [newDoc, ...prev]);
          setUrl("");
          setActiveTab("manage");
          return `Successfully ingested ${data.chunks} chunks!`;
        },
        error: (err: Error) => {
          setIsProcessing(false);
          return `Error: ${err.message}`;
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document removed from Knowledge Base.");
  };

  const tabs = [
    { key: "manage" as const, label: "Manage Data", icon: LayoutList },
    { key: "upload" as const, label: "Upload Files", icon: UploadCloud },
    { key: "website" as const, label: "Import Website", icon: LinkIcon },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-500" />
          Knowledge Base
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Train <strong className="text-slate-900 dark:text-slate-100">{activeAgent?.name}</strong> with your custom data.
        </p>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-xl shadow-blue-500/5 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200/50 dark:border-white/10 p-2 gap-2 bg-slate-50/50 dark:bg-black/10">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700"
                  : "text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">

            {/* MANAGE TAB */}
            {activeTab === "manage" && (
              <motion.div
                key="manage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">Ingested Documents</h3>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-full">
                      {documents.length} items
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-52 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Data
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Date Added</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredDocs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-3 text-slate-400">
                              <Database className="w-12 h-12 opacity-20" />
                              <p className="font-medium">
                                {searchQuery ? "No documents match your search." : "No documents yet. Start by uploading files or importing a website."}
                              </p>
                              {!searchQuery && (
                                <button onClick={() => setActiveTab("upload")} className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
                                  + Add your first document
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredDocs.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4 font-medium">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  doc.type === "URL" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-blue-100 dark:bg-blue-900/30"
                                }`}>
                                  {doc.type === "URL"
                                    ? <LinkIcon className="w-4 h-4 text-purple-500" />
                                    : <FileIcon className="w-4 h-4 text-blue-500" />}
                                </div>
                                <span className="truncate max-w-[200px] text-slate-900 dark:text-slate-100">{doc.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold">
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{doc.date}</td>
                            <td className="px-6 py-4">
                              <span className={`flex items-center gap-1.5 text-xs font-semibold ${doc.status === "Indexed" ? "text-emerald-500" : "text-amber-500"}`}>
                                {doc.status === "Indexed"
                                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                                  : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {doc.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label="Delete document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* UPLOAD TAB */}
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload your documents</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center text-sm">
                  Drag and drop your PDF, DOCX, or TXT files here to train your AI agent.
                </p>

                <label className="cursor-pointer relative group">
                  <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.docx" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                  <div className="relative px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">Browse Files</span>
                  </div>
                </label>

                {fileArray.length > 0 && (
                  <div className="mt-8 w-full max-w-md">
                    <p className="text-sm font-semibold mb-3">Selected Files ({fileArray.length})</p>
                    <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2">
                      {fileArray.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <span className="text-slate-400 text-xs flex-shrink-0 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleUpload}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isProcessing
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <><UploadCloud className="w-5 h-5" /> Train AI on Files</>}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* WEBSITE TAB */}
            {activeTab === "website" && (
              <motion.div
                key="website"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-12 max-w-md mx-auto"
              >
                <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <LinkIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Scrape a Website</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-center text-sm">
                  Enter a URL and our scraper will extract the text, chunk it, and add it to your Supabase vector store automatically.
                </p>

                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/docs"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <button
                    onClick={handleScrape}
                    disabled={!url || isProcessing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-purple-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isProcessing
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <><LinkIcon className="w-5 h-5" /> Fetch & Train Model</>}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
