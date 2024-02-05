import {
  env,
  AutoTokenizer,
  PreTrainedTokenizer,
  //   GenerationConfig,
} from "@xenova/transformers";
import {getJinaEmbeddings} from "./openai.ts"

import cognitivecomputations_dolphin_2_7_mixtral_8x7b_tokenizerJSON from "./tokenizers/cognitivecomputations/dolphin-2.7-mixtral-8x7b/tokenizer.json" with {
  type: "json",
};
import cognitivecomputations_dolphin_2_7_mixtral_8x7b_tokenizerConfig from "./tokenizers/cognitivecomputations/dolphin-2.7-mixtral-8x7b/tokenizer_config.json" with {
  type: "json",
};
import jinaai_jina_embeddings_v2_base_en_tokenizerJSON from "./tokenizers/jinaai/jina-embeddings-v2-base-en/tokenizer.json" with {
  type: "json",
};
import jinaai_jina_embeddings_v2_base_en_tokenizerConfig from "./tokenizers/jinaai/jina-embeddings-v2-base-en/tokenizer_config.json" with {
  type: "json",
};

enum Model {
  cognitivecomputations_dolphin_2_7_mixtral_8x7b = "cognitivecomputations/dolphin-2.7-mixtral-8x7b",
  jinaai_jina_embeddings_v2_base_en = "jinaai/jina-embeddings-v2-base-en",
}

// // Define the type for tokenizerStore entries
type TokenizerStore = {
  [modelName in Model]: {
    tokenizerJSON: object;
    tokenizerConfig: object;
    tokenizer: PreTrainedTokenizer | null;
    chat_template: string | undefined;
  };
};

const tokenizerStore: TokenizerStore = {
  "cognitivecomputations/dolphin-2.7-mixtral-8x7b": {
    tokenizerJSON: cognitivecomputations_dolphin_2_7_mixtral_8x7b_tokenizerJSON,
    tokenizerConfig: cognitivecomputations_dolphin_2_7_mixtral_8x7b_tokenizerConfig,
    tokenizer: null,
    chat_template: "{% for message in messages %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}",
  },
  "jinaai/jina-embeddings-v2-base-en": {
    tokenizerJSON: jinaai_jina_embeddings_v2_base_en_tokenizerJSON,
    tokenizerConfig: jinaai_jina_embeddings_v2_base_en_tokenizerConfig,
    tokenizer: null,
    chat_template: undefined
  }
};

// Preparation for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;
env.allowRemoteModels = false;
console.log(env);

for (const [modelName, details] of Object.entries(tokenizerStore)) {

  const tokenizerName = details.tokenizerConfig.tokenizer_class?.replace(/Fast$/, '') ?? 'PreTrainedTokenizer';

  let cls = AutoTokenizer.TOKENIZER_CLASS_MAPPING[tokenizerName];
  if (!cls) {
    console.warn(`Unknown tokenizer class "${tokenizerName}", attempting to construct from base class.`);
    cls = PreTrainedTokenizer;
  }
  details.tokenizer = new cls(details.tokenizerJSON, details.tokenizerConfig);


  if (details.tokenizer) {
    console.log(`Tokenizer for ${modelName} is available.`);
    // Perform operations with details.tokenizer if needed...
  } else {
    console.log(`Tokenizer for ${modelName} failed to initialize.`);
  }


}
enum Role {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

type Conversation = {
  role: Role;
  content: string;
}[]

function getNumTokens(model: Model, input: string | Conversation): number {
  let tokenizerEntry = tokenizerStore[model];
  // Check if input is a Conversation (an array of objects with 'role' and 'content')
  if (Array.isArray(input) && input.every(item => typeof item === 'object' && 'role' in item && 'content' in item)) {
    // Handle the Conversation input
    // Assuming you want to concatenate all 'content' strings and then tokenize
    return tokenizerEntry.tokenizer.apply_chat_template(input, {
      tokenize: true,
      return_tensor: false,
      add_generation_prompt: false,
      chat_template: tokenizerEntry.chat_template,
    }).length + 4;
  } else if (typeof input === 'string') {
    // Handle the string input
    return tokenizerEntry.tokenizer.encode(input).length;
  } else {
    // If input doesn't match expected types, throw an error or handle as necessary
    throw new Error("Invalid input type");
  }
};

function validCovnersation(conversation: any[]): boolean {
  return conversation.every(item => 
    Object.values(Role).includes(item.role)
  );
}

type Chunk = {
  chunk_content_embedding_jina_v2_base_en: number[] | null,
  chunk_content_embedding_ada_002: number[] | null,
  chunk_content: string
}

async function getChunks(text: string, tokenLen: number): Promise<Chunk[]> {
  // split string into lenghts of tokenLen
  const words = text.split(/\s+/);
  const chunkStrings: string[] = [];

  let currentChunk = words[0] || '';
  let currentTokens = getNumTokens(Model.jinaai_jina_embeddings_v2_base_en, currentChunk);

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const newChunk = currentChunk + ' ' + word;
    const newChunkTokens = getNumTokens(Model.jinaai_jina_embeddings_v2_base_en, newChunk);

    if (newChunkTokens <= tokenLen) {
      // Update the current chunk and its token count
      currentChunk = newChunk;
      currentTokens = newChunkTokens;
    } else {
      // Current chunk is full, push it to the chunks array
      chunkStrings.push(currentChunk);
      // Start a new chunk with the current word
      currentChunk = word;
      currentTokens = getNumTokens(Model.jinaai_jina_embeddings_v2_base_en, word);
    }
  }

  // Don't forget to add the last chunk if it's not empty
  if (currentChunk) {
    chunkStrings.push(currentChunk);
  }
  // embed each string
  const embeddedChunks = await getJinaEmbeddings(chunkStrings);

  // create/return list of chunk objects
  // Combine both lists into an array of Chunk objects
  const chunks = chunkStrings.map((chunkContent, index) => ({
    chunk_content_embedding_jina_v2_base_en: embeddedChunks[index],
    chunk_content_embedding_ada_002: null,
    chunk_content: chunkContent
  }));

  return chunks
}





export { getNumTokens, validCovnersation, getChunks, Model, Role };
export type { Conversation, Chunk };
