from transformers import AutoTokenizer
import os
tokenizer = AutoTokenizer.from_pretrained("cognitivecomputations/dolphin-2.7-mixtral-8x7b")

os.environ['HF_TOKEN'] = "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"
tokenizer2 = AutoTokenizer.from_pretrained("jinaai/jina-embeddings-v2-base-en", trust_remote_code=True)
chat = [
      { "role": "system", "content": "you are a helpful assistant" },
      { "role": "user", "content": "Hello, how are you?" },
      {
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the World Series in 2020.",
      },
      { "role": "user", "content": "Where was it played?" },
      {
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the World Series in 2020.",
      },
      { "role": "user", "content": "Where was it played?" },{
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the World Series in 2020.",
      },
      { "role": "user", "content": "Where was it played? I don't know anything, so explain it all" },
    ]



# print(tokenizer.apply_chat_template(chat, tokenize=True))
print(len(tokenizer.encode("Where was it played? I don't know anything, so explain it all")))
print(len(tokenizer2.encode("Where was it played? I don't know anything, so explain it all")))