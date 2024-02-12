import { Router } from "oak";
import { organizationsRouter } from "./organizations/index.ts";
import { usersRouter } from "./users/index.ts";

const v1Router = new Router();

v1Router
  .use(
    "/organizations",
    organizationsRouter.routes(),
    organizationsRouter.allowedMethods()
  )
  .use("/users", usersRouter.routes(), usersRouter.allowedMethods());
export { v1Router };
