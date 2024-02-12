import { Router, Status } from "oak";
import { messagesRouter } from "./messages/index.ts";

const conversationsRouter = new Router();

conversationsRouter
  .get("/", async (context) => {
    const userId = context.params.userId;

    const { data, error } = await context.state.sbclient.rpc(
      "get_user_conversations",
      {
        p_user_id: userId,
      }
    );

    // console.log("error:", error);
    // console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: error };
    } else {
      context.response.status = Status.OK;
      context.response.body = { data: data };
    }
  })
  .post("/", async (context) => {
    const userId = context.params.userId;
    const { organization_id, bot_id } = await context.request.body.json();

    const { data, error } = await context.state.sbclient.rpc(
      "create_conversation",
      {
        p_user_id: userId,
        p_organization_id: organization_id,
        p_bot_id: bot_id,
      }
    );

    // console.log("error:", error);
    // console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: error };
    } else {
      context.response.status = Status.OK;
      context.response.body = { data: data };
    }
  })
  .get("/:convId", async (context) => {
    const { userId, convId } = context.params;

    const { data, error } = await context.state.sbclient.rpc(
      "get_user_conversation",
      {
        p_user_id: userId,
        p_conversation_id: convId,
      }
    );

    // console.log("error:", error);
    // console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: error };
    } else {
      context.response.status = Status.OK;
      context.response.body = { data: data };
    }
  })
  .put("/:convId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating conversation with ID: ${context.params.convId}`;
  })
  .delete("/:convId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting conversation with ID: ${context.params.convId}`;
  })
  .use(
    "/:convId/messages",
    messagesRouter.routes(),
    messagesRouter.allowedMethods()
  );

export { conversationsRouter };
