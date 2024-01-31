import { Application, Router } from "oak";
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
  createClient,
} from "@supabase/supabase-js";
import OpenAI from "openai";

const router = new Router();

const openai = new OpenAI({
  apiKey: "6d8c5840-99c3-4540-bc26-4ed695523358",
  baseURL: "https://api.lobby-edge.com/v1",
});

const supabaseClient = await createClient(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL")!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  {
    db: {
      schema: "data",
    },
  }
);

// Generate the chat completion
router
  .post("/data-api/chat-completion", async (context) => {
    // const { prompt, max_tokens, temperature, stream } = await context.request.body();
    let body = await context.request.body().value;
    console.log(body);

    // console.log(context)

    // const { data, error } = await supabaseClient.rpc('create_user', {
    // 	p_organization_id: body.user_id
    // });

    // console.log('inserted document: ', data);

    // if (error instanceof FunctionsHttpError) {
    //   const errorMessage = await error.context.json()
    //   console.log('Function returned an error', errorMessage)
    // } else if (error instanceof FunctionsRelayError) {
    //   console.log('Relay error:', error.message)
    // } else if (error instanceof FunctionsFetchError) {
    //   console.log('Fetch error:', error.message)
    // }

    // Implement the logic to generate a chat completion
    // Store the chat history in the database using Supabase client
    // Return the chat completion

    // const openai = new OpenAI({
    //   apiKey: "6d8c5840-99c3-4540-bc26-4ed695523358",
    //   baseURL: "https://staging-api.lobby-edge.com/v1",
    // });
    let text = ["The quick brown fox jumped over the lazy dog"];


    const embedding = await openai.embeddings.create({
      input: text,
      model: "jina-embeddings-v2-base-en",
    });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
        {
          role: "assistant",
          content: "The Los Angeles Dodgers won the World Series in 2020.",
        },
        { role: "user", content: "Where was it played?" },
      ],
      model: "mixtral",
    });

    console.log(completion.choices[0]);

    context.response.body = { data: { choices: [] } };
  })

  // Ingest a text document
  .post("/data-api/ingest-document", async (context) => {
    const { text, bot_id } = context.request.body;
    let body = await context.request.body().value;
    console.log(body);
    // Store the document in the database using Supabase client
    context.response.body = { message: "Document ingested" };
  })

  // CRUD routes for users
  .get("/data-api/users", async (context) => {
    // Retrieve all users from the database using Supabase client
    const { data, error } = await supabaseClient.from('users').select('*');

    context.response.body = { users: data };
  })

  .post("/data-api/users", async (context) => {
    // Create a new user in the database using Supabase client
    context.response.body = { message: "User created" };
  })

  .put("/data-api/users/:id", async (context) => {
    // Update an existing user in the database using Supabase client
    context.response.body = { message: "User updated" };
  })

  .delete("/data-api/users/:id", async (context) => {
    // Delete a user from the database using Supabase client
    context.response.body = { message: "User deleted" };
  })

  // CRUD routes for conversations
  .get("/data-api/conversations", async (context) => {
    // Retrieve all conversations from the database using Supabase client
    context.response.body = { conversations: [] };
  })

  .post("/data-api/conversations", async (context) => {
    // Create a new conversation in the database using Supabase client
    context.response.body = { conversation: { id: "new-id" } };
  })

  .put("/data-api/conversations/:id", async (context) => {
    // Update an existing conversation in the database using Supabase client
    context.response.body = { message: "Conversation updated" };
  })

  .delete("/data-api/conversations/:id", async (context) => {
    // Delete a conversation from the database using Supabase client
    context.response.body = { message: "Conversation deleted" };
  })

  // CRUD routes for organizations
  .get("/data-api/organizations", async (context) => {
    // Retrieve all organizations from the database using Supabase client
    context.response.body = { organizations: [] };
  })

  .post("/data-api/organizations", async (context) => {
    // Create a new organization in the database using Supabase client
    context.response.body = { organization: { id: "new-id" } };
  })

  .put("/data-api/organizations/:id", async (context) => {
    // Update an existing organization in the database using Supabase client
    context.response.body = { message: "Organization updated" };
  })

  .delete("/data-api/organizations/:id", async (context) => {
    // Delete an organization from the database using Supabase client
    context.response.body = { message: "Organization deleted" };
  })

  // CRUD routes for messages
  .get("/data-api/messages", async (context) => {
    // Retrieve all messages from the database using Supabase client
    context.response.body = { messages: [] };
  })

  .post("/data-api/messages", async (context) => {
    // Create a new message in the database using Supabase client
    context.response.body = { message: { id: "new-id" } };
  })

  .put("/data-api/messages/:id", async (context) => {
    // Update an existing message in the database using Supabase client
    context.response.body = { message: "Message updated" };
  })

  .delete("/data-api/messages/:id", async (context) => {
    // Delete a message from the database using Supabase client
    context.response.body = { message: "Message deleted" };
  });

// Add the router to the application
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
  if (!ctx.request.hasBody) {
    ctx.throw(415);
  }
});

// Start the server
const port = 8000;
console.log(`Server running on port ${port}`);
await app.listen({ port: port });
