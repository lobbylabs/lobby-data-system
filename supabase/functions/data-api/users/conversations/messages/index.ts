import { Router, Status } from "oak";
import {
  Conversation,
  Model,
  Role,
  validCovnersation,
  getNumTokens,
} from "../../../../_shared/utils.ts";
import { openai } from "../../../../_shared/openai.ts";
import { sbclient } from "../../../../_shared/supabase.ts";

const messagesRouter = new Router();

messagesRouter
  .get("/", async (context) => {
    console.log(context);
    const userId = context.params.userId;
    const convId = context.params.convId;

    const { data, error } = await sbclient.rpc("get_user_messages", {
      p_user_id: userId,
      p_conversation_id: convId
    });

    console.log("error:", error);
    console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error };
    } else {
      context.response.status = Status.OK;
      context.response.body = { data };
    }
  })
  .post("/", async (context) => {
    const {bot_id, organization_id } = await context.request.body().value;
    console.log(bot_id, organization_id);
    const userId = context.params.userId;
    const convId = context.params.convId;

    const { data: messagesData, error: messagesError } = await sbclient.rpc("get_user_messages", {
      p_user_id: userId,
      p_conversation_id: convId
    });

    // Implement the logic to generate a chat completion
    // Store the chat history in the database using Supabase client
    // Return the chat completion

    // try to retrieve a user conversation if provided with id

    // grab new context from bot
    const { data, error } = await sbclient.rpc("get_bot", {
      p_organization_id: organization_id,
      p_bot_id: bot_id
    });

    console.log("error:", error);
    console.log("data:", data);

    let systemMessage = ""

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error };
    } else {
      systemMessage = data.system_prompt
    }

    let messages: Conversation = [
      { role: Role.System, content: "you are a helpful assistant" },
      { role: Role.User, content: "Hello, how are you?" },
      {
        role: Role.Assistant,
        content: "The Los Angeles Dodgers won the World Series in 2020.",
      },
      { role: Role.User, content: "Where was it played?" },
      {
        role: Role.Assistant,
        content: "The Los Angeles Dodgers won the World Series in 2020.",
      },
      { role: Role.User, content: "Where was it played?" },
      {
        role: Role.Assistant,
        content: "The Los Angeles Dodgers won the World Series in 2020.",
      },
      {
        role: Role.User,
        content:
          "Where was it played? I don't know anything, so explain it all",
      },
    ];

    console.log(validCovnersation(messages));

    const num_tokens = getNumTokens(
      Model.cognitivecomputations_dolphin_2_7_mixtral_8x7b,
      messages
    );
    console.log("num_tokens_expected:");
    console.log(num_tokens);

    const completion = await openai.chat.completions.create({
      messages,
      model: "mixtral",
    });

    console.log(completion);

    context.response.body = { data: { choices: [] } };
  })
  .get("/:messageId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Fetching message with ID: ${context.params.messageId} within a specific conversation.`;
  })
  .put("/:messageId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating message with ID: ${context.params.messageId} within a specific conversation.`;
  })
  .delete("/:messageId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting message with ID: ${context.params.messageId} within a specific conversation.`;
  });

export { messagesRouter };
