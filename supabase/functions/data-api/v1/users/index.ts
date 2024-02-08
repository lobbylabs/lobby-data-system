import { Router, Status } from "oak";
import { conversationsRouter } from "./conversations/index.ts";

const usersRouter = new Router();

usersRouter
  .get("/", async (context) => {
    const { data, error } = await context.state.sbclient.rpc("get_users_orgs", {
      p_organization_id: null,
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
  .post("/", async (context) => {
    const body = await context.request.body().value;
    console.log(body);

    const { data, error } = await context.state.sbclient.rpc("create_user", {
      p_organization_id: body.organization_id ?? null,
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
    // context.response.body = "Creating a new user.";
  })
  .get("/:userId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Fetching user with ID: ${context.params.userId}`;
  })
  .put("/:userId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating user with ID: ${context.params.userId}`;
  })
  .delete("/:userId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting user with ID: ${context.params.userId}`;
  })
  .get("/:userId/organization", (context) => {
    //     const { data, error } = await supabaseClient.rpc("get_users_orgs", {
    //       p_organization_id: null,
    //     });

    //     console.log("error:", error);
    //     console.log("data:", data);

    //     if (error) {
    //       context.response.status = Status.BadRequest;
    //       context.response.body = { error };
    //     } else {
    //       context.response.status = Status.OK;
    //       context.response.body = { data };
    //     }
    context.response.status = Status.NotImplemented;
    context.response.body = `Getting all organizations a user is in with ID: ${context.params.userId}`;
  })
  .use(
    "/:userId/conversations",
    conversationsRouter.routes(),
    conversationsRouter.allowedMethods()
  );

export { usersRouter };
