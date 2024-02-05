import OpenAI from "openai";
import { Model, getNumTokens } from "./utils.ts";

// Configure your OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get("INFERENCE_SERVER_TOKEN")!,
  baseURL: "https://api.lobby-edge.com/v1",
});

async function getJinaEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const maxTokens = 4000;
    // Create the batches
    const batches = batchTextsByTokenCount(texts, maxTokens, Model.jinaai_jina_embeddings_v2_base_en);

    // Collect embeddings for each batch, maintaining order
    const allEmbeddings: number[][] = [];
    for (const batch of batches) {
      const embeddingResponse = await openai.embeddings.create({
        input: batch,
        model: "jina-embeddings-v2-base-en",
      });
      allEmbeddings.push(...embeddingResponse.data.map(obj => obj.embedding));
    }
  
    return allEmbeddings;
}

function batchTextsByTokenCount(texts: string[], maxTokens: number, model: Model): string[][] {
    const batches: string[][] = [];
    let currentBatch: string[] = [];
    let currentTokenCount = 0;
  
    for (const text of texts) {
      const textTokenCount = getNumTokens(model, text);
      if (currentTokenCount + textTokenCount > maxTokens) {
        // Start a new batch
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
        }
        currentBatch = [text];
        currentTokenCount = textTokenCount;
      } else {
        // Add to current batch
        currentBatch.push(text);
        currentTokenCount += textTokenCount;
      }
    }
  
    // Don't forget to add the last batch
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }
  
    return batches;
  }
  

// Export the configured OpenAI client
export { openai, getJinaEmbeddings };
