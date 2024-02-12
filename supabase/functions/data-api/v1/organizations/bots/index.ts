import { Router, Status } from "oak";
import { documentsRouter } from "./documents/index.ts";

const botsRouter = new Router();

botsRouter
  .get("/", async (context) => {
    const orgId = context.params.orgId;
    // console.log("orgId:", orgId);
    const { data, error } = await context.state.sbclient.rpc("get_bots", {
      p_organization_id: orgId,
    });

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
    // creating a new bot
    const orgId = context.params.orgId;
    const { user_id_owner, system_prompt } = await context.request.body.json();
    // console.log(orgId, user_id_owner, system_prompt);
    const { data, error } = await context.state.sbclient.rpc("create_bot", {
      p_organization_id: orgId,
      p_user_id_owner: user_id_owner,
      p_system_prompt: system_prompt ?? "",
    });

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
  .get("/:botId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Fetching bot with ID: ${context.params.botId}`;
  })
  .put("/:botId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating bot with ID: ${context.params.botId}`;
  })
  .delete("/:botId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting bot with ID: ${context.params.botId}`;
  })
  .use(
    "/:botId/documents",
    documentsRouter.routes(),
    documentsRouter.allowedMethods()
  );

export { botsRouter };
