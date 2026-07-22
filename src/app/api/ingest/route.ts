import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as cheerio from "cheerio";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = createClient(supabaseUrl, supabaseKey);

// Initialize HuggingFace Embeddings (Free Tier via HF Inference API)
// If we had a HF API token we would put it here. Without it, it uses rate-limited public access
const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "BAAI/bge-small-en-v1.5",
});

export async function POST(req: NextRequest) {
  try {
    const { url, agentId = "default" } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Scrape the website
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove scripts, styles, etc.
    $("script, style, noscript, iframe, img, svg").remove();
    const textContent = $("body").text().replace(/\s+/g, " ").trim();

    if (!textContent) {
      return NextResponse.json({ error: "No text found on the page" }, { status: 400 });
    }

    // 2. Chunk the text
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const docs = await textSplitter.createDocuments(
      [textContent],
      [{ source: url, agentId }]
    );

    // 3. Embed and store in Supabase pgvector
    await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    return NextResponse.json({ 
      success: true, 
      chunks: docs.length,
      message: `Successfully ingested ${url} into ${docs.length} chunks.` 
    });

  } catch (error: any) {
    console.error("Ingestion error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
