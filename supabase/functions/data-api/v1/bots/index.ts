import { Router, Status } from "oak";

const botsRouter = new Router();

botsRouter
  .get("/", async (context) => {
    const orgId = context.params.orgId;
    // console.log("orgId:", orgId);
    const { data, error } = await context.state.sbclient.rpc("get_bots", {
      p_organization_id: orgId,
    });

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
        message: "Bot list retrieved succesfully",
      };
    }
  })
  .post("/", async (context) => {
    // creating a new bot
    const orgId = context.params.orgId;
    const { user_id_owner, system_prompt } = await context.request.body.json();
    // console.log(orgId, user_id_owner, system_prompt);
    const { data, error } = await context.state.sbclient.rpc("create_bot", {
      p_organization_id: orgId,
      p_user_id_owner: user_id_owner,
      p_system_prompt: system_prompt ?? "",
    });
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
        message: "Bot created succesfully",
      };
    }
  })
  .get("/:botId", async (context) => {
    const orgId = context.params.orgId;
    const botId = context.params.botId;
    // console.log("orgId:", orgId);
    const { data, error } = await context.state.sbclient.rpc("get_bot", {
      p_organization_id: orgId,
      p_bot_id: botId,
    });

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
        message: "Bot retrieved succesfully",
      };
    }
  })
  .patch("/:botId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating bot with ID: ${context.params.botId}`;
  })
  .delete("/:botId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting bot with ID: ${context.params.botId}`;
  });

export { botsRouter };
