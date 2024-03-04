import { Router, Status } from "oak";

const conversationsRouter = new Router();

conversationsRouter
  .get("/", async (context) => {
    const userId = context.params.userId;
    const botId = context.request.url.searchParams.get("p_bot_id");
    const orgId = context.request.url.searchParams.get("p_organization_id");
    console.log(botId, orgId)

    const { data, error } = await context.state.sbclient.rpc(
      "get_user_conversations",
      {
        p_user_id: userId,
        p_bot_id: botId,
        p_organization_id: orgId,
      }
    );

    // console.log("error:", error);
    // console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = {
        status: context.response.status,
        data: null,
        message: error.message,
        error_details: error,
      };
    } else {
      context.response.status = Status.OK;
      context.response.body = {
        status: context.response.status,
        data: data,
        message: "Conversations retrieved succesfully",
      };
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
      context.response.body = {
        status: context.response.status,
        data: null,
        message: error.message,
        error_details: error,
      };
    } else {
      context.response.status = Status.OK;
      context.response.body = {
        status: context.response.status,
        data: data[0],
        message: "Conversation created succesfully",
      };
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
      context.response.body = {
        status: context.response.status,
        data: null,
        message: error.message,
        error_details: error,
      };
    } else {
      context.response.status = Status.OK;
      context.response.body = {
        status: context.response.status,
        data: data[0],
        message: "Conversation retrieved succesfully",
      };
    }
  })
  .patch("/:convId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating conversation with ID: ${context.params.convId}`;
  })
  .delete("/:convId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting conversation with ID: ${context.params.convId}`;
  });

export { conversationsRouter };
