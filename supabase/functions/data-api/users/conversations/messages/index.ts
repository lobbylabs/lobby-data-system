import { Router, ServerSentEvent, Status } from "oak";
import {
  Conversation,
  Model,
  Role,
  getNumTokens,
  Message,
} from "../../../../_shared/utils.ts";
import { openai, getJinaEmbeddings } from "../../../../_shared/openai.ts";
import { sbclient } from "../../../../_shared/supabase.ts";

const messagesRouter = new Router();

messagesRouter
  .get("/", async (context) => {
    const userId = context.params.userId;
    const convId = context.params.convId;
    // console.log(userId, convId);
    console.log("Getting conversation");
    const { data, error } = await sbclient.rpc("get_user_messages", {
      p_user_id: userId,
      p_conversation_id: convId,
    });

    // console.log("error:", error);
    // console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: error };
    } else {
      context.response.status = Status.OK;
      if (data[0]) {
        data.map((message) => {
          message["message_content_embedding_ada_002"] = undefined;
          message["message_content_embedding_jina_v2_base_en"] = undefined;
        });
      }

      context.response.body = { data: data };
    }
  })
  .post("/", async (context) => {
    let {
      bot_id,
      organization_id,
      input,
      stream,
      accumulate,
      full_conversation,
      num_message_history,
    } = await context.request.body().value;
    // console.log(bot_id, organization_id, input);
    const userId = context.params.userId;
    const convId = context.params.convId;

    // Get the conversation record for this request
    console.log("Getting conversation");
    const { data: conversationData, error: conversationError } =
      await sbclient.rpc("get_user_conversation", {
        p_user_id: userId,
        p_conversation_id: convId,
      });

    // console.log("error:", conversationError);
    // console.log("data:", conversationData);

    if (conversationError) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: conversationError };
      return;
    }

    // If the bot id isn't provided in either the request body or conversation info we can't complete the request
    if (!bot_id && conversationData.bot_id) {
      bot_id = conversationData.bot_id;
    } else if (!bot_id && !conversationData.bot_id) {
      context.response.status = Status.BadRequest;
      context.response.body = {
        code: "",
        details: "bot_id missing",
        hint: null,
        message:
          "bot_id must be included in the request body or set on the conversation",
      };
      return;
    }

    // If the organization id isn't provided in either the request body or conversation info we can't complete the request
    if (!organization_id && conversationData.organization_id) {
      organization_id = conversationData.organization_id;
    } else if (!organization_id && !conversationData.organization_id) {
      context.response.status = Status.BadRequest;
      context.response.body = {
        code: "",
        details: "organization_id missing",
        hint: null,
        message:
          "organization_id must be included in the request body or set on the conversation",
      };
      return;
    }

    // get the conversation messages to use in the
    console.log("Getting message history");
    const { data: messagesData, error: messagesError } = await sbclient.rpc(
      "get_user_messages",
      {
        p_user_id: userId,
        p_conversation_id: convId,
        p_num_messages: num_message_history,
      }
    );

    // console.log("error:", messagesError);
    // console.log("data:", messagesData);

    if (messagesError) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: messagesError };
      return;
    }

    const messageHistory: Message[] = messagesData.map(
      (message) =>
        new Message(message.message_type as Role, message.message_content)
    );
    console.log("Message history: found ", messageHistory.length, " messages");

    // console.log("messageHistory:", messageHistory);

    const newUserMessage = new Message(Role.User, input);
    // console.log("newUserMessage:", newUserMessage);
    const newUserMessageContentEmbedding = (
      await getJinaEmbeddings([newUserMessage.content])
    )[0];

    // grab system message and context from bot
    console.log("Getting bot");
    const { data: botData, error: botError } = await sbclient.rpc("get_bot", {
      p_organization_id: organization_id,
      p_bot_id: bot_id,
    });
    // console.log("error:", botError);
    // console.log("data:", botData);

    if (botError) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: botError };
      return;
    }

    const systemMessage = new Message(Role.System, botData.system_prompt);
    // console.log("systemMessage:", systemMessage);

    console.log("Getting context");
    // GET CONTEXT

    console.log("Constructing conversation");
    const conversation: Conversation = [
      systemMessage,
      ...messageHistory,
      newUserMessage,
    ];
    const conversation_json = JSON.parse(JSON.stringify(conversation));

    // console.log("conversation:", conversation);

    // console.log("HERE");

    const num_tokens = getNumTokens(
      Model.cognitivecomputations_dolphin_2_7_mixtral_8x7b,
      conversation_json
    );
    console.log("num_input_tokens_expected:");
    console.log(num_tokens);

    // save the new user message
    const { data: createNewUserMessageData, error: createNewUserMessageError } =
      await sbclient.rpc("create_message", {
        p_user_id: userId,
        p_organization_id: organization_id,
        p_bot_id: bot_id,
        p_conversation_id: convId,
        p_message_type: Role.User,
        p_message_content: newUserMessage.content,
        p_message_content_embedding_jina_v2_base_en:
          newUserMessageContentEmbedding,
      });

    // console.log("error:", createNewUserMessageError);
    // console.log("data:", createNewUserMessageData);

    if (createNewUserMessageError) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: createNewUserMessageError };
      return;
    }

    if (stream) {
      context.sendEvents();
    }
    // Initialize an empty string to accumulate message content
    let accumulatedContent = "";
    let finalResponse = {}; // To store the final response structure

    // Initialize a readable stream for the response body
    const responseStream = new ReadableStream({
      async start(controller) {
        const completion = await openai.chat.completions.create({
          messages: conversation_json,
          model: "mixtral",
          stream: true,
          max_tokens: 100,
        });
        console.log("Sending data packets...");
        for await (const chunk of completion) {
          //   // Check if the chunk has a delta and content
          if (
            chunk.choices[0].delta &&
            chunk.choices[0].delta.content !== undefined
          ) {
            // Accumulate the content
            accumulatedContent += chunk.choices[0].delta.content;
            // console.log(accumulatedContent.length);
            if (stream && accumulate) {
              controller.enqueue(
                `data: ${JSON.stringify({
                  finish_reason: chunk.choices[0].finish_reason,
                  data: { message_content: accumulatedContent },
                })}\n\n`
              );
            } else if (stream) {
              controller.enqueue(
                `data: ${JSON.stringify({
                  finish_reason: chunk.choices[0].finish_reason,
                  data: { message_content: chunk.choices[0].delta.content },
                })}\n\n`
              );
            }
          }

          // Check if the chunk is the last one (finish_reason is not null)
          if (chunk.choices[0].finish_reason) {
            console.log(
              "Inference Server: finish_reason:",
              chunk.choices[0].finish_reason
            );
            // Construct the final response from inference server
            finalResponse = {
              id: chunk.id,
              object: "chat.completion",
              created: chunk.created,
              model: chunk.model,
              choices: [
                {
                  index: 0,
                  message: {
                    role: "assistant",
                    content: accumulatedContent,
                  },
                  finish_reason: chunk.choices[0].finish_reason,
                },
              ],
              usage: chunk.usage,
            };
            // console.log("Final accumulated response:", finalResponse);
          }
        }

        const newMessage: Message = new Message(
          finalResponse.choices[0].message.role as Role,
          finalResponse.choices[0].message.content as string
        );
        // console.log("newMessage:", newMessage);

        let {
          data: createNewAssistantMessageData,
          error: createNewAssistantMessageError,
        } = await sbclient.rpc("create_message", {
          p_user_id: userId,
          p_organization_id: organization_id,
          p_bot_id: bot_id,
          p_conversation_id: convId,
          p_message_type: Role.Assistant,
          p_message_content: newMessage.content,
          p_message_content_embedding_jina_v2_base_en: (
            await getJinaEmbeddings([newMessage.content])
          )[0],
        });

        // console.log("error:", createNewAssistantMessageError);
        // console.log("data:", createNewAssistantMessageData);

        if (createNewAssistantMessageError) {
          context.response.status = Status.BadRequest;
          context.response.body = { error: createNewAssistantMessageError };
          return;
        }

        // TODO: change to more proper filter
        createNewAssistantMessageData[0]["message_content_embedding_ada_002"] =
          undefined;
        createNewAssistantMessageData[0][
          "message_content_embedding_jina_v2_base_en"
        ] = undefined;

        let ret_data = null;

        if (full_conversation) {
          const { data: fullConvoData, error: fullConvoError } =
            await sbclient.rpc("get_user_messages", {
              p_user_id: userId,
              p_conversation_id: convId,
            });

          // console.log("fullConvoError:", fullConvoData);
          // console.log("fullConvoData:", fullConvoData);

          if (fullConvoError) {
            context.response.status = Status.BadRequest;
            context.response.body = { error: fullConvoData };
          } else {
            if (fullConvoData[0]) {
              fullConvoData.map((message) => {
                message["message_content_embedding_ada_002"] = undefined;
                message["message_content_embedding_jina_v2_base_en"] =
                  undefined;
              });
            }
          }
          ret_data = fullConvoData;
        } else {
          ret_data = createNewAssistantMessageData;
        }

        // console.log("ret_data:", ret_data);

        if (stream) {
          controller.enqueue(
            `data: ${JSON.stringify({
              finish_reason: finalResponse.choices[0].finish_reason,
              data: ret_data,
            })}\n\n`
          );
        } else {
          context.response.body = { data: ret_data };
        }
        controller.close(); // Close the stream once all data is sent
        console.log("... All data packets sent");
        console.log("Stream processing completed");
        console.log("Usage:")
        console.log(finalResponse.usage)
      },
    });

    if (stream) {
      context.response.body = responseStream;
    } else {
      try {
        // This is to just wait until the stream is done
        for await (const _ of responseStream);
      } catch (err) {
        console.error("Error during stream processing:", err);
      }
    }
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
