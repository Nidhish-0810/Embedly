# Embedly 🤖

**Custom AI Agents Deployed in Seconds.**

Embedly is a modern, full-stack AI platform that allows you to train custom AI agents on your own data (websites, PDFs, etc.) and deploy them as a chat widget on any website. 

Built completely on free-tier services, Embedly leverages the blazing fast **Groq LPU**, **Supabase Vector**, and **LangChain** to provide an enterprise-grade RAG (Retrieval-Augmented Generation) pipeline at zero cost.

---

## ✨ Features

- **Full RAG Pipeline**: Ingest websites and documents, chunk them, embed them, and store them in a vector database.
- **Agent Dashboard**: Manage multiple agents, customize their themes (Blue, Purple, Emerald), and test them in a live playground.
- **Knowledge Base Management**: Upload PDFs, DOCX, TXT files or directly scrape websites to train your agents.
- **Drop-in Chat Widget**: Generate a single-line `<script>` tag to embed the chat interface into any external website.
- **Modern UI/UX**: Buttery smooth animations with Framer Motion, a beautiful dark-mode-first aesthetic, and responsive design.
- **Free-Tier Optimized**: Designed to run 100% on free tiers (Groq for LLM inference, Supabase for Vector DB, HuggingFace for Embeddings).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **LLM / AI Orchestration**: 
  - [LangChain](https://js.langchain.com/) for RAG workflows.
  - [Groq](https://groq.com/) for lightning-fast Llama-3 inference.
  - [HuggingFace Inference](https://huggingface.co/) for open-source embeddings (bge-small-en).
- **Database**: [Supabase (pgvector)](https://supabase.com/) for storing document embeddings.

---

## 🚀 Getting Started

### Prerequisites

You will need API keys for the following services (all offer generous free tiers):
1. **Supabase**: Create a project and enable the `pgvector` extension.
2. **Groq**: Generate an API key for fast LLM inference.

### 1. Clone the repository

```bash
git clone https://github.com/Nidhish-0810/Embedly.git
cd Embedly
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq
GROQ_API_KEY=your_groq_api_key
```

### 4. Database Setup

In your Supabase SQL editor, run the following to set up the `pgvector` extension and the `documents` table:

```sql
-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(384) -- 384 dimensions for BAAI/bge-small-en-v1.5
);

-- Create a function to search for documents
create function match_documents (
  query_embedding vector(384),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 💻 Project Structure

\`\`\`
Embedly/
├── src/
│   ├── app/
│   │   ├── api/          # Next.js API Routes (Chat, Ingest)
│   │   ├── dashboard/    # Main Dashboard (Agents, Knowledge, Settings)
│   │   ├── widget/       # Dynamic Chat Widget iframe targets
│   │   ├── login/        # Auth Pages
│   │   ├── signup/       
│   │   └── page.tsx      # Beautiful Landing Page
│   ├── components/       # Reusable React components & Contexts
│   └── utils/            # Utility functions (Supabase client)
├── public/               # Static assets
└── ...
\`\`\`

---

## 📄 License

This project is open-source and available under the MIT License.
