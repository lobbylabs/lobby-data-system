import { Router, Status } from "oak";
import { messagesRouter } from "./messages/index.ts";
import { sbclient } from "../../../_shared/supabase.ts";

const conversationsRouter = new Router();

conversationsRouter
  .get("/", async (context) => {
    const userId = context.params.userId ?? null;
    console.log(context);

    const { data, error } = await sbclient.rpc("get_user_conversations", {
      p_user_id: userId ?? null,
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
    const { user_id, organization_id, bot_id } = await context.request.body()
      .value;
    console.log(user_id, organization_id, bot_id);

    const { data, error } = await sbclient.rpc("create_conversation", {
      p_user_id: user_id,
      p_organization_id: organization_id,
      p_bot_id: bot_id,
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
  .get("/:convId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Fetching conversation with ID: ${context.params.convId}`;
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
