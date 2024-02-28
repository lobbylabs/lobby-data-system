import { Router, Status } from "oak";

const organizationsRouter = new Router();

organizationsRouter
  .get("/", async (context) => {
    const { data, error } = await context.state.sbclient.rpc(
      "get_organizations"
    );

    if (error) {
      context.response.status = Status.BadRequest;
      context.response.body = { error: error };
    } else {
      context.response.status = Status.OK;
      context.response.body = {
        status: context.response.status,
        data: data,
        message: "Organization list retrieved succesfully",
      };
    }
  })
  .post("/", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = "Creating a new organization.";
  })
  .get("/:orgId", async (context) => {
    const orgId = context.params.orgId;

    const { data, error } = await context.state.sbclient.rpc(
      "get_organization",
      { p_organization_id: orgId }
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
        message: "Organization details retrieved succesfully",
      };
    }
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
    // console.log(context);

    const { data, error } = await context.state.sbclient.rpc(
      "get_organization_users",
      { p_organization_id: orgId }
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
        message: "Organization users retrieved succesfully",
      };
    }
  });
export { organizationsRouter };
