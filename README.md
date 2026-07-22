<div align="center">

# 🤖 Embedly

### Custom AI Agents. Deployed in Seconds.

Train a powerful AI agent on your own content — websites, PDFs, docs — and embed a smart chat widget on any site with a single line of code. 100% free.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![LangChain](https://img.shields.io/badge/LangChain-JS-brightgreen?style=for-the-badge)](https://js.langchain.com/)
[![Groq](https://img.shields.io/badge/Groq-LPU-orange?style=for-the-badge)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## 📖 What is Embedly?

Embedly is a **production-ready, open-source AI agent platform** built on the modern RAG (Retrieval-Augmented Generation) paradigm. Instead of using a generic ChatGPT-style assistant, you train your own AI agent exclusively on *your* content — your documentation, support articles, product pages, or any data you provide.

Once trained, you can deploy the agent as a beautiful, embedded chat widget anywhere on the web with a single `<script>` tag.

The entire stack runs on **free-tier services**, making it the perfect boilerplate for indie developers, startups, and SaaS products.

---

## ✨ Core Features

### 🧠 RAG-Powered Intelligence
The agent doesn't hallucinate. It answers questions based only on the knowledge you provide. Powered by LangChain's retrieval pipeline, HuggingFace embeddings, and Supabase pgvector for semantic search.

### 🎛️ Multi-Agent Dashboard
Manage multiple distinct AI agents from a single dashboard. Each agent has its own knowledge base, system prompt, name, and color theme.

### 📚 Knowledge Base Ingestion
- **Website Scraper**: Paste a URL and Embedly will fetch, parse, chunk, and embed the page content automatically using Cheerio.
- **File Upload**: Upload PDF, DOCX, and TXT files to train your agent on offline documents.

### 💬 Live Chat Playground
Test any agent instantly in the built-in chat playground before deploying it to your website. Supports full markdown rendering.

### 🔌 One-Line Embed
Generate a `<script>` snippet and paste it into your website's HTML. That's it. The chat bubble appears instantly, styled to match your agent's theme.

### ⚡ Groq LPU Speed
Leverage Groq's Language Processing Unit to get Llama 3 responses in milliseconds — noticeably faster than standard GPU inference.

### 📊 Analytics Dashboard
Visualize conversation trends over time with built-in Recharts graphs — see how your users are interacting with your agents.

### 🎨 Beautiful, Polished UI
- Dark-mode first design with glassmorphism and gradient aesthetics
- Buttery smooth animations with Framer Motion
- Lenis smooth scroll on the landing page
- Fully responsive across desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Animations** | Framer Motion + Lenis | Smooth UI transitions & scroll |
| **AI Orchestration** | LangChain JS | RAG pipeline & prompt chaining |
| **LLM** | Groq (Llama-3.1-8B-Instant) | Ultra-fast free inference |
| **Embeddings** | HuggingFace Inference (bge-small-en-v1.5) | Open-source text embeddings |
| **Vector DB** | Supabase (pgvector) | Semantic similarity search |
| **Web Scraping** | Cheerio | HTML parsing & text extraction |
| **Text Splitting** | LangChain TextSplitters | Intelligent document chunking |
| **Icons** | Lucide React | Clean, consistent icon set |
| **Charts** | Recharts | Analytics data visualization |
| **Toasts** | Sonner | Elegant notification system |

---

## 🏗️ Architecture

```
User Input (Question)
        │
        ▼
  [ /api/chat ]
        │
        ├── 1. Embed question → HuggingFace Inference API
        │
        ├── 2. Similarity Search → Supabase pgvector
        │         └── Returns top N relevant document chunks
        │
        ├── 3. Build prompt context (Question + Retrieved Docs)
        │
        ├── 4. LangChain RunnableSequence
        │         └── PromptTemplate → ChatGroq (Llama 3) → StringOutputParser
        │
        └── 5. Return { answer, sources } → Client
```

```
User Submits URL (Training)
        │
        ▼
  [ /api/ingest ]
        │
        ├── 1. Fetch URL → Cheerio parses HTML → Extract clean text
        │
        ├── 2. RecursiveCharacterTextSplitter
        │         └── Chunks: 1000 chars, 200 overlap
        │
        ├── 3. HuggingFace → Generate embedding vectors for each chunk
        │
        └── 4. SupabaseVectorStore.fromDocuments() → Store in pgvector
```

---

## 🚀 Getting Started

### Prerequisites

You need accounts on these services (all 100% free):
- **[Supabase](https://supabase.com/)** — Free Postgres DB with pgvector
- **[Groq](https://console.groq.com/)** — Free LLM inference API key
- **[HuggingFace](https://huggingface.co/)** — (Optional) For higher embedding rate limits

### 1. Clone the Repository

```bash
git clone https://github.com/Nidhish-0810/Embedly.git
cd Embedly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase — found in your project's API settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Groq — from https://console.groq.com/keys
GROQ_API_KEY=your-groq-api-key

# HuggingFace (Optional — increases rate limits for embeddings)
# HUGGINGFACEHUB_API_TOKEN=your-hf-token
```

### 4. Initialize Supabase Database

Open the **SQL Editor** in your Supabase dashboard and run:

```sql
-- Step 1: Enable the pgvector extension
create extension if not exists vector;

-- Step 2: Create the documents table
create table documents (
  id        bigserial primary key,
  content   text,
  metadata  jsonb,
  embedding vector(384)
);

-- Step 3: Create the similarity search function
create or replace function match_documents (
  query_embedding vector(384),
  match_count     int     default null,
  filter          jsonb   default '{}'
)
returns table (
  id         bigint,
  content    text,
  metadata   jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

---

## 📁 Project Structure

```
Embedly/
├── public/
│   └── widget.js                  # Drop-in embeddable chat script
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts       # POST /api/chat — RAG query endpoint
│   │   │   └── ingest/
│   │   │       └── route.ts       # POST /api/ingest — Scrape & embed URLs
│   │   │
│   │   ├── dashboard/
│   │   │   ├── agents/
│   │   │   │   └── page.tsx       # Chat Playground with Settings Panel
│   │   │   ├── embed/
│   │   │   │   └── page.tsx       # Embed Code Generator with Live Preview
│   │   │   ├── integrations/
│   │   │   │   └── page.tsx       # Third-party Integrations Page
│   │   │   ├── knowledge/
│   │   │   │   └── page.tsx       # Knowledge Base Management & Ingestion
│   │   │   ├── settings/
│   │   │   │   └── page.tsx       # Profile, API Keys & Billing Settings
│   │   │   ├── layout.tsx         # Dashboard shell (sidebar + header)
│   │   │   └── page.tsx           # Analytics overview
│   │   │
│   │   ├── widget/
│   │   │   └── [agentId]/
│   │   │       └── page.tsx       # Iframe-ready chat widget per agent
│   │   │
│   │   ├── login/page.tsx         # Auth — Sign In page
│   │   ├── signup/page.tsx        # Auth — Sign Up page
│   │   ├── globals.css            # Global styles & custom scrollbars
│   │   ├── layout.tsx             # Root layout (Geist font, Toaster)
│   │   └── page.tsx               # Landing page with hero & features
│   │
│   ├── components/
│   │   ├── AgentContext.tsx        # Global Agent state (React Context)
│   │   └── SmoothScrolling.tsx    # Lenis smooth scroll provider
│   │
│   └── utils/
│       └── supabase/
│           └── client.ts          # Supabase browser client
│
├── .env.local                     # Your environment variables (not committed)
├── next.config.ts                 # Next.js config with image domains
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## 🔌 Embedding the Widget

Once you have an agent set up in your dashboard, navigate to the **Embed & Share** tab. You'll get a script snippet like this:

```html
<!-- Paste before the closing </body> tag on your website -->
<script
  src="https://your-embedly-deployment.vercel.app/widget.js"
  data-agent-id="your-agent-id"
></script>
```

That's all it takes. The chat widget will appear as a floating button on your website, ready to answer visitor questions based on your trained knowledge base.

---

## 🗺️ Roadmap

- [ ] Real Supabase Auth (email/password, OAuth)
- [ ] PDF file upload & parsing via LangChain PDFLoader
- [ ] Persistent conversation history
- [ ] Webhook / Zapier integration
- [ ] Notion & Google Drive data connectors
- [ ] Custom branding (colors, logo, avatar) per agent
- [ ] Usage analytics (token count, response time)
- [ ] One-click Vercel deployment button

---



## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">

Built by [Nidhish Suvarna](https://github.com/Nidhish-0810)

</div>
