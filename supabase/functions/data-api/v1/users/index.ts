import { Router, Status } from "oak";

const usersRouter = new Router();

usersRouter
  .get("/", async (context) => {
    const { data, error } = await context.state.sbclient.rpc(
      "get_user_organizations"
    );

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
        message: "User list retrieved succesfully",
      };
    }
  })
  .post("/", async (context) => {
    const body = await context.request.body.json();

    const { data, error } = await context.state.sbclient.rpc("create_user", {
      p_organization_id: body.organization_id ?? null,
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
        message: "User created succesfully",
      };
    }
  })
  .get("/:userId", async (context) => {
    const userId = context.params.userId;
    const { data, error } = await context.state.sbclient.rpc(
      "get_user_organization_info",
      { p_user_id: userId }
    );

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
        message: "User details retrieved succesfully",
      };
    }
  })
  .patch("/:userId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating user with ID: ${context.params.userId}`;
  })
  .delete("/:userId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting user with ID: ${context.params.userId}`;
  })
  .post("/:userId/organizations/:organizationId", async (context) => {
    const userId = context.params.userId;
    const organizationId = context.params.organizationId;
    const { data, error } = await context.state.sbclient.rpc(
      "update_user_orgs",
      { p_user_id: userId, p_organization_id: organizationId }
    );

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
        message: "User added to organization succesfully",
      };
    }
  });

export { usersRouter };
