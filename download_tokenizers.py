from transformers import AutoTokenizer
models = ["cognitivecomputations/dolphin-2.7-mixtral-8x7b",
          "jinaai/jina-embeddings-v2-base-en"]
for model in models:
    tokenizer = AutoTokenizer.from_pretrained(model)
    tokenizer.save_pretrained(
        "./supabase/functions/_shared/tokenizers/" + model)
