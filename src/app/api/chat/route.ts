import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = createClient(supabaseUrl, supabaseKey);

const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "BAAI/bge-small-en-v1.5",
});

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant", // Using the fast, free Llama 3 model
});

const prompt = PromptTemplate.fromTemplate(`You are a helpful AI assistant for a website. 
Use the following pieces of retrieved context to answer the user's question. 
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Keep the answer concise and helpful.

Context: {context}

Question: {question}

Answer:`);

export async function POST(req: NextRequest) {
  try {
    const { message, agentId = "default" } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Initialize Vector Store
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
      filter: { agentId },
    });

    // 2. Retrieve relevant documents (filter by agentId in metadata)
    const relevantDocs = await vectorStore.similaritySearch(message, 4);
    // Filter client-side by agentId in case vector store doesn't support metadata filtering
    const filtered = relevantDocs.filter(d => !d.metadata.agentId || d.metadata.agentId === agentId);
    const contextText = (filtered.length > 0 ? filtered : relevantDocs).map((doc) => doc.pageContent).join("\n\n");

    // 3. Create LangChain sequence
    const chain = RunnableSequence.from([
      {
        context: () => contextText,
        question: () => message,
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // 4. Generate response
    const result = await chain.invoke({});

    return NextResponse.json({ answer: result, sources: relevantDocs.map(d => d.metadata.source) });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
