import { Router, Status } from "oak";
import { sbclient } from "../../_shared/supabase.ts";
import { botsRouter } from "./bots/index.ts";

const organizationsRouter = new Router();

organizationsRouter
  .get("/", async (context) => {
    const { data, error } = await sbclient.from("organizations").select("*");

    console.log("error:", error);
    console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: error };
    } else {
      context.response.status = Status.OK;
      context.response.body = { data: data };
    }
  })
  .post("/", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = "Creating a new organization.";
  })
  .get("/:orgId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Fetching organization with ID: ${context.params.orgId}`;
  })
  .put("/:orgId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating organization with ID: ${context.params.orgId}`;
  })
  .delete("/:orgId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting organization with ID: ${context.params.orgId}`;
  })
  .get("/:orgId/users", async (context) => {
    const orgId = context.params.orgId;
    console.log(context);

    const { data, error } = await sbclient.rpc("get_users_orgs", {
      p_organization_id: orgId,
    });

    console.log("error:", error);
    console.log("data:", data);

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: error };
    } else {
      context.response.status = Status.OK;
      context.response.body = { data: data };
    }
  })
  .use("/:orgId/bots", botsRouter.routes(), botsRouter.allowedMethods());
export { organizationsRouter };
